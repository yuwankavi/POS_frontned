import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryDistribution = ({ data, darkMode, currency = "Rs." }) => {
  const colors = ['#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ef4444', '#f59e0b'];
  
  const formatTooltip = (value, name, props) => {
    const salesValue = props.payload.sales || value;
    return [`${currency} ${salesValue?.toLocaleString('en-IN') || '0'}`, name];
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: darkMode ? '#1f2937' : '#fff',
            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryDistribution;