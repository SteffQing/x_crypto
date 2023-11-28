import { ChainId, Token, WETH9, CurrencyAmount } from '@uniswap/sdk-core';
import { Pair } from '@uniswap/v2-sdk';
import { Contract } from 'ethers';

const DAI = new Token(
  ChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18
);

async function createPair() {
  const pairAddress = Pair.getAddress(DAI, WETH9[DAI.chainId]);

  // Setup provider, import necessary ABI ...
  //   const pairContract = new Contract(pairAddress, uniswapV2poolABI, provider);
  //   const reserves = await pairContract['getReserves']();
  //   const [reserve0, reserve1] = reserves;

  //   const tokens = [DAI, WETH9[DAI.chainId]];
  //   const [token0, token1] = tokens[0].sortsBefore(tokens[1])
  //     ? tokens
  //     : [tokens[1], tokens[0]];

  //   const pair = new Pair(
  //     CurrencyAmount.fromRawAmount(token0, reserve0),
  //     CurrencyAmount.fromRawAmount(token1, reserve1)
  //   );
  //   return pair;
}
