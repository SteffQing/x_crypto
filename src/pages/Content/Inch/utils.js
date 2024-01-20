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
  slippage = '1',
  chain_id = CHAIN_ID
) {
  let apiUrl = `https://api.1inch.dev/swap/v5.2/${chain_id}/swap`;

  let params = {
    src,
    dst,
    amount,
    from: from_address,
    slippage,
    includeTokensInfo: true,
    includeGas: true,
  };

  let url = new URL(apiUrl);
  url.search = new URLSearchParams(params).toString();

  return await fetch(url, config)
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
      return { status: 'error', message: err };
    });
}
async function get_approve_calldata(token_address) {
  let apiUrl = `https://api.1inch.dev/swap/v5.2/{CHAIN_ID}/approve/transaction`;

  let params = {
    tokenAddress: token_address,
  };

  let url = new URL(apiUrl);
  url.search = new URLSearchParams(params).toString();

  return await fetch(url, config)
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
      return { status: 'error', message: err };
    });
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
