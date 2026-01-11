import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiSearch, FiPackage, FiCheckCircle, FiX, FiFileText, FiClock, FiCheck, FiXCircle, FiLayers } from "react-icons/fi";
import { openModal } from "../../../actions/modalActions.js";
import { listPurchaseOrders } from "../../../actions/admin/puchaseActions.js";
import Breadcrumb from "../../common/Breadcrumb";

export default function PurchaseOrderPage() {
  const dispatch = useDispatch();
  const { loading, error, orders: purchaseOrders = [] } =
    useSelector((state) => state.purchaseOrders) || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    dispatch(listPurchaseOrders());
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

  // Filtering logic
  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.DOCNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.GRN_PrCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const status = order.GRN_DOCStatus?.toUpperCase() || "PENDING"; // normalize

    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && status === activeFilter;
  });


  // Stats
  const totalOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(
    (o) => (o.GRN_DOCStatus?.toUpperCase() || "PENDING") === "PENDING"
  ).length;
  const approvedOrders = purchaseOrders.filter(
    (o) => o.GRN_DOCStatus?.toUpperCase() === "APPROVED"
  ).length;
  const completedOrders = purchaseOrders.filter(
    (o) => o.GRN_DOCStatus?.toUpperCase() === "COMPLETED"
  ).length;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb current="Inventory / Store Transaction / GRN" />
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Purchase Order Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
                Track and manage all purchase orders
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(openModal("ADD_GRN"))}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm md:text-base"
          >
            <FiPlus className="w-4 h-4" /> Add New
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalOrders}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                <FiFileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingOrders}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{approvedOrders}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by document no or product code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "PENDING", "APPROVED", "REJECTED", "COMPLETED"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === f
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
              >
                {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-600 dark:text-gray-400">Loading purchase orders...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 dark:text-red-400">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No purchase orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Document No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Product Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Value
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredOrders.map((order, idx) => (
                      <tr
                        key={`${order.DOCNo}-${idx}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {order.DOCNo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {order.GRN_PrCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {order.GRN_Qty}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {parseFloat(order.GRN_Val || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(order.GRN_PDate)}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(order.GRN_DOCStatus)}</td>
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
