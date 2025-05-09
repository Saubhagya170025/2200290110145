import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export const getStocks = () => API.get('/stocks');
export const getStockData = (ticker, minutes) =>
  API.get(`/stocks/${ticker}${minutes ? `?minutes=${minutes}` : ''}`);
