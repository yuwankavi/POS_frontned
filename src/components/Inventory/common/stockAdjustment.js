import React, { useState } from "react";

export default function DocumentSummaryTable() {
  // Sample data
  const documents = [
    {
      pdt_document_type: "INV",
      pdt_description: "Invoice",
      pdd_wh_code: "WH1",
      pdd_document_no: 1001,
      pdd_date: "2025-09-01",
      doc_status: "A",
      total_lines: 3,
      total_quantity: 150,
      total_value: 75000,
      pdd_created_date: "2025-09-01",
      pdd_updated_date: "2025-09-02",
    },
    {
      pdt_document_type: "GRN",
      pdt_description: "Goods Received Note",
      pdd_wh_code: "WH2",
      pdd_document_no: 2005,
      pdd_date: "2025-08-29",
      doc_status: "C",
      total_lines: 5,
      total_quantity: 80,
      total_value: 20000,
      pdd_created_date: "2025-08-29",
      pdd_updated_date: "2025-08-30",
    },
  ];

  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const filteredDocs = documents.filter(
    (doc) =>
      (warehouseFilter === "" ||
        doc.pdd_wh_code.toLowerCase().includes(warehouseFilter.toLowerCase())) &&
      (productFilter === "" ||
        doc.pdt_description.toLowerCase().includes(productFilter.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    return status === "A" ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Cancelled
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Document Summary
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by Warehouse"
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Filter by Product"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {filteredDocs.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No documents found.
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
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Document No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Lines
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredDocs.map((doc) => (
                      <tr
                        key={`${doc.pdt_document_type}-${doc.pdd_document_no}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {doc.pdd_wh_code}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {doc.pdt_document_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {doc.pdt_description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {doc.pdd_document_no}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {doc.pdd_date}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(doc.doc_status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {doc.total_lines}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {doc.total_quantity}
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
