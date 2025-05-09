const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000;
const BASE_URL = 'http://20.244.56.144/evaluation-service/stocks';

app.use(cors());

// Get all stocks
app.get('/api/stocks', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// Get stock price or price history
app.get('/api/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { minutes } = req.query;

  const url = minutes ? `${BASE_URL}/${ticker}?minutes=${minutes}` : `${BASE_URL}/${ticker}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
