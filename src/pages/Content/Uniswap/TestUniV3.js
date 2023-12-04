/* eslint-disable no-unused-vars */
const { Token, WETH9 } = require('@uniswap/sdk-core');
const { Contract, Wallet, ethers } = require('ethers');
const erc20ABI = require('../abi/erc20ABI.json');
const UniversalRouter = require('./UniversalRouter');
const {
  getProvider,
  toReadableAmount,
  fromReadableAmount,
  SWAP_ROUTER_ADDRESS,
} = require('./constants');
const AlphaRouter = require('./AlphaRouter');

// Constants
let pk = '0xbe903edf0be27f6e59cb6dce608268f320dc42a0cbd2e188549a982939aee5ac';

// Functions
/**
 * The entry function to executing a swap on the extension.
 *
 * @param {Token} tokenData: {address: string, decimal: number | string, networkId: number | string, name: string, symbol: string} - A Token object param (see https://uniswap.org/docs/v2/SDK/token/).
 * @param {string} inputAmount - tokens to swap
 * @param {('Buy' | 'Sell')} saleType='Buy' - A optional string param for sale type (Buy or Sell).
 * @return {Promise<string>} A string to indicate success or failure.
 *
 */
async function swap(tokenData, inputAmount, saleType = 'Buy') {
  const provider = getProvider();
  const { address, decimals, networkId, name, symbol } = tokenData;
  const token = new Token(networkId, address, Number(decimals), symbol, name);
  let weth = WETH9[networkId];
  if (!weth) {
    weth = new Token(
      networkId,
      '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      18,
      'WETH',
      'Wrapped Ether'
    );
  }
  const wallet = new Wallet(pk, provider);
  const amount = Number(inputAmount);
  const [TokenIn, TokenOut] =
    saleType === 'Buy' ? [token, weth] : [weth, token];

  try {
    let isApproved = await aggTokenApproval(TokenOut, amount, wallet);
    if (!isApproved) {
      throw new Error('Token transfer approval failed');
    }
    console.log('approved...');

    let trade = await UniversalRouter(
      TokenIn,
      TokenOut,
      amount,
      wallet.address
    );
    // let trade = await AlphaRouter(TokenIn, TokenOut, amount, wallet.address);
    console.log('trading...');
    const txRes = await wallet.sendTransaction(trade);
    const res = await txRes.wait();
    console.log('traded!');

    return res.transactionHash;
  } catch (error) {
    console.log('err: ', error);
    return null;
  }
}

module.exports = swap;

/**
 * An async function to get or set token transfer approval.
 *
 * @param {Token} token - token object
 * @param {number} amount - amount of tokens to approve
 * @param {Wallet} wallet - A wallet instance to sign a transaction to approve token transfer
 * @return {Promise<boolean>} A boolean to indicate success or failure.
 *
 */
async function aggTokenApproval(token, amount, wallet) {
  try {
    const tokenContract = new Contract(token.address, erc20ABI, wallet);
    const approvedAmount = await tokenContract.allowance(
      wallet.address,
      SWAP_ROUTER_ADDRESS
    );
    let _approvedAmount = toReadableAmount(approvedAmount, token.decimals);
    if (Number(_approvedAmount) >= amount) {
      return true;
    }

    console.log('approving...');
    let _amount = fromReadableAmount(amount, token.decimals);
    await tokenContract.approve(SWAP_ROUTER_ADDRESS, _amount);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
