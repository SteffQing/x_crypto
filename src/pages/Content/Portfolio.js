import { MS_GET_ACCOUNT_INFO } from '../../../utils/constant';

// let accountMap = new Map();

// Portfolio link button
export const addPortfolio = (address) => {
  removePortfolio();
  const tab = document.querySelector("[aria-label='Primary']");
  const firstChild = tab.firstChild;
  const portfolio = firstChild.cloneNode(true);
  createPortfolioSVG(portfolio);
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
  portfolio.setAttribute('href', `/portfolio/?address=${address}`);

  tab.insertBefore(portfolio, firstChild.nextSibling);
};
export const removePortfolio = () => {
  const tab = document.querySelector("[aria-label='Primary']");
  const portfolio = tab.querySelector("[aria-label='Portfolio']");
  if (portfolio) {
    portfolio.remove();
  }
};
function createPortfolioSVG(parent) {
  parent.setAttribute('aria-label', 'Portfolio');
  parent.setAttribute('data-testid', 'Portfolio Tab');
  parent.setAttribute('role', 'Portfolio Nav');

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

// Portfolio data fetching
const setAccountInfo = (data) => {
  if (!data) {
    return;
  }
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

// Portfolio Injection
// function attachPortfolio() {}
