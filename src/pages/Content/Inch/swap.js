const {
  get_approve_calldata,
  get_swap_calldata,
  checkAllowance,
} = require('./utils');
const { swapEndpoint } = require('../../../apis/serverAPI');
const { ethers } = require('ethers');

let CHAIN_ID = 137;
let ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
let amountObj = {
  X1: '0.1',
  X2: '0.2',
  Max: '0.3',
};

let provider_url =
  'https://polygon-mainnet.infura.io/v3/6ea08acb523d49fa969a0b53def4d5ed';
let provider = new ethers.providers.JsonRpcProvider(provider_url);

async function estimate_gas(transaction) {
  try {
    let gas = await provider.estimateGas(transaction);
    return gas.toNumber();
  } catch {
    return 2000000;
  }
}

async function signAndSendTransaction(transaction, privateKey, address) {
  console.log(transaction, 'TX1');
  let from_address = transaction.from || address;
  transaction['nonce'] = await provider.getTransactionCount(address);
  transaction['from'] = from_address;
  transaction['gas'] = transaction.gas || (await estimate_gas(transaction));
  transaction['to'] = transaction['to'];
  transaction['gasPrice'] = Number(transaction['gasPrice']);
  transaction['value'] = Number(transaction['value']);
  transaction['chainId'] = CHAIN_ID;
  console.log(transaction, 'TX2');

  let signer = new ethers.Wallet(privateKey, provider);
  try {
    let signed_tx = await signer.signTransaction(transaction);
    let tx = await signer.sendTransaction(signed_tx);
    await tx.wait();
    return { hash: tx.hash, status: 'ok' };
  } catch {
    return { status: 'error' };
  }
}

async function swap(token, trade, _from, slippage = '1') {
  let [type, value] = trade.split(' ');
  let src = type === 'Buy' ? ETH : token.address;
  let dst = type === 'Buy' ? token.address : ETH;
  let from_address = _from.account;

  // Parse amount to wei
  let amount = amountObj[value];
  amount = ethers.utils.parseUnits(amount, token.decimals);
  amount = amount.toString();

  if (type !== 'Buy') {
    let allowance_url = checkAllowance(token.address, from_address);
    let { allowance } = await swapEndpoint(allowance_url);
    console.log('allowance: ', allowance);
    if (Number(allowance) < Number(amount)) {
      let approve_calldata_url = await get_approve_calldata(token.address);
      console.log(approve_calldata_url, 'APPROVE URL');
      let approve_calldata = await swapEndpoint(approve_calldata_url);
      console.log(approve_calldata, 'APPROVE CALLDATA');
      let hash = await signAndSendTransaction(
        approve_calldata,
        _from.privateKey,
        from_address
      );
      console.log(hash.hash, 'HASH');
    }
  }
}

module.exports = swap;
