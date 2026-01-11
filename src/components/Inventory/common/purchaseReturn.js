import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listPurchaseReturnOrders } from "../../../actions/admin/purchaseReturnActions.js";
import { FiEdit3, FiEye, FiTrash2 } from "react-icons/fi";
// import { openModal } from "../../../actions/modalActions.js";

export default function PurchaseReturnTable() {
  const dispatch = useDispatch();

  const { loading, error, returns: purchaseReturnOrders = [] } =
    useSelector((state) => state.purchaseReturnOrders) || {};

  useEffect(() => {
    dispatch(listPurchaseReturnOrders());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        label: "Pending",
      },
      APPROVED: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        label: "Approved",
      },
      REJECTED: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        label: "Rejected",
      },
      COMPLETED: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        label: "Completed",
      },
    };

    const statusConfig = statusMap[status] || statusMap.PENDING;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
      >
        {statusConfig.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Purchase Return Management
          </h2>
          <button
            onClick={() => dispatch(openModal("ADD_PURCHASE_RETURN"))}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
          >
            + Add New
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              Loading purchase returns...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : purchaseReturnOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No purchase returns found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-h-[505px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Warehouse Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Document Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Document No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Product Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Batch ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Line
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Product Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Value
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Avg. Rate
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Balance Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        DOC PDate
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        DOCSupID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        DOCCusID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        DOCIN No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        DOCIN Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        DOCRL CODE
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        DOC Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {purchaseReturnOrders.map((returns) => (
                      <tr
                        key={returns.PRN_ID || `${returns.PRN_DOCNo}-${returns.PRN_PrCode}-${returns.PRN_Line}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {returns.PRN_WHCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {returns.PRN_DOCType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {returns.DOCNo}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {returns.PRN_PrCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {returns.PRN_BatchId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {returns.PRN_Line}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(returns.PRN_PDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {returns.PRN_Qty}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                          {returns.PRN_Val}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                          {returns.AVERate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                          {returns.PRN_BLQty}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                          {formatDate(returns.PRN_DOCPDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                          {returns.PRN_DOCSupID}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                          {returns.PRN_DOCCusID}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                          {returns.PRN_DOCINNo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                          {formatDate(returns.PRN_DOCINDate)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(returns.PRN_DOCStatus)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(returns.PRN_DOCPrintStatus)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(openModal("VIEW_PURCHASE_RETURN", { returns }));
                              }}
                              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(openModal("UPDATE_PURCHASE_RETURN", { returns }));
                              }}
                              className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-colors"
                              title="Update"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(openModal("DELETE_PURCHASE_RETURN", { returns }));
                              }}
                              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
