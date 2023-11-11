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

//getAccountBalance function to fetch coins and their respective token balances
async function fetchAnkrData(method, params) {
  const result = await fetch(
    'https://rpc.ankr.com/multichain/f3be1d95bdfba66bd8c30dedab865287e2eaa6a8a63a899c9b3db98c94036373',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: method,
        params: params,
      }),
    }
  );
  return await result.json();
}

const getAccountBalance = async (walletAddress) => {
  let params = {
    blockchain: listOfChains,
    walletAddress,
    nativeFirst: true,
  };
  const { error, result } = await fetchAnkrData(
    'ankr_getAccountBalance',
    params
  );
  if (error) {
    console.log('error: ', error.message);
    return null;
  }
  const { assets, totalBalanceUsd, totalCount } = result;
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
