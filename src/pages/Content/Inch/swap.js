const {
  get_approve_calldata,
  get_swap_calldata,
  checkAllowance,
} = require('./utils');
const { swapEndpoint } = require('../../../apis/serverAPI');
const { ethers, BigNumber } = require('ethers');

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
    return await provider.estimateGas(transaction);
  } catch {
    return BigNumber.from(2000000);
  }
}

async function signAndSendTransaction(transaction, privateKey, address) {
  let from_address = transaction.from || address;
  transaction.nonce = await provider.getTransactionCount(address);
  transaction.from = from_address;
  transaction.gasLimit = await estimate_gas(transaction);
  transaction.gasPrice = BigNumber.from(transaction.gasPrice);
  transaction.value = BigNumber.from(transaction.value);
  transaction.chainId = CHAIN_ID;

  if (transaction.gas) {
    delete transaction.gas;
  }

  let signer = new ethers.Wallet(privateKey, provider);
  console.log(transaction);
  try {
    let tx = await signer.sendTransaction(transaction);
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
    if (Number(allowance) < Number(amount)) {
      let approve_calldata_url = await get_approve_calldata(token.address);
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log('1 second delay to bypass defined limits');
          resolve();
        }, 1000);
      });
      let approve_calldata = await swapEndpoint(approve_calldata_url);
      let hash = await signAndSendTransaction(
        approve_calldata,
        _from.privateKey,
        from_address
      );
      console.log(hash.hash, 'approve HASH');
    }
  }
  let swap_calldata_url = await get_swap_calldata(
    src,
    dst,
    amount,
    from_address,
    slippage
  );
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('1 second delay to bypass defined limits');
      resolve();
    }, 1000);
  });
  let swap_calldata = await swapEndpoint(swap_calldata_url);
  let hash = await signAndSendTransaction(
    swap_calldata.tx,
    _from.privateKey,
    from_address
  );
  console.log(hash.hash, 'swap HASH');
  return hash.hash;
}

module.exports = swap;
