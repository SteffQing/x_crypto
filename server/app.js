const express = require('express');
const cors = require('cors');
const {
  searchToken,
  fetchTokenSocials,
  getChart,
  getSparklines,
} = require('./fragments');
const { getAccountBalance } = require('./account');
const {
  get_approve_calldata,
  get_swap_calldata,
  checkAllowance,
} = require('./swap');

const app = express();

app.use(cors());

app.get('/api', async (req, res) => {
  try {
    const { symbols } = req.query;
    let _symbols = symbols.split(',');
    const results = [];
    for (let symbol of _symbols) {
      const searchResult = await searchToken(symbol);
      const { address, networkId } = searchResult;
      const socialsResults = await fetchTokenSocials(address, networkId);
      const bar = await getChart(address, networkId);
      const sparks = await getSparklines(address, networkId);
      const { twitter } = socialsResults.socialLinks;
      results.push({ ...searchResult, twitter, bar, sparks });
    }
    res.json(results);
  } catch (error) {
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

app.get('/sparkline', async (req, res) => {
  const { address, networkId } = req.query;

  const data = await getSparklines(address, networkId);

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

app.get('/approve', async (req, res) => {
  const { address } = req.query;

  if (address.length !== 42) {
    res.status(500).json({ error: 'Invalid address' });
    return;
  }

  try {
    const data = await get_approve_calldata(address);
    res.json(data);
  } catch (error) {
    console.log('Error in /approve: ', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/swap', async (req, res) => {
  const { src, dst, amount, from, slippage } = req.query;

  if (src.length !== 42 || dst.length !== 42) {
    res.status(500).json({ error: 'Invalid address' });
    return;
  }

  try {
    const data = await get_swap_calldata(src, dst, amount, from, slippage);
    res.json(data);
  } catch (error) {
    console.log('Error in /swap: ', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/allowance', async (req, res) => {
  const { tokenAddress, walletAddress } = req.query;

  if (tokenAddress.length !== 42) {
    res.status(500).json({ error: 'Invalid address' });
    return;
  }

  try {
    const data = await checkAllowance(tokenAddress, walletAddress);
    res.json(data);
  } catch (error) {
    console.log('Error in /allowance: ', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
// app.listen(4000, () => {
//   console.log('Server started on port 4000');
// });

module.exports = app;
