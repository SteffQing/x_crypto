const { CLASS_FOR_PURCHASE, TWITTER_URL } = require('../../../utils/constant');
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

function WalletSpan(address = '') {
  const walletLink = createLink(TWITTER_URL + address);
  const walletNode = createSpan('Wallet');
  walletNode.style.color = '#fff';
  walletLink.appendChild(walletNode);
  walletLink.classList.add('trade_button');
  return walletLink;
}

function BuySellSpan(newDiv) {
  const buySellNode = createSpan('Buy ⚡ Sell');
  buySellNode.classList.add('trade_button');
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
      swap(token, buttonNode.innerText, account)
        .then((res) => {
          console.log('swap hash: ', res);
        })
        .catch((err) => {
          console.log('swap err: ', err);
        });
    });
    newDiv.appendChild(buttonNode);
  }
}
