/* eslint-disable no-unused-vars */
const { ethers, providers } = require('ethers');
const { FeeAmount, computePoolAddress } = require('@uniswap/v3-sdk');
const uniswapV3poolABI = require('../abi/uniswapV3poolABI.json');
const { Token } = require('@uniswap/sdk-core');
const { POOL_FACTORY_CONTRACT_ADDRESS, getProvider } = require('./constants');

/**
 * Function to get pool constants.
 * @param {Token} tokenIn - Token object for token to be swapped.
 * @param {Token} tokenOut - Token object for token to be received.
 * @param {providers} provider - Provider object for ethers.js.
 * @returns {Promise<{
 *  token0: string
 *  token1: string
 *  fee: number
 *  tickSpacing: number
 *  sqrtPriceX96: BigNumber
 *  liquidity: BigNumber
 *  tick: number
 * }>} - Pool constants.
 *
 */
async function getPoolInfo(tokenIn, tokenOut) {
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

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

module.exports = getPoolInfo;
