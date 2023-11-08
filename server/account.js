//defining the list of supported blockchains
const listOfChains = [
  'eth',
  'arbitrum',
  'avalanche',
  'base',
  'bsc',
  'fantom',
  'flare',
  'gnosis',
  'optimism',
  'polygon',
  'polygon_zkevm',
];

//

//key-value pair mapping of chains to their native symbols
// const chainsToNativeSymbols = {
//   eth: 'ETH',
//   arbitrum: 'ETH',
//   avalanche: 'AVAX',
//   bsc: 'BNB',
//   fantom: 'FTM',
//   polygon: 'MATIC',
// };

//getAccountBalance function to fetch coins and their respective token balances
const getAccountBalance = async (walletAddress) => {
  const data = await fetch(
    'https://rpc.ankr.com/multichain/f3be1d95bdfba66bd8c30dedab865287e2eaa6a8a63a899c9b3db98c94036373',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'ankr_getAccountBalance',
        params: {
          blockchain: listOfChains,
          walletAddress,
          nativeFirst: true,
        },
      }),
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
  const { assets, totalBalanceUsd, totalCount } = data.result;
  let _assets = assets.map((asset) => {
    const {
      blockchain,
      tokenSymbol,
      balance,
      balanceUsd,
      tokenPrice,
      thumbnail,
      tokenName,
      contractAddress,
    } = asset;
    return {
      blockchain,
      tokenSymbol,
      balance,
      balanceUsd,
      tokenPrice,
      thumbnail,
      tokenName,
      contractAddress,
    };
  });
  return {
    address: walletAddress,
    totalBalanceUsd,
    totalCount,
    assets: _assets,
  };
};

module.exports = {
  getAccountBalance,
};
