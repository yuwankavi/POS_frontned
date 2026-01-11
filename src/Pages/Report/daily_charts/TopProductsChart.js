import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopProductsChart = ({ data, darkMode, currency = "Rs." }) => {
  const formatTooltip = (value) => `${currency} ${value?.toLocaleString('en-IN') || '0'}`;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
        <XAxis 
          type="number"
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          fontSize={10}
          tickFormatter={(value) => `${currency} ${value}`}
        />
        <YAxis 
          type="category" 
          dataKey="name"
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          fontSize={10}
          width={80}
        />
        <Tooltip 
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: darkMode ? '#1f2937' : '#fff',
            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
        <Bar 
          dataKey="sales" 
          fill="#10b981" 
          radius={[0, 2, 2, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopProductsChart;