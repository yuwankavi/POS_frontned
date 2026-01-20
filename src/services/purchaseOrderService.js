import axios from "axios";
import { API_URL } from "../config";

// Helper to get fresh token on each call
const getAuthKey = () => localStorage.getItem("token");

const purchaseOrderService = {
  /**
   * Get Batch Details for all products
   * API: GET /ProductBatches/GetBatchDetails
   * @returns {Promise} - List of batch details with supplier info
   */
  async getBatchDetails() {
    try {
      const response = await axios.get(`${API_URL}/ProductBatches/GetBatchDetails`, {
        headers: {
          "auth-key": getAuthKey(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching batch details:", error);
      throw error;
    }
  },

  /**
   * Get Batch Details for a specific product by product code
   * @param {string|number} productCode - Product code
   * @returns {Promise} - Batch details for the product
   */
  async getBatchDetailsByProduct(productCode) {
    try {
      const response = await this.getBatchDetails();
      const batches = response.ResultSet || [];
      // Filter by product code and return the first match
      return batches.find(b => b.PB_ProCode === productCode.toString()) || null;
    } catch (error) {
      console.error("Error fetching batch details for product:", error);
      throw error;
    }
  },

  /**
   * Get all Purchase Orders
   * @returns {Promise} - List of all purchase orders
   */
  async getAllPO() {
    try {
      const response = await axios.get(`${API_URL}/PO/GetAllPO`, {
        headers: {
          "auth-key": getAuthKey(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all POs:", error);
      throw error;
    }
  },

  /**
   * Get Purchase Order by ID
   * @param {string|number} poId - Purchase Order ID
   * @returns {Promise} - Purchase order details
   */
  async getPOById(poId) {
    try {
      const response = await axios.get(
        `${API_URL}/PO/GetPOById?p_POId=${encodeURIComponent(poId)}`,
        {
          headers: {
            "auth-key": getAuthKey(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching PO by ID:", error);
      throw error;
    }
  },

  /**
   * Get Purchase Orders by Supplier ID
   * @param {string|number} supplierId - Supplier ID
   * @returns {Promise} - List of purchase orders for the supplier
   */
  async getPOBySupplier(supplierId) {
    try {
      const response = await axios.get(
        `${API_URL}/PO/GetPOBySup?p_supplier_id=${encodeURIComponent(supplierId)}`,
        {
          headers: {
            "auth-key": getAuthKey(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching PO by Supplier:", error);
      throw error;
    }
  },

  /**
   * Create a new Purchase Order item
   * API: POST /PO/AddPO?p_supplier_id=15&p_product_code=63&p_qty=10&p_unit_price=1500&p_order_date=2026-01-20
   * @param {Object} itemData - Purchase order item data
   * @returns {Promise} - Created purchase order response
   */
  async addPOItem(itemData) {
    try {
      const { supplierId, productCode, qty, unitPrice, orderDate } = itemData;

      const url = `${API_URL}/PO/AddPO?p_supplier_id=${encodeURIComponent(supplierId)}&p_product_code=${encodeURIComponent(productCode)}&p_qty=${encodeURIComponent(qty)}&p_unit_price=${encodeURIComponent(unitPrice)}&p_order_date=${encodeURIComponent(orderDate)}`;

      const response = await axios.post(url, {}, {
        headers: {
          "auth-key": getAuthKey(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding PO item:", error);
      throw error;
    }
  },

  /**
   * Create a complete Purchase Order with multiple items
   * Calls addPOItem for each item sequentially
   * @param {Object} poData - Purchase order data with items array
   * @returns {Promise} - Array of responses for each item
   */
  async createPO(poData) {
    try {
      const { supplierId, orderDate, items } = poData;
      const results = [];

      for (const item of items) {
        const result = await this.addPOItem({
          supplierId,
          productCode: item.productCode,
          qty: item.quantity,
          unitPrice: item.price,
          orderDate
        });
        results.push(result);
      }

      return {
        StatusCode: 200,
        Result: 'Purchase Order created successfully',
        ResultSet: results
      };
    } catch (error) {
      console.error("Error creating PO:", error);
      throw error;
    }
  },

  /**
   * Update Purchase Order Status
   * @param {string|number} poId - Purchase Order ID
   * @param {string} status - New status ('P' = Pending, 'R' = Received, 'C' = Cancelled)
   * @returns {Promise} - Updated purchase order
   */
  async updatePOStatus(poId, status) {
    try {
      const response = await axios.get(
        `${API_URL}/PO/UpdatePOStatus?p_POId=${encodeURIComponent(poId)}&p_status=${encodeURIComponent(status)}`,
        {
          headers: {
            "auth-key": getAuthKey(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating PO status:", error);
      throw error;
    }
  },

  /**
   * Helper function to group PO items by PO ID
   * @param {Array} rawData - Raw data from API
   * @returns {Array} - Grouped purchase orders with items
   */
  groupPOData(rawData) {
    if (!rawData || !Array.isArray(rawData)) return [];

    const poMap = new Map();

    rawData.forEach((item) => {
      const poId = item.PoId;
      
      if (!poMap.has(poId)) {
        poMap.set(poId, {
          poId: item.PoId,
          supplierId: item.SupplierId,
          supplierName: item.SupplierName,
          orderDate: item.OrderDate,
          status: item.Status,
          createdDate: item.CreatedDate,
          createdBy: item.CreatedBy,
          updatedDate: item.UpdatedDate,
          updatedBy: item.UpdatedBy,
          items: [],
          totalAmount: 0,
          totalItems: 0,
        });
      }

      const po = poMap.get(poId);
      
      // Add item details
      if (item.DetailId) {
        const qty = parseFloat(item.QtyOrdered) || 0;
        const price = parseFloat(item.UnitPrice) || 0;
        const lineTotal = qty * price;

        po.items.push({
          detailId: item.DetailId,
          productCode: item.ProductCode,
          productName: item.ProductName,
          qtyOrdered: qty,
          unitPrice: price,
          lineTotal: lineTotal,
          createdDate: item.DetailCreatedDate,
          createdBy: item.DetailCreatedBy,
        });

        po.totalAmount += lineTotal;
        po.totalItems += qty;
      }
    });

    return Array.from(poMap.values());
  },

  /**
   * Get status label from status code
   * @param {string} statusCode - Status code ('P', 'R', 'C')
   * @returns {string} - Status label
   */
  getStatusLabel(statusCode) {
    const statusMap = {
      'P': 'Pending',
      'R': 'Received',
      'C': 'Cancelled',
    };
    return statusMap[statusCode] || 'Unknown';
  },

  /**
   * Get status color classes for UI
   * @param {string} statusCode - Status code ('P', 'R', 'C')
   * @returns {Object} - Color classes for badge
   */
  getStatusColor(statusCode) {
    const colorMap = {
      'P': {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-400',
        icon: 'text-yellow-500',
      },
      'R': {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-400',
        icon: 'text-green-500',
      },
      'C': {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-400',
        icon: 'text-red-500',
      },
    };
    return colorMap[statusCode] || {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-800 dark:text-gray-300',
      icon: 'text-gray-500',
    };
  },
};

export default purchaseOrderService;
