const swap = require('./TestUniV3');

(async () => {
  try {
    let tokenData = {
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      decimals: 18,
      networkId: 1,
      name: 'ChainLink Token',
      symbol: 'LINK',
    };
    let inputAmount = '0.001';
    let saleType = 'Buy';
    const hash = await swap(tokenData, inputAmount, saleType);
    console.log(hash);
  } catch (error) {
    console.log('err: ', error.message);
  }
})();
