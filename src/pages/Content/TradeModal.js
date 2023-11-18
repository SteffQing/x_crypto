import { mergeToDiv } from './CreateElements';
import { ArrowButton, closeButton } from './CreateAssets';

export function TradeModal(baseAsset, assets) {
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('modalWrapper');
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.style.fontFamily = 'TwitterChirp';

  const inputs = mergeToDiv(InputBox(), InputBox());
  inputs.style.gap = '6px';
  inputs.style.position = 'relative';
  inputs.style.flexDirection = 'column';
  const arrow = document.createElement('span');
  arrow.classList.add('arrow');
  arrow.appendChild(ArrowButton());
  inputs.appendChild(arrow);
  inputs.style.margin = '1rem 0';

  modal.appendChild(ModalHeader());
  modal.appendChild(inputs);
  modal.appendChild(Button());
  modalWrapper.appendChild(modal);

  return modalWrapper;
}
function ModalHeader() {
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modalHeader');
  const title = document.createElement('h1');
  title.textContent = 'Swap';
  title.classList.add('text');
  title.style.margin = '0';

  modalHeader.appendChild(title);
  modalHeader.appendChild(closeButton);
  return modalHeader;
}
function InputBox() {
  const inputBox = document.createElement('div');
  inputBox.classList.add('inputBox');

  // Token Name header
  const tokenName = document.createElement('p');
  tokenName.textContent = 'Ethereum';
  tokenName.classList.add('text');

  // One liner code to hold token image, token symbol and the input box
  const tokenTickerImage = document.createElement('img');
  tokenTickerImage.src =
    'https://tokens-data.1inch.io/images/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png';
  tokenTickerImage.alt = 'ETH logo';
  const title = document.createElement('p');
  title.textContent = 'ETH';
  title.classList.add('text');
  title.style.marginBottom = '0';
  const tokenTicker = mergeToDiv(tokenTickerImage, title);

  const inputDiv = mergeToDiv(tokenTicker, Input(true));
  inputDiv.classList.add('inputDiv');

  // Balance Display
  const balanceDisplay = document.createElement('span');
  balanceDisplay.textContent = 'Balance: 0';
  balanceDisplay.classList.add('text');
  balanceDisplay.style.color = '#9b9b9b';

  // Append all the elements to the inputBox
  inputBox.appendChild(tokenName);
  inputBox.appendChild(inputDiv);
  inputBox.appendChild(balanceDisplay);

  return inputBox;
}

function Input(isBase = false) {
  const input = document.createElement('input');
  input.type = 'number';
  input.placeholder = '0';
  input.classList.add('input');
  input.autocomplete = 'off';
  input.disabled = isBase ? false : true;
  return input;
}

function Button() {
  const button = document.createElement('button');
  button.classList.add('swapButton');
  button.textContent = 'Swap';
  return button;
}
