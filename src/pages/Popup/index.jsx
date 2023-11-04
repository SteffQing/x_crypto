import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './Popup';
import './index.css';

import { WagmiConfig } from 'wagmi'
import { config } from '../../../utils/wagmiConfig';

const container = document.getElementById('app-container');
const root = createRoot(container); 
root.render(
<WagmiConfig config={config}><Popup /></WagmiConfig>
);
