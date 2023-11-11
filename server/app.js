const express = require('express');
const cors = require('cors');
const { searchToken, fetchTokenSocials, getChart } = require('./fragments');
const { getAccountBalance } = require('./account');

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
  try {
    const { symbols } = req.query;
    let _symbols = symbols.split(',');
    const results = [];
    for (let symbol of _symbols) {
      const searchResult = await searchToken(symbol);
      const { address, networkId } = searchResult;
      const socialsResults = await fetchTokenSocials(address, networkId);
      const bar = await getChart(address, networkId);
      const { twitter } = socialsResults.socialLinks;
      results.push({ ...searchResult, twitter, bar });
    }
    res.json(results);
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({ error: error.message });
  }
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

app.get('/account', async (req, res) => {
  const { address } = req.query;

  if (address.length !== 42) {
    res.status(500).json({ error: 'Invalid address' });
    return;
  }

  try {
    const data = await getAccountBalance(address);
    res.json(data);
  } catch (error) {
    console.log('Error in /account: ', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server started on port 4000');
});
