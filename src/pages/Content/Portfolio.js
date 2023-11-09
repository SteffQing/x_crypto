import { MS_GET_ACCOUNT_INFO } from '../../../utils/constant';
import { createSpan, createTable, mergeToDiv } from './CreateElements';

let accountMap = new Map();

// Portfolio link button
export const addPortfolio = async (address) => {
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
  portfolio.setAttribute('href', `/portfolio?address=${address}`);

  tab.insertBefore(portfolio, firstChild.nextSibling);
};
export const removePortfolio = () => {
  const tab = document.querySelector("[aria-label='Primary']");
  if (!tab) return;
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

// Portfolio data fetching and setting
const setAccountInfo = (data) => {
  if (data.length === 0) {
    return;
  }
  accountMap.set(data.address, data);
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

// Portfolio HTML to inject
function attachPortfolio(address) {
  const main = document.querySelector("[data-testid='primaryColumn']");
  const sideBar = document.querySelector("[data-testid='sidebarColumn']");
  const accountInfo = accountMap.get(address);
  if (!accountInfo) return;
  const parent = main.parentNode;
  const newDiv = createInfo(accountInfo);
  main.remove();
  if (sideBar) {
    parent.insertBefore(newDiv, sideBar);
  } else parent.appendChild(newDiv);
}

function createInfo(accountInfo) {
  const newDiv = document.createElement('div');
  newDiv.setAttribute('data-testid', 'primaryColumn');
  newDiv.classList.add('primaryColumn');

  let { address, assets, totalBalanceUsd, totalCount } = accountInfo;

  // Portfolio header
  const addressShort = `⛓️${address.substring(0, 4)}...${address.slice(-3)}`;
  const addressNode = createSpan(addressShort);
  const totalBalanceUsdNode = createSpan(totalBalanceUsd, true);
  const totalCountNode = createSpan(totalCount);

  const headerNode = mergeToDiv(
    addressNode,
    totalBalanceUsdNode,
    totalCountNode
  );
  headerNode.classList.add('header');

  // Portfolio table
  const table = createTable(assets);
  table.classList.add('table');

  newDiv.appendChild(headerNode);
  newDiv.appendChild(table);

  return newDiv;
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log('content msg', request, sender, sendResponse);
  if (request.action === 'addPortfolio') {
    try {
      await getAccountInfo(request.address);
      attachPortfolio(request.address);
    } catch (error) {
      console.log('Error: ', error.message);
    }
  }
});