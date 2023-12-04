const { ethers } = require('ethers');

const MAX_FEE_PER_GAS = '100000000000';
const MAX_PRIORITY_FEE_PER_GAS = '100000000000';

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(
    'https://goerli.infura.io/v3/f7430166c6284e1d943436bfe9f5cc66'
  );
};

function fromReadableAmount(amount, decimals) {
  return ethers.utils.parseUnits(amount.toString(), decimals);
}

function toReadableAmount(rawAmount, decimals) {
  return ethers.utils.formatUnits(rawAmount, decimals).slice(0, 4);
}

const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
const WETH_CONTRACT_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

// const v3Router = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
// const v2Router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const v3Router = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

module.exports = {
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  getProvider,
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS,
  SWAP_ROUTER_ADDRESS,
  WETH_CONTRACT_ADDRESS,
  v3Router,
  fromReadableAmount,
  toReadableAmount,
};
