import React from 'react';
import { createRoot } from 'react-dom/client';

import Settings from './SettingsPage';
import './index.css';

import { WagmiConfig } from 'wagmi';
import { config } from '../../../utils/wagmiConfig';

const container = document.getElementById('app-container');
const root = createRoot(container);
root.render(
  <WagmiConfig config={config}>
    <Settings />
  </WagmiConfig>
);
