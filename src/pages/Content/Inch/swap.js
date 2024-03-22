const {
  get_approve_calldata,
  get_swap_calldata,
  checkAllowance,
} = require('./utils');
const { swapEndpoint } = require('../../../apis/serverAPI');
const { ethers, BigNumber } = require('ethers');

let CHAIN_ID = 137;
let ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

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
  try {
    console.log('sending tx');
    let tx = await signer.sendTransaction(transaction);
    console.log('sent tx');
    await tx.wait();
    console.log('awaiting tx');

    return tx.hash;
  } catch (error) {
    throw new Error(error);
  }
}

async function getBalance(address, token) {
  let balance = '0';
  const abi = ['function balanceOf(address owner) view returns (uint256)'];
  if (token !== ETH) {
    let contract = new ethers.Contract(token, abi, provider);
    balance = await contract.balanceOf(address);
  } else {
    balance = await provider.getBalance(address);
  }
  return Number(balance);
}

async function parse_data(token, trade, settings, from_address) {
  let [type, value] = trade.split(' ');
  value = value.toLowerCase();
  let { buyValue, slippage } = settings;
  let _type = buyValue.type;
  // Get src and dst addressess
  let src = type === 'Buy' ? ETH : token.address;
  let dst = type === 'Buy' ? token.address : ETH;
  // Get Balance of token to be sold
  let balance = await getBalance(from_address, src);
  // Get amount to be used in this transaction
  let amount = 0;
  let _value = buyValue[value];
  if (_type === 'percent') {
    amount = balance * (_value / 100);
  } else {
    if (Number(_value) < balance) {
      throw new Error('Insufficient balance to be used in this transaction');
    }
    amount = _value;
  }
  return { src, dst, slippage, amount: amount.toString(), type };
}
async function swap(token, trade, _from, settings, cb) {
  let from_address = _from.account;
  cb('Please wait, parsing data...');
  let { src, dst, slippage, amount, type } = await parse_data(
    token,
    trade,
    settings,
    from_address
  );
  if (type !== 'Buy') {
    cb('Checking allowance...');
    let allowance_url = checkAllowance(token.address, from_address);
    let { allowance } = await swapEndpoint(allowance_url);
    if (Number(allowance) < Number(amount)) {
      cb('Approving token...');
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
      cb('Token Approval success, txn hash below', hash);
    } else {
      cb('Allowance sufficient, skipping approval');
    }
  }
  cb('Swapping tokens, please wait...');
  let swap_calldata_url = await get_swap_calldata(
    src,
    dst,
    amount,
    from_address,
    slippage
  );
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('1 second delay to bypass 2nd defined limits');
      resolve();
    }, 1000);
  });
  let swap_calldata = await swapEndpoint(swap_calldata_url);
  let { fromToken, toToken, toAmount } = swap_calldata;
  cb(
    'Review Swap Info',
    `Swap ${_amount_(amount, fromToken.decimals)} ${
      fromToken.symbol
    }, for ${_amount_(toAmount, toToken.decimals)} ${toToken.symbol}`
  );
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('1000 second delay');
      resolve();
    }, 2000);
  });
  let hash = await signAndSendTransaction(
    swap_calldata.tx,
    _from.privateKey,
    from_address
  );
  cb('Swap success, txn hash below', hash);
  return hash;
}
function _amount_(value, decimals) {
  return ethers.utils.formatUnits(value, decimals);
}
module.exports = swap;
