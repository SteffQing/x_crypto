import { SERVER_URL } from '../../utils/constant';
import { getRequest } from './httpAPI';

export const getTokenInfo = (symbols) =>
  getRequest({
    url: `${SERVER_URL}/api?symbols=${encodeURIComponent(symbols.join(','))}`,
  });

export const getAccountInfo = (address) =>
  getRequest({
    url: `${SERVER_URL}/account?address=${address}`,
  });

export const swapEndpoint = (endpoint) =>
  getRequest({
    url: endpoint,
  });
