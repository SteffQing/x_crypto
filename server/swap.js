const ONE_INCH_KEY = 'tW5l3Zj2DpPgFgOgjjYfMTntAnKOfX5r';
const CHAIN_ID = 137;

const header = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ONE_INCH_KEY}`,
};

let config = {
  method: 'GET',
  headers: header,
};

async function get_swap_calldata(
  src,
  dst,
  amount,
  from_address,
  slippage = '1'
) {
  let url = apiRequestUrl('/swap', {
    src,
    dst,
    amount,
    from: from_address,
    slippage,
    includeTokensInfo: true,
    includeGas: true,
  });

  return await fetch(url, config)
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
      return { status: 'error', message: err };
    });
}
async function get_approve_calldata(token_address) {
  let url = apiRequestUrl('/approve/transaction', {
    tokenAddress: token_address,
  });

  let result = await fetch(url, config)
    .then((response) => response.json())
    .catch((err) => console.log(err));

  console.log(result, 'server result');
  return result;
}
function apiRequestUrl(methodName, queryParams) {
  let apiBaseUrl = `https://api.1inch.dev/swap/v5.2/${CHAIN_ID}`;
  let queryString = Object.keys(queryParams)
    .map((key) => key + '=' + queryParams[key])
    .join('&');
  return `${apiBaseUrl}${methodName}?${queryString}`;
}

async function checkAllowance(tokenAddress, walletAddress) {
  url = apiRequestUrl('/approve/allowance', {
    tokenAddress: tokenAddress,
    walletAddress: walletAddress,
  });
  return await fetch(url, config)
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
      return { status: 'error', message: err };
    });
}

module.exports = {
  get_swap_calldata,
  get_approve_calldata,
  checkAllowance,
};
