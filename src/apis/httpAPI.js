import { CMC_APIKEY } from '../../utils/constant';

const request = async (req) => {
  const { url, method } = req;
  const headers = new Headers();
  headers.append('X-CMC_PRO_API_KEY', CMC_APIKEY);
  return fetch(url, {
    method,
    headers,
    redirect: 'follow',
  })
    .then((response) => response.json()) // Parse response as JSON
    .catch((error) => error);
};

export const getRequest = (req) =>
  request({
    ...req,
    method: 'GET',
  });

export const postRequest = (req) =>
  request({
    ...req,
    method: 'POST',
  });

export const putRequest = (req) =>
  request({
    ...req,
    method: 'PUT',
  });

export const deleteRequest = (req) =>
  request({
    ...req,
    method: 'DELETE',
  });
