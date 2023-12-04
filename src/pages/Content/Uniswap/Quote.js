/* eslint-disable no-unused-vars */
const { ethers } = require('ethers');
const { FeeAmount, computePoolAddress } = require('@uniswap/v3-sdk');
const quoterABI = require('../abi/quoterABI.json');
const uniswapV3poolABI = require('../abi/uniswapV3poolABI.json');
const { Token } = require('@uniswap/sdk-core');
const {
  fromReadableAmount,
  toReadableAmount,
  QUOTER_CONTRACT_ADDRESS,
  POOL_FACTORY_CONTRACT_ADDRESS,
  getProvider,
} = require('./constants');

/**
 *
 * Function to get quote for a swap.
 *
 * @param {Token} tokenIn - Token object for token to be swapped.
 * @param {Token} tokenOut - Token object for token to be received.
 * @param {number} amountIn - Amount of token to be swapped.
 * @returns {string} - Quoted amount of tokenOut.
 */
async function quote(tokenIn, tokenOut, amountIn) {
  const provider = getProvider();
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    quoterABI,
    provider
  );

  const { token0, token1, fee } = await getPoolConstants(tokenIn, tokenOut);

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    token0,
    token1,
    fee,
    fromReadableAmount(amountIn, tokenIn.decimals).toString(),
    0
  );
  return toReadableAmount(quotedAmountOut, tokenOut.decimals);
}

/**
 * Function to get pool constants.
 * @param {Token} tokenIn - Token object for token to be swapped.
 * @param {Token} tokenOut - Token object for token to be received.
 * @param {providers} provider - Provider object for ethers.js.
 * @returns {Promise<{
 * token0: string,
 * token1: string,
 * fee: number
 * sqrtPriceLimitX96: BigNumber
 * }>} - Pool constants.
 *
 */
async function getPoolConstants(tokenIn, tokenOut) {
  const provider = getProvider();
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: FeeAmount.MEDIUM,
  });

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    uniswapV3poolABI,
    provider
  );
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  return {
    token0,
    token1,
    fee,
  };
}

module.exports = quote;
