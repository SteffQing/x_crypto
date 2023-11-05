const express = require('express');
const cors = require('cors');
const { searchToken, fetchTokenSocials } = require('./fragments');

const CMC_APIKEY = 'e148bef1-3453-496e-b9c9-c75aae15f579';
const CMC_URL =
  'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';

const app = express();

// Allow requests from your Chrome extension
app.use(cors());

function parseData(data) {
  const _data = data.data;
  const parsedData = [];
  for (let token in _data) {
    const {
      symbol,
      quote: {
        USD: { price, volume_24h, percent_change_24h },
      },
      platform,
    } = _data[token][0];
    const { token_address, slug } = platform
      ? platform
      : { token_address: null, slug: null };
    parsedData.push({
      symbol,
      price: price.toFixed(2),
      volume_24h: volume_24h.toFixed(),
      percent_change_24h: percent_change_24h.toFixed(2),
      token_address,
      slug,
    });
  }
  return parsedData;
}

// Define your routes here
app.get('/', async (req, res) => {
  const { symbols } = req.query;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('X-CMC_PRO_API_KEY', CMC_APIKEY);

  const requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow',
  };

  let url = `${CMC_URL}?symbol=${symbols}`;
  const data = await fetch(url, { cache: 'no-cache', ...requestOptions })
    .then((response) => response.json()) // Parse response as JSON
    .catch((error) => error);
  res.json(parseData(data));
});

app.get('/search', async (req, res) => {
  const { name } = req.query;

  const data = await searchToken(name);

  res.json(data);
});

app.get('/socials', async (req, res) => {
  const { address, networkId } = req.query;

  const data = await fetchTokenSocials(address, networkId);

  res.json(data);
});

// Start the server
app.listen(4000, () => {
  console.log('Server started on port 4000');
});
