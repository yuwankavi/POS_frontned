import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesTrendChart = ({ data, darkMode, currency = "Rs." }) => {
  // Custom tooltip formatter
  const formatTooltip = (value) => `${currency} ${value?.toLocaleString('en-IN') || '0'}`;

  return (
    <ResponsiveContainer width="100%" height={200}>
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
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesTrendChart;


// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const SalesTrendChart = ({ data, darkMode }) => {
//   // Process data for hourly/daily trends
//   const chartData = React.useMemo(() => {
//     // This is sample data - replace with your actual time-based aggregation
//     return [
//       { time: '9 AM', sales: 1200 },
//       { time: '10 AM', sales: 1900 },
//       { time: '11 AM', sales: 3000 },
//       { time: '12 PM', sales: 5000 },
//       { time: '1 PM', sales: 4000 },
//       { time: '2 PM', sales: 3500 },
//       { time: '3 PM', sales: 4200 },
//       { time: '4 PM', sales: 3800 },
//     ];
//   }, [data]);

//   return (
//     <ResponsiveContainer width="100%" height={200}>
//       <LineChart data={chartData}>
//         <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
//         <XAxis 
//           dataKey="time" 
//           stroke={darkMode ? "#9ca3af" : "#6b7280"}
//           fontSize={10}
//         />
//         <YAxis 
//           stroke={darkMode ? "#9ca3af" : "#6b7280"}
//           fontSize={10}
//         />
//         <Tooltip 
//           contentStyle={{
//             backgroundColor: darkMode ? '#1f2937' : '#fff',
//             border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
//             borderRadius: '6px',
//             fontSize: '12px'
//           }}
//         />
//         <Line 
//           type="monotone" 
//           dataKey="sales" 
//           stroke="#3b82f6" 
//           strokeWidth={2}
//           dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default SalesTrendChart;