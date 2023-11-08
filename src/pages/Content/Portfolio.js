import { MS_GET_ACCOUNT_INFO } from '../../../utils/constant';
import { AccountInfo } from '../Popup/Popup';

let account = null;

export const addPortfolio = () => {
  const tab = document.querySelector("[aria-label='Primary']");
  const firstChild = tab.firstChild;
  const portfolio = firstChild.cloneNode(true);
  createPortfolioSVG(portfolio);
  portfolio.ariaLabel = 'View your Portfolio';
  portfolio.role = 'Portfolio';
  portfolio.dataset.testid = 'Portfolio Tab';
  window.addEventListener('resize', () => {
    console.log('resize');
    if (window.innerWidth > 1280) {
      const spanElementOld = portfolio.querySelector('span');
      if (spanElementOld) return;
      const parentNode =
        firstChild.firstChild.firstChild.nextSibling.cloneNode(true);
      const spanElement = parentNode.querySelector('span');
      spanElement.textContent = 'Portfolio';
      portfolio.firstChild.appendChild(parentNode);
    } else {
      const spanElement = portfolio.querySelector('span');
      if (spanElement) {
        const parentNode = spanElement.parentNode;
        parentNode.remove();
      }
    }
  });

  const data = AccountInfo();
  console.log(data, 'Portfolio');

  tab.insertBefore(portfolio, firstChild.nextSibling);
};
function createPortfolioSVG(parent) {
  parent.setAttribute('href', '/portfolio');
  parent.setAttribute('aria-label', 'Portfolio');
  parent.setAttribute('data-testid', 'Portfolio Tab');

  const spanElement = parent.querySelector('span');
  if (spanElement) {
    spanElement.textContent = 'Portfolio';
  }
  const pathElement = parent.querySelector('path');
  pathElement.setAttribute(
    'd',
    'M19.732 7.203v-2.666h-7.464v2.666h-9.063v20.259h25.59v-20.259h-9.063zM13.334 5.604h5.331v1.599h-5.331v-1.599zM12.268 8.27h15.461v8.53h-7.997v-2.133h-7.464v2.133h-7.997v-8.53h7.997zM18.666 15.733v3.199h-5.331v-3.199h5.331zM4.271 26.396v-8.53h7.997v2.133h7.464v-2.133h7.997v8.53h-23.457z'
  );
}
const setAccountInfo = (data) => {
  if (!data) {
    return;
  }
  account = data;
};

const getAccountInfo = async (address) => {
  return new Promise((resolve, reject) => {
    const msg = {
      action: MS_GET_ACCOUNT_INFO,
      address,
    };
    chrome.runtime.sendMessage(msg, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        setAccountInfo(response);
        resolve('ok');
      }
    });
  });
};
