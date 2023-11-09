import {
  MS_GET_ACCOUNT_INFO,
  MS_GET_TOKEN_INFO,
} from '../../../utils/constant';
import { getAccountInfo, getTokenInfo } from '../../apis/serverAPI';

console.log('background');
let contentScriptReady = false;
let messageQueue = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('back msg', message, sender, sendResponse);

  if (message.action === MS_GET_TOKEN_INFO) {
    getTokenInfo(message.cashtags)
      .then((infos) => {
        sendResponse(infos);
      })
      .catch((error) => {
        console.error('background:', error);
        sendResponse([]);
      });

    return true;
  }

  if (message.action === MS_GET_ACCOUNT_INFO) {
    getAccountInfo(message.address)
      .then((infos) => {
        sendResponse(infos);
      })
      .catch((error) => {
        console.error('background getAccountInfo:', error);
        sendResponse([]);
      });

    return true;
  }
  if (message.action === 'content_script_ready') {
    contentScriptReady = true;
    messageQueue.forEach((message) => {
      chrome.runtime.sendMessage(message);
    });
    messageQueue = [];
    setTimeout(() => {
      contentScriptReady = false;
    }, 5000);
  }
});

// Portfolio Injection
chrome.webNavigation.onDOMContentLoaded.addListener(
  function (details) {
    console.log(details, 'onDOMContentLoaded');
    let address = details.url.split('=')[1];
    if (address.length === 42) {
      let message = {
        action: 'addPortfolio',
        address: address,
      };
      if (contentScriptReady) {
        chrome.runtime.sendMessage(message);
      } else messageQueue.push(message);
    }
  },
  {
    url: [{ urlPrefix: 'https://twitter.com/portfolio' }],
  }
);
