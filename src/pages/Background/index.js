import {
  MS_GET_ACCOUNT_INFO,
  MS_GET_TOKEN_INFO,
} from '../../../utils/constant';
import { getAccountInfo, getTokenInfo } from '../../apis/serverAPI';

console.log('background');
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
    messageQueue.forEach((message) => {
      injectToContent(message);
    });
    messageQueue = [];

    return true;
  }
});

// Portfolio Injection
chrome.webNavigation.onDOMContentLoaded.addListener(
  (details) => {
    let address = details.url.split('=')[1];
    if (address.length === 42) {
      let message = {
        action: 'addPortfolio',
        address: address,
      };
      messageQueue.push(message);
    }
  },
  {
    url: [{ urlPrefix: 'https://twitter.com/portfolio' }],
  }
);

function injectToContent(msg) {
  const targetUrlPattern = 'https://twitter.com/portfolio?address=';

  chrome.tabs.query({ active: true }, (tabs) => {
    for (const tab of tabs) {
      if (tab.url && tab.url.includes(targetUrlPattern)) {
        chrome.tabs.sendMessage(tab.id, msg, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            console.log('Sent message to the matching tab');
            console.log('Received response from content script: ', response);
          }
        });
        break;
      }
    }
  });
}
