import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import reorderAlertService from '../../../services/Inventory/reorderAlertService';
import {
  FiPackage,
  FiSearch,
  FiAlertTriangle,
  FiHome
} from 'react-icons/fi';
import Breadcrumb from '../../../components/common/Breadcrumb.js';

const ROA = () => {
  const { darkMode } = useSelector((state) => state.ui || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reorderAlertService.getReorderLevel();
      const items = res?.ResultSet || [];
      setData(items);
      setTotalItems(res?.totalItems || items.length);
    } catch (err) {
      setError(err.message || 'Failed to load reorder data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter by search term using new field names
  const filtered = data.filter((it) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (it.PPDES || '').toString().toLowerCase().includes(q) ||
      (it.PPROCODE || '').toString().toLowerCase().includes(q) ||
      (it.PWHCODE || '').toString().toLowerCase().includes(q)
    );
  });

  // Get unique warehouses count
  const warehouseCount = Array.from(new Set(data.map(d => d.PWHCODE))).filter(Boolean).length;

  return (
    <div className={`flex flex-col p-1 md:p-1 rounded-xl shadow-md h-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
      <Breadcrumb current="Inventory / Store Transaction / Reorder Alerts (ROA) " />
      <div className="mt-2 mb-3 md:mb-5">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow">
              <FiPackage className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Reorder Alerts (ROA)</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Products at or below reorder level</p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-1 md:mb-2">
          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-300">{totalItems}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiHome className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Low Stock</p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">{data.length}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <FiAlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Warehouses</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-300">{warehouseCount}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiPackage className="w-4 h-4 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-2 shadow border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Search</p>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{searchTerm ? 'Filtering' : 'All'}</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <FiSearch className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search product, code or warehouse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto mb-1 md:mb-2">
        <div className={`rounded-lg p-1 md:p-2 h-full overflow-y-auto ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
          {loading ? (
            <div className="flex items-center justify-center py-8 rounded-xl h-full">
              <div className="text-sm text-gray-600">Loading reorder alerts...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-left">Warehouse</th>
                      <th className="px-4 py-2 text-right">Balance Qty</th>
                      <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {filtered.map((it, idx) => {
                      const balanceQty = parseFloat(it.PBALQTY) || 0;
                      const reorderLevel = parseFloat(it.PREOLEVEL) || 0;
                      const needsReorder = reorderLevel >= balanceQty;
                      return (
                        <tr key={`${it.PPROCODE}-${idx}`} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                          <td className="px-4 py-2">{it.PPDES || `Product ${it.PPROCODE}`}</td>
                          <td className="px-4 py-2">{it.PWHCODE}</td>
                          <td className="px-4 py-2 text-right">{parseInt(balanceQty)}</td>
                          <td className="px-4 py-2 text-right">
                            {needsReorder ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                <FiAlertTriangle className="w-3 h-3" /> Reorder
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">OK</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <FiPackage className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium text-gray-600">No items need reordering</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ROA;
