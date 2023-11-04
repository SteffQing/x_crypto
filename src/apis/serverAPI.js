import { CMC_URL } from '../../utils/constant';
import { getRequest } from './httpAPI';

export const getTokenInfo = (symbols) =>
  getRequest({
    url: `${CMC_URL}?symbols=${symbols.join(',')}`,
  });
