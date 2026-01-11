import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesProfitComparisonChart = ({ data, darkMode, currency = "Rs." }) => {
  const formatTooltip = (value, name) => {
    if (name === 'sales') return [`${currency} ${value?.toLocaleString('en-IN') || '0'}`, 'Sales'];
    if (name === 'profit') return [`${currency} ${value?.toLocaleString('en-IN') || '0'}`, 'Profit'];
    return [value, name];
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
        <XAxis 
          dataKey="time" 
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          fontSize={10}
        />
        <YAxis 
          stroke={darkMode ? "#9ca3af" : "#6b7280"}
          fontSize={10}
          tickFormatter={(value) => `${currency} ${value}`}
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
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
          name="Sales"
        />
        <Line 
          type="monotone" 
          dataKey="profit" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
          name="Profit"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesProfitComparisonChart;



