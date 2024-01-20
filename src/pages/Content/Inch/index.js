const {
  get_approve_calldata,
  get_swap_calldata,
  checkAllowance,
} = require('./utils');
const { ethers } = require('ethers');

let ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
let amountObj = {
  X1: '0.1',
  X2: '0.2',
  Max: '0.3',
};

async function swap(token, trade, _from, slippage = '1') {
  let [type, value] = trade.split(' ');
  let src = type === 'Buy' ? token.address : ETH;
  let dst = type === 'Buy' ? ETH : token.address;
  let from_address = _from.account;

  // Parse amount to wei
  let amount = amountObj[value];
  amount = ethers.utils.parseUnits(amount, token.decimals);
  amount = amount.toString();
  console.log('amount: ', amount);

  // Initiate signer
  let provider = ethers.getDefaultProvider('mainnet');
  console.log('provider: ', provider, provider.network);
  let signer = new ethers.Wallet(_from.privateKey, provider);
  if (type !== 'Buy') {
    let allowance = await checkAllowance(token.address, from_address);
    console.log('allowance: ', allowance);
    if (allowance < amount) {
      //   let approve_calldata = await get_approve_calldata(token.address);
      //   let approve_tx = await _from.sendTransaction(approve_calldata);
      //   await approve_tx.wait();
    }
  }
}

module.exports = swap;
