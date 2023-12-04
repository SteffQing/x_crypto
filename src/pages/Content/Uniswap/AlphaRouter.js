/* eslint-disable no-unused-vars */
const {
  Percent,
  CurrencyAmount,
  TradeType,
  Token,
} = require('@uniswap/sdk-core');
const { SwapType, AlphaRouter } = require('@uniswap/smart-order-router');
const JSBI = require('jsbi');
const {
  getProvider,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  v3Router,
} = require('./constants');

/**
 * Function to create a trade.
 * @param {Token} tokenIn - Token object for token to be swapped..
 * @param {Token} tokenOut - Token object for token to received..
 * @param {number} amount - Token amount to swap
 * @param {string} walletAddress - Wallet address
 * @returns {string} - Wallet address.
 *
 */
async function trade(tokenIn, tokenOut, amount, walletAddress) {
  const route = await getRoute(walletAddress, amount, tokenIn, tokenOut);
  const { maxFeePerGas, maxPriorityFeePerGas } =
    await getProvider().getFeeData();

  if (!route || !route.methodParameters) {
    // Handle failed request
    throw new Error('No route found');
  }

  const tx = {
    data: route.methodParameters.calldata,
    to: v3Router,
    value: route.methodParameters.value,
    from: walletAddress,
    maxFeePerGas: maxFeePerGas,
    maxPriorityFeePerGas: maxPriorityFeePerGas,
    // maxFeePerGas: MAX_FEE_PER_GAS,
    // maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    gasLimit: 3e7,
  };

  return tx;
}

/**
 * a getter function to grab trade route.
 *
 * @param {string} address - The receiver address
 * @param {number} amount - value to swap
 * @param {Token} tokenIn - Token object
 * @param {Token} tokenOut - token object
 * @param {('Buy' | 'Sell')} swapType - Indicates the type of swap
 * @return {SwapRoute | null} A SwapRoute object or null.
 *
 */
async function getRoute(address, amount, tokenIn, tokenOut) {
  const provider = getProvider();
  const options = {
    recipient: address,
    slippageTolerance: new Percent(50, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  };
  const router = new AlphaRouter({
    chainId: tokenIn.chainId,
    provider: provider,
  });
  const inputAmount = CurrencyAmount.fromRawAmount(
    tokenIn,
    fromReadableAmount(amount, tokenIn.decimals).toString()
  );

  // Error: Invariant failed: ADDRESSES
  const route = await router.route(
    inputAmount,
    tokenOut,
    TradeType.EXACT_INPUT,
    options
  );

  return route;
}
/**
 * A function to convert readable amount to raw amount.
 * @param {number} amount - readable amount
 * @param {number} decimals - tooken decimals
 * @return {bigint} A bigint to indicate raw amount.
 * @example
 * // returns 1000000000000000000n
 * fromReadableAmount(1, 18);
 *
 */
function fromReadableAmount(amount, decimals) {
  const extraDigits = Math.pow(10, countDecimals(amount));
  const adjustedAmount = amount * extraDigits;
  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    JSBI.BigInt(extraDigits)
  );
}

/**
 * A function to count decimals.
 * @param {number} x - number
 * @return {number} A number to indicate decimals.
 * @example
 * // returns 2
 * countDecimals(1.23);
 *
 */
function countDecimals(x) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split('.')[1].length || 0;
}

module.exports = trade;
