import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';

const ItemsReport = () => {
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
        const key = it.PRCODE || it.SKU || it.PRDESC || 'Unknown';
        const desc = it.PRDESC || it.SKU || key;
        if (!map[key]) map[key] = { key, desc, soldQty: 0, salesValue: 0, totalProfit: 0 };
        map[key].soldQty += parseFloat(it.SOLDQTY || 0);
        map[key].salesValue += parseFloat(it.SALESVALUE || 0);
        map[key].totalProfit += parseFloat(it.TOTAL_PROFIT || 0);
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
        <h2 className="text-lg font-semibold">Items Report</h2>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Sales</th>
                <th className="px-4 py-2 text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.map(d => (
                <tr key={d.key} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{d.desc}</td>
                  <td className="px-4 py-2 text-right">{d.soldQty}</td>
                  <td className="px-4 py-2 text-right">Rs {d.salesValue.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">Rs {d.totalProfit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemsReport;
