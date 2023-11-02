import { SERVER_URL } from '../../utils/constant';
import { getRequest } from './httpAPI';

export const getUserInfo = (names) =>
  getRequest({
    url: `${SERVER_URL}/api?names=${encodeURIComponent(names.join(','))}`,
  });
