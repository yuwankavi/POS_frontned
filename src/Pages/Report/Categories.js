import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

const CategoriesReport = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [reportDate, setReportDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const load = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getInvoiceReports(date);
      const items = res.ResultSet || [];
      const map = {};
      items.forEach(it => {
        const cat = it.CATEGORYNAME || 'Uncategorized';
        if (!map[cat]) map[cat] = { category: cat, soldQty: 0, salesValue: 0 };
        map[cat].soldQty += parseFloat(it.SOLDQTY || 0);
        map[cat].salesValue += parseFloat(it.SALESVALUE || 0);
      });
      setData(Object.values(map));
    } catch (err) {
      setError(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(reportDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Categories Report</h2>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="p-2 rounded-lg border bg-white dark:bg-gray-700 text-sm"
          />
          <button
            onClick={() => load(reportDate)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg"
          >
            Get Report
          </button>
        </div>
      </div>

      {loading && <div className="p-4">Loading...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map(d => (
            <div key={d.category} className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{d.category}</div>
              <div className="text-xs text-gray-500">Qty: {d.soldQty}</div>
              <div className="text-sm font-semibold text-purple-600 dark:text-purple-300">Rs {d.salesValue.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesReport;
