import { SERVER_URL } from '../../utils/constant';
import { getRequest } from './httpAPI';

export const getTokenInfo = (symbols) =>
  getRequest({
    url: `${SERVER_URL}?symbols=${encodeURIComponent(symbols.join(','))}`,
  });

// async function get(url) {
//   const db = window.
//   let cached = await idbKeyval.get(url);
//   if (!cached) {
//     cached = await fetch(url);
//     idbKeyval.set(url, cached);
//   }
//   return cached;

// }
