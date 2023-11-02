import { MS_GET_USER_INFO } from '../../../utils/constant';
import { getUserInfo } from '../../apis/serverAPI';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('back msg', message, sender, sendResponse);

  if (message.action === MS_GET_USER_INFO) {
    getUserInfo(message.names)
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
