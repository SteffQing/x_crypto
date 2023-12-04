const swap = require('./TestUniV3');

(async () => {
  try {
    let tokenData = {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      decimals: 18,
      networkId: 5,
      name: 'Uniswap',
      symbol: 'UNI',
    };
    let inputAmount = '0.04';
    let saleType = 'Sell';
    const hash = await swap(tokenData, inputAmount, saleType);
    console.log('Success: ', hash);
  } catch (error) {
    console.log('err: ', error.message);
  }
})();
