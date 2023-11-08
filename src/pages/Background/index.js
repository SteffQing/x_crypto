import {
  MS_GET_ACCOUNT_INFO,
  MS_GET_TOKEN_INFO,
} from '../../../utils/constant';
import { getAccountInfo, getTokenInfo } from '../../apis/serverAPI';

console.log('background');

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
});
