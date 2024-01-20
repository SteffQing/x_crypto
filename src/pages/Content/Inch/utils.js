const { SERVER_URL } = require('../../../../utils/constant');

async function get_swap_calldata(
  src,
  dst,
  amount,
  from_address,
  slippage = '1'
) {
  return apiRequestUrl('/swap', {
    src,
    dst,
    amount,
    from: from_address,
    slippage,
    includeTokensInfo: true,
    includeGas: true,
  });
}
async function get_approve_calldata(token_address) {
  return apiRequestUrl('/approve', {
    address: token_address,
  });
}
function apiRequestUrl(methodName, queryParams) {
  let queryString = Object.keys(queryParams)
    .map((key) => key + '=' + queryParams[key])
    .join('&');
  return `${SERVER_URL}${methodName}?${queryString}`;
}

function checkAllowance(tokenAddress, walletAddress) {
  return apiRequestUrl('/allowance', {
    tokenAddress: tokenAddress,
    walletAddress: walletAddress,
  });
}

module.exports = {
  get_swap_calldata,
  get_approve_calldata,
  checkAllowance,
};
