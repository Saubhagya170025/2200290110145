import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts';
import { Typography } from '@mui/material';

const StockChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const avg = data.reduce((acc, curr) => acc + curr.price, 0) / data.length;

  return (
    <>
      <Typography variant="h6">Stock Price Chart (last N minutes)</Typography>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="lastUpdatedAt" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#3f51b5" />
        <ReferenceLine y={avg} stroke="red" label="Avg" />
      </LineChart>
    </>
  );
};

export default StockChart;
