import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const HourlySalesChart = ({ data, darkMode, currency = "Rs." }) => {
  const formatTooltip = (value, name) => {
    if (name === 'sales') return [`${currency} ${value?.toLocaleString('en-IN') || '0'}`, 'Sales'];
    if (name === 'transactions') return [value, 'Transactions'];
    return [value, name];
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
        <XAxis 
          dataKey="hour" 
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          fontSize={10}
        />
        <YAxis 
          yAxisId="left"
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          fontSize={10}
          tickFormatter={(value) => `${currency} ${value}`}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          fontSize={10}
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
        <Legend />
        <Bar 
          yAxisId="left"
          dataKey="sales" 
          fill="#3b82f6" 
          name="Sales"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          yAxisId="right"
          dataKey="transactions" 
          fill="#10b981" 
          name="Transactions"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HourlySalesChart;