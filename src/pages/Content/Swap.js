import { TradeModal } from './TradeModal';

const {
  CLASS_FOR_PURCHASE,
  TWITTER_URL,
  SETTINGS_KEY,
} = require('../../../utils/constant');
const { createSpan, createLink } = require('./CreateElements');
const swap = require('./Inch/swap');

let trade = 'Buy';
export function createPurchase(account, token) {
  const newDiv = document.createElement('div');
  newDiv.classList.add(CLASS_FOR_PURCHASE);

  newDiv.appendChild(WalletSpan(account.account));
  newDiv.appendChild(BuySellSpan(newDiv));
  Purchase(newDiv, token, account);

  return newDiv;
}

function WalletSpan(address) {
  const walletLink = createLink(TWITTER_URL + address);
  const walletNode = createSpan('Wallet');
  walletLink.appendChild(walletNode);
  walletLink.classList.add('trade_button');
  walletLink.style.color = 'white';
  return walletLink;
}

function BuySellSpan(newDiv) {
  const buySellNode = createSpan('Buy ⚡ Sell');
  buySellNode.classList.add('trade_button');
  buySellNode.style.border = 'none';
  buySellNode.style.backgroundColor = '#232323';
  buySellNode.addEventListener('click', (event) => {
    event.stopPropagation();
    const buttons = newDiv.querySelectorAll('.swap_button');
    if (trade === 'Buy') {
      trade = 'Sell';
      for (let i = 0; i < 3; i++) {
        buttons[i].innerText = `Sell ${buttons[i].innerText.split(' ')[1]}`;
      }
    } else {
      trade = 'Buy';
      for (let i = 0; i < 3; i++) {
        buttons[i].innerText = `Buy ${buttons[i].innerText.split(' ')[1]}`;
      }
    }
  });
  return buySellNode;
}

function Purchase(newDiv, token, account) {
  const buttons = ['X1', 'X2', 'X3'];

  for (let i = 0; i < 3; i++) {
    const buttonNode = createSpan(`Buy ${buttons[i]}`);
    buttonNode.classList.add('trade_button');
    buttonNode.classList.add('swap_button');
    buttonNode.addEventListener('click', (event) => {
      event.stopPropagation();
      openModal();
      // get_settings().then((settings) => {
      //   if (settings) {
      //     swap(token, buttonNode.innerText, account, settings)
      //       .then((res) => {
      //         console.log('swap hash: ', res);
      //       })
      //       .catch((err) => {
      //         console.log('swap err: ', err);
      //       })
      //       .finally(() => {
      //         closeModal();
      //       });
      //   }
      // });
    });
    newDiv.appendChild(buttonNode);
  }
}

async function get_settings() {
  return chrome.storage.local.get(SETTINGS_KEY).then((values) => {
    if (values.hasOwnProperty(SETTINGS_KEY) && values[SETTINGS_KEY]) {
      return values[SETTINGS_KEY];
    }
  });
}
const modal_id = 'x_defi-trade-modal';
function openModal() {
  const Modal = TradeModal();
  Modal.id = modal_id;
  document.body.appendChild(Modal);
}
function updateModal(title, text) {
  const Modal = document.getElementById(modal_id);
  if (Modal) {
    closeModal();
    const newModal = TradeModal(title, text);
    newModal.id = modal_id;
    document.body.appendChild(newModal);
  }
}
function closeModal() {
  const Modal = document.getElementById(modal_id);
  if (Modal) {
    Modal.remove();
  }
}
