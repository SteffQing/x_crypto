const request = async (req) => {
  const { url, method, body } = req;
  const headers = {
    'Content-Type': 'application/json',
    body: body ? JSON.stringify(body) : null,
  };
  return fetch(url, {
    method,
    headers,
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
