const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = "http://20.244.56.144/evaluation-service";
const headers = {
  Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
};

// Helper: Pearson correlation coefficient
function computeCorrelation(dataX, dataY) {
  const n = Math.min(dataX.length, dataY.length);
  if (n === 0) return 0;

  const X = dataX.slice(0, n).map(d => d.price);
  const Y = dataY.slice(0, n).map(d => d.price);

  const meanX = X.reduce((a, b) => a + b, 0) / n;
  const meanY = Y.reduce((a, b) => a + b, 0) / n;

  let cov = 0, stdDevX = 0, stdDevY = 0;
  for (let i = 0; i < n; i++) {
    cov += (X[i] - meanX) * (Y[i] - meanY);
    stdDevX += (X[i] - meanX) ** 2;
    stdDevY += (Y[i] - meanY) ** 2;
  }

  cov = cov / (n - 1);
  stdDevX = Math.sqrt(stdDevX / (n - 1));
  stdDevY = Math.sqrt(stdDevY / (n - 1));

  const correlation = cov / (stdDevX * stdDevY || 1);
  return correlation;
}

app.get("/stocks/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const minutes = parseInt(req.query.minutes) || 10;

  try {
    const response = await axios.get(`${BASE_URL}/stocks/${ticker}?minutes=${minutes}`, { headers });
    const prices = response.data;

    const average =
      prices.reduce((sum, item) => sum + item.price, 0) / prices.length || 0;

    res.json({
      averageStockPrice: average,
      priceHistory: prices,
    });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || "Internal Server Error" });
  }
});

app.get("/stockcorrelation", async (req, res) => {
  const { minutes, ticker } = req.query;

  if (!minutes || !ticker || !Array.isArray(ticker) || ticker.length !== 2) {
    return res.status(400).json({
      error: "Provide 'minutes' and exactly 2 'ticker' values in query",
    });
  }

  try {
    const [tickerA, tickerB] = ticker;

    const [resA, resB] = await Promise.all([
      axios.get(`${BASE_URL}/stocks/${tickerA}?minutes=${minutes}`, { headers }),
      axios.get(`${BASE_URL}/stocks/${tickerB}?minutes=${minutes}`, { headers }),
    ]);

    const pricesA = resA.data;
    const pricesB = resB.data;

    const avgA = pricesA.reduce((sum, p) => sum + p.price, 0) / pricesA.length || 0;
    const avgB = pricesB.reduce((sum, p) => sum + p.price, 0) / pricesB.length || 0;

    const correlation = computeCorrelation(pricesA, pricesB);

    res.json({
      correlation: parseFloat(correlation.toFixed(4)),
      stocks: {
        [tickerA]: {
          averagePrice: avgA,
          priceHistory: pricesA,
        },
        [tickerB]: {
          averagePrice: avgB,
          priceHistory: pricesB,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
