import { mergeToDiv } from './CreateElements';
import { ArrowButton, closeButton } from './CreateSVGAssets';

export function TradeModal(baseAsset, assets) {
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('modalWrapper');
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const inputs = mergeToDiv(InputBox(), InputBox());
  inputs.style.gap = '12px';
  inputs.style.position = 'relative';
  const arrow = document.createElement('span');
  arrow.classList.add('arrow');
  arrow.appendChild(ArrowButton());
  inputs.appendChild(arrow);

  modal.appendChild(ModalHeader());
  modal.appendChild(inputs);
  modal.appendChild(Button());
  modalWrapper.appendChild(modal);

  return modalWrapper;
}
function ModalHeader() {
  const modalHeader = document.createElement('div');
  const title = document.createElement('h1');
  title.textContent = 'Swap';
  title.classList.add('text');

  modalHeader.appendChild(title);
  modalHeader.appendChild(
    closeButton(() => document.querySelector('.modalWrapper').remove())
  );
  return modalHeader;
}
function InputBox() {
  const inputBox = document.createElement('div');
  inputBox.classList.add('inputBox');

  //   Token Name header
  const tokenName = document.createElement('p');
  tokenName.textContent = 'asset.tokenName';
  tokenName.classList.add('text');

  // One liner code to hold token image, token symbol and the input box
  const tokenTickerImage = document.createElement('img');
  tokenTickerImage.src =
    'https://tokens-data.1inch.io/images/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png';
  tokenTickerImage.alt = 'asset.tokenSymbol logo';
  const title = document.createElement('p');
  title.textContent = 'asset.tokenSymbol';
  title.classList.add('text');
  const tokenTicker = mergeToDiv(tokenTickerImage, title);

  const input = Input(true);

  // Balance Display
  const balanceDisplay = document.createElement('span');
  balanceDisplay.textContent = 'Balance: 0.0000';
  balanceDisplay.classList.add('text');
  balanceDisplay.style.color = '#9b9b9b';

  //   Append all the elements to the inputBox
  inputBox.appendChild(tokenName);
  inputBox.appendChild(tokenTicker);
  inputBox.appendChild(input);
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
/*

    <>
      {isConnected && connectedChain ? (
        <button
          className="w-full py-2 text-center rounded-lg cursor-pointer btn btn-secondary"
          onClick={() => swap()}
          disabled={isLoading || !NUMBER_REGEX.test(value) || inSufficientFunds || value === ""}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : !value ? (
            <span>Enter Amount</span>
          ) : (
            <span>{inSufficientFunds ? "Insufficient Balance" : action}</span>
          )}
        </button>
      ) : connectedChain && connectedChain?.id !== scroll.id ? (
        <button
          className="flex items-center justify-center w-full gap-2 py-2 text-center rounded-lg btn btn-secondary"
          type="button"
          onClick={() => switchNetwork?.(scroll.id)}
        >
          <ArrowsRightLeftIcon className="w-4 h-6 ml-2 sm:ml-0" />
          <span className="whitespace-nowrap">Switch to Scroll</span>
        </button>
      ) : (
        <button
          onClick={openConnectModal}
          disabled={isConnecting}
          className="w-full py-2 text-center rounded-lg cursor-pointer btn btn-secondary"
        >
          {isConnecting && <span className="loading loading-spinner loading-sm"></span>}
          <span>Connect Wallet</span>
        </button>
      )}
    </>
*/

/* 

        className={`${
          darkText ? "text-gray-700 disabled:text-gray-500" : "text-white"
        }  input input-ghost outline-none bg-transparent focus:outline-none text-end h-[2.2rem] min-h-[2.2rem] disabled:text-white px-4 border w-full font-medium placeholder:text-accent/50  text-[30px]  disabled:bg-transparent disabled:border-transparent`}
        placeholder={placeholder}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
*/
