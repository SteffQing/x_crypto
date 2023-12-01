/* eslint-disable no-undef */
const { Token, WETH9, Percent, TradeType } = require('@uniswap/sdk-core');
const { Contract, Wallet, ethers } = require('ethers');
const erc20ABI = require('./abi/erc20ABI.json');
const {
  AlphaRouter,
  SwapType,
  CurrencyAmount,
} = require('@uniswap/smart-order-router');
const JSBI = require('jsbi');

// Constants
const _provider = new ethers.providers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/6cf8681d3779458a8a6b8ffe4d3ad8bf'
);
const v3Router = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
// const v3Router = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
// const v2Router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
let pk = '0xbe903edf0be27f6e59cb6dce608268f320dc42a0cbd2e188549a982939aee5ac';

// Functions
/**
 * The entry function to executing a swap on the extension.
 *
 * @param {Token} tokenData: {address: string, decimal: number | string, networkId: number | string, name: string, symbol: string} - A Token object param (see https://uniswap.org/docs/v2/SDK/token/).
 * @param {string} inputAmount - tokens to swap
 * @param {('Buy' | 'Sell')} saleType='Buy' - A optional string param for sale type (Buy or Sell).
 * @return {string} A string to indicate success or failure.
 *
 */
async function swap(tokenData, inputAmount, saleType = 'Buy') {
  const { address, decimals, networkId, name, symbol } = tokenData;
  const token = new Token(networkId, address, Number(decimals), symbol, name);
  const wallet = new Wallet(pk, _provider);

  try {
    let amountIn = ethers.utils.parseUnits(inputAmount, decimals);

    const route = await getRoute(
      wallet.address,
      inputAmount,
      token,
      WETH9[networkId],
      saleType
    );
    console.log(2);

    if (!route || !route.methodParameters) {
      // Handle failed request
      throw new Error('No route found');
    }
    let approved = await aggTokenTransferApproval(address, amountIn, wallet);

    if (!approved) {
      throw new Error('Token transfer approval failed');
    }
    const txRes = await wallet.sendTransaction({
      data: route.methodParameters.calldata,
      to: v3Router,
      value: route.methodParameters.value,
      from: wallet.address,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    });

    await txRes.wait();
    return txRes.hash;
  } catch (error) {
    console.log('err: ', error);
    return null;
  }
}

// Constants
const MAX_FEE_PER_GAS = '100000000000';
const MAX_PRIORITY_FEE_PER_GAS = '100000000000';

module.exports = swap;

/**
 * a getter function to grab trade route.
 *
 * @param {string} address - The receiver address
 * @param {string} amount - value to swap
 * @param {Token} token1 - Token object
 * @param {Token} weth - WEth token object
 * @param {('Buy' | 'Sell')} swapType - Indicates the type of swap
 * @return {SwapRoute | null} A SwapRoute object or null.
 *
 */
async function getRoute(address, amount, token1, weth, swapType) {
  // const [TokenIn, TokenOut] = [weth, token1].sort(Token.sortsBefore);
  // swapType === 'Buy'
  //   ? [token1, weth].sort(Token.sortsBefore)
  //   : [weth, token1].sort(Token.sortsBefore);

  const options = {
    recipient: address,
    slippageTolerance: new Percent(50, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  };
  const router = new AlphaRouter({
    chainId: 5,
    provider: _provider,
  });
  const inputAmount = CurrencyAmount.fromRawAmount(
    token1,
    fromReadableAmount(amount, token1.decimals).toString()
  );

  const route = await router.route(
    inputAmount,
    weth,
    TradeType.EXACT_INPUT,
    options
  );

  return route;
}

/**
 * An async function to get or set token transfer approval.
 *
 * @param {string} n - token address
 * @param {bigint} amount - amount of tokens to approve
 * @param {Wallet} wallet - A wallet instance to sign a transaction to approve token transfer
 * @return {boolean} A boolean to indicate success or failure.
 *
 */

async function aggTokenTransferApproval(tokenAddress, amount, wallet) {
  try {
    const tokenContract = new Contract(tokenAddress, erc20ABI, _provider);
    const approvedAmount = await tokenContract.allowance(
      wallet.address,
      v3Router
    );
    if (approvedAmount.gte(amount)) {
      return true;
    }
    await tokenContract.approve(v3Router, amount);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

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
function countDecimals(x) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split('.')[1].length || 0;
}
