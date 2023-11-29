const {
  Token,
  WETH9,
  Percent,
  CurrencyAmount,
  TradeType,
} = require('@uniswap/sdk-core');
const { Contract, JsonRpcProvider, Wallet, parseUnits } = require('ethers');
// const { INFURA_KEY } = require('../../../utils/constant');
const uniswapV3poolABI = require('./abi/uniswapV3poolABI.json');
// const routerABI = require('./abi/routerABI.json');
const erc20ABI = require('./abi/erc20ABI.json');
const { Pair } = require('@uniswap/v2-sdk');
const { AlphaRouter, SwapType } = require('@uniswap/smart-order-router');
const { default: JSBI } = require('jsbi/jsbi');
const INFURA_KEY = '6ea08acb523d49fa969a0b53def4d5ed';
const provider = new JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_KEY}`
);

const v3Router = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
// const v2Router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
let pk = '0xbe903edf0be27f6e59cb6dce608268f320dc42a0cbd2e188549a982939aee5ac';

async function swap(tokenData) {
  const { address, decimals, networkId } = tokenData;
  const token = new Token(networkId, address, Number(decimals));
  const wallet = new Wallet(pk, provider);

  let inputAmount = '0.001';
  try {
    const amountIn = parseUnits(inputAmount, decimals);
    const pairAddress = Pair.getAddress(token, WETH9[token.chainId]);
    const pairContract = new Contract(pairAddress, uniswapV3poolABI, provider);
    const tokenContract = new Contract(address, erc20ABI, wallet);

    const { token0, token1 } = await getImmutables(pairContract);
    // const { sqrtPriceX96 } = await getVariables(pairContract);

    // Alpha Router
    const router = new AlphaRouter({
      chainId: token.chainId,
      provider,
    });
    const options = {
      recipient: wallet.address,
      slippageTolerance: new Percent(50, 10_000),
      deadline: Math.floor(Date.now() / 1000 + 1800),
      type: SwapType.SWAP_ROUTER_02,
    };
    const rawTokenAmountIn = fromReadableAmount(amountIn, decimals);

    const route = await router.route(
      CurrencyAmount.fromRawAmount(token0, rawTokenAmountIn),
      token1,
      TradeType.EXACT_INPUT,
      options
    );

    if (!route || !route.methodParameters) {
      // Handle failed request
      throw new Error('No route found');
    }

    // const swapRouterContract = new Contract(v3Router, routerABI, wallet);

    const approveTx = await tokenContract.approve(
      v3Router,
      rawTokenAmountIn.toString()
    );
    await approveTx.wait();
    if (!approveTx.hash) {
      throw new Error('Approve failed');
    }

    const txRes = await wallet.sendTransaction({
      data: route.methodParameters.calldata,
      to: v3Router,
      value: route.methodParameters.value,
      from: wallet.address,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    });

    await txRes.wait();
    return txRes.hash;

    // const params = {
    //   tokenIn: token0,
    //   tokenOut: token1,
    //   fee: fee,
    //   recipient: wallet.address,
    //   deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    //   amountIn: amountIn,
    //   amountOutMinimum: 0,
    //   sqrtPriceLimitX96: sqrtPriceX96,
    // };
    // const swapTx = await swapRouterContract.exactInputSingle(params, {
    //   gasLimit: hexlify(1000000),
    // });
  } catch (error) {
    console.log('err: ', error.message);
    return null;
  }
}

async function getImmutables(pairContract) {
  const immutables = await Promise.all([
    pairContract.token0(),
    pairContract.token1(),
    pairContract.fee(),
  ]);
  const [token0, token1, fee] = immutables;
  return { token0, token1, fee };
}

// async function getVariables(pairContract) {
//   const slot = await pairContract.slot0();
//   return { sqrtPriceX96: slot[0] };
// }
function fromReadableAmount(amount, decimals) {
  const extraDigits = Math.pow(10, countDecimals(amount));
  const adjustedAmount = amount * extraDigits;
  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    JSBI.BigInt(extraDigits)
  );
}

function countDecimals(x) {
  if (Math.floor(x) === x) {
    return 0;
  }
  return x.toString().split('.')[1].length || 0;
}

// Constants
const MAX_FEE_PER_GAS = '100000000000';
const MAX_PRIORITY_FEE_PER_GAS = '100000000000';
// const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000000000000;

module.exports = swap;
