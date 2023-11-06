const express = require('express');
const cors = require('cors');
const { searchToken, fetchTokenSocials, getChart } = require('./fragments');

const app = express();

// Allow requests from your Chrome extension
app.use(cors());

// Define your routes here
app.get('/', async (req, res) => {
  const { symbols } = req.query;
  let _symbols = symbols.split(',');
  const results = [];
  for (let symbol of _symbols) {
    const searchResult = await searchToken(symbol);
    const { address, networkId } = searchResult;
    const socialsResults = await fetchTokenSocials(address, networkId);
    const { twitter } = socialsResults.socialLinks;
    results.push({ ...searchResult, twitter });
  }
  res.json(results);
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

app.get('/chart', async (req, res) => {
  const { address, networkId } = req.query;

  const data = await getChart(address, networkId);

  res.json(data);
});

// Start the server
app.listen(4000, () => {
  console.log('Server started on port 4000');
});
