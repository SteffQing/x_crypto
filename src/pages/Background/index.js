import { MS_GET_TOKEN_INFO } from '../../../utils/constant';
import { getTokenInfo } from '../../apis/serverAPI';

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
});
