import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { INFURA_KEY, WC_PROJECT_ID } from './constant';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: INFURA_KEY }), publicProvider()]
);
const connectors = [
  new WalletConnectConnector({
    chains,
    options: {
      projectId: WC_PROJECT_ID,
      showQrModal: true,
      qrModalOptions: {
        explorerExcludedWalletIds: 'ALL',
      },
    },
  }),
  new MetaMaskConnector({ chains }),
];

export const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
  webSocketPublicClient,
});
