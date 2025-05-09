import React, { useEffect, useState } from 'react';
import { getStocks, getStockData } from '../services/api';
import StockChart from '../components/StockChart';
import {
  Select, MenuItem, FormControl, InputLabel, Container, Typography,
} from '@mui/material';

const StockPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedTicker, setSelectedTicker] = useState('');
  const [minutes, setMinutes] = useState(10);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    getStocks().then(res => {
      setStocks(res.data.stocks);
    });
  }, []);

  useEffect(() => {
    if (selectedTicker) {
      getStockData(selectedTicker, minutes).then(res => {
        setStockData(res.data);
      });
    }
  }, [selectedTicker, minutes]);

  return (
    <Container>
      <Typography variant="h4">Stock Page</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Stock</InputLabel>
        <Select value={selectedTicker} onChange={(e) => setSelectedTicker(e.target.value)}>
          {Object.entries(stocks).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>
              {name} ({ticker})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Minutes</InputLabel>
        <Select value={minutes} onChange={(e) => setMinutes(e.target.value)}>
          {[10, 30, 60].map((m) => (
            <MenuItem key={m} value={m}>{m}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <StockChart data={stockData} />
    </Container>
  );
};

export default StockPage;
