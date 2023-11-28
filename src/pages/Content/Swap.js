const { CLASS_FOR_PURCHASE, TWITTER_URL } = require('../../../utils/constant');
const { createSpan, createLink } = require('./CreateElements');

const colors = [
  '2dcoff',
  'FB50FF',
  ['f36868', 'df4545', 'c22828'],
  ['68cbfa', '2896c2', '45b1df'],
];
let trade = 'Buy';
export function createPurchase(account) {
  const newDiv = document.createElement('div');
  newDiv.classList.add(CLASS_FOR_PURCHASE);

  newDiv.appendChild(WalletSpan(account.account));
  newDiv.appendChild(BuySellSpan(newDiv));
  Purchase(newDiv);

  return newDiv;
}

function WalletSpan(address = '') {
  const walletLink = createLink(TWITTER_URL + address);
  const walletNode = createSpan('Wallet');
  walletNode.style.color = '#fff';
  walletLink.appendChild(walletNode);
  walletLink.classList.add('trade_button');
  walletLink.style.borderColor = `#${colors[0]}`;
  walletLink.addEventListener('click', (event) => {
    event.stopPropagation();
    console.log('button clicked is: Wallet');
  });
  return walletLink;
}

function BuySellSpan(newDiv) {
  const buySellNode = createSpan('Buy ⚡ Sell');
  buySellNode.classList.add('trade_button');
  buySellNode.style.borderColor = `#${colors[1]}`;
  buySellNode.addEventListener('click', (event) => {
    event.stopPropagation();
    const buttons = newDiv.querySelectorAll('.swap_button');
    if (trade === 'Buy') {
      trade = 'Sell';
      for (let i = 0; i < 3; i++) {
        buttons[i].style.borderColor = `#${colors[3][i]}`;
        buttons[i].innerText = `Sell ${buttons[i].innerText.split(' ')[1]}`;
      }
    } else {
      trade = 'Buy';
      for (let i = 0; i < 3; i++) {
        buttons[i].style.borderColor = `#${colors[2][i]}`;
        buttons[i].innerText = `Buy ${buttons[i].innerText.split(' ')[1]}`;
      }
    }
  });
  return buySellNode;
}

function Purchase(newDiv) {
  const buttons = ['X1', 'X2', 'Max'];

  for (let i = 0; i < 3; i++) {
    const buttonNode = createSpan(`Buy ${buttons[i]}`);
    buttonNode.classList.add('trade_button');
    buttonNode.classList.add('swap_button');
    buttonNode.style.borderColor = `#${colors[2][i]}`;
    buttonNode.addEventListener('click', (event) => {
      event.stopPropagation();
      console.log('button clicked is: ', buttons[i]);
    });
    newDiv.appendChild(buttonNode);
  }
}

// Uniswap V2
