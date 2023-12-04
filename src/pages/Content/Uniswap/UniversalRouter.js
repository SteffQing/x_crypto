/* eslint-disable no-unused-vars */
const {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} = require('@uniswap/sdk-core');
const {
  Pool,
  Route,
  SwapQuoter,
  SwapRouter,
  Trade,
  FeeAmount,
} = require('@uniswap/v3-sdk');
const { ethers } = require('ethers');
const JSBI = require('jsbi');
const {
  QUOTER_CONTRACT_ADDRESS,
  MAX_PRIORITY_FEE_PER_GAS,
  MAX_FEE_PER_GAS,
  getProvider,
  SWAP_ROUTER_ADDRESS,
  fromReadableAmount,
} = require('./constants');
const getPoolInfo = require('./Pool');
const quote = require('./Quote');

/**
 * Function to create a trade.
 *
 * @param {Token} tokenIn - Token object for token to be swapped..
 * @param {Token} tokenOut - Token object for token to be received.
 * @param {number} amount - Amount of token to be swapped.
 * @returns {string} - Wallet address.
 */
async function createTrade(tokenIn, tokenOut, amount) {
  const poolInfo = await getPoolInfo(tokenIn, tokenOut);

  const pool = new Pool(
    tokenIn,
    tokenOut,
    FeeAmount.MEDIUM,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );

  const swapRoute = new Route([pool], tokenIn, tokenOut);

  console.log(1);
  //   const amountOut = await getOutputQuote(swapRoute, tokenIn, amount);
  const amountOut = await quote(tokenIn, tokenOut, amount);

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      tokenIn,
      fromReadableAmount(amount, tokenIn.decimals).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      tokenOut,
      fromReadableAmount(amountOut, tokenOut.decimals).toString()
      //   JSBI.BigInt(amountOut)
    ),
    tradeType: TradeType.EXACT_INPUT,
  });

  return uncheckedTrade;
}

/**
 * Function to execute a trade.
 * @param {TradeType} trade - Trade object.
 *
 * @returns {Promise<TransactionState>} - Transaction state.
 */
async function executeTrade(trade, walletAddress) {
  const options = {
    slippageTolerance: new Percent(50, 10_000), // 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  return tx;
}

// Helper Quoting and Pool Functions
/**
 * Function to get output quote.
 * @param {Route<Currency, Currency>} route - Route object.
 * @param {Token} tokenIn - Token object for token to be swapped..
 * @param {number} amount - Amount of token to be swapped.
 * @returns {Promise<string>} - Quoted amount.
 */
async function getOutputQuote(route, tokenIn, amount) {
  const provider = getProvider();

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      tokenIn,
      fromReadableAmount(amount, tokenIn.decimals).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });

  return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData);
}

/**
 * Function to return Transaction to trade.
 * @param {Token} tokenIn - Token object for token to be swapped..
 * @param {Token} tokenOut - Token object for token to be received.
 * @param {number} amount - Amount of token to be swapped.
 * @param {string} walletAddress - Wallet address.
 * @returns {Promise<TransactionState>} - Transaction state
 */
async function trade(tokenIn, tokenOut, amount, walletAddress) {
  const trade = await createTrade(tokenIn, tokenOut, amount);
  const tx = await executeTrade(trade, walletAddress);
  return tx;
}

module.exports = trade;
