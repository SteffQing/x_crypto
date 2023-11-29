const swap = require('./TestUniV3');

(async () => {
  let tokenData = {
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    decimals: 18,
    networkId: 1,
  };
  const hash = await swap(tokenData);
  console.log(hash);
})();
