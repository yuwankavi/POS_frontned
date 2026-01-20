import {
  PO_LIST_REQUEST,
  PO_LIST_SUCCESS,
  PO_LIST_FAIL,
  PO_BY_ID_REQUEST,
  PO_BY_ID_SUCCESS,
  PO_BY_ID_FAIL,
  PO_BY_SUPPLIER_REQUEST,
  PO_BY_SUPPLIER_SUCCESS,
  PO_BY_SUPPLIER_FAIL,
  PO_CREATE_REQUEST,
  PO_CREATE_SUCCESS,
  PO_CREATE_FAIL,
  PO_UPDATE_REQUEST,
  PO_UPDATE_SUCCESS,
  PO_UPDATE_FAIL,
  PO_CLEAR_SELECTED,
} from "../constants/purchaseOrderConstants";
import purchaseOrderService from "../services/purchaseOrderService";

/**
 * Get all Purchase Orders
 */
export const listAllPurchaseOrders = () => async (dispatch, getState) => {
  const { poList } = getState();
  if (poList?.loading) return;

  try {
    dispatch({ type: PO_LIST_REQUEST });
    
    const data = await purchaseOrderService.getAllPO();
    
    // Group the data by PO ID
    const groupedData = purchaseOrderService.groupPOData(data.ResultSet);
    
    dispatch({
      type: PO_LIST_SUCCESS,
      payload: groupedData,
    });
  } catch (error) {
    dispatch({
      type: PO_LIST_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load purchase orders",
    });
  }
};

/**
 * Get Purchase Order by ID
 * @param {string|number} poId - Purchase Order ID
 */
export const getPurchaseOrderById = (poId) => async (dispatch) => {
  try {
    dispatch({ type: PO_BY_ID_REQUEST });
    
    const data = await purchaseOrderService.getPOById(poId);
    
    // Group the data (should be single PO with items)
    const groupedData = purchaseOrderService.groupPOData(data.ResultSet);
    
    dispatch({
      type: PO_BY_ID_SUCCESS,
      payload: groupedData[0] || null,
    });
  } catch (error) {
    dispatch({
      type: PO_BY_ID_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load purchase order",
    });
  }
};

/**
 * Get Purchase Orders by Supplier ID
 * @param {string|number} supplierId - Supplier ID
 */
export const getPurchaseOrdersBySupplier = (supplierId) => async (dispatch) => {
  try {
    dispatch({ type: PO_BY_SUPPLIER_REQUEST });
    
    const data = await purchaseOrderService.getPOBySupplier(supplierId);
    
    // Group the data by PO ID
    const groupedData = purchaseOrderService.groupPOData(data.ResultSet);
    
    dispatch({
      type: PO_BY_SUPPLIER_SUCCESS,
      payload: groupedData,
    });
  } catch (error) {
    dispatch({
      type: PO_BY_SUPPLIER_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load supplier purchase orders",
    });
  }
};

/**
 * Create a new Purchase Order
 * @param {Object} poData - Purchase order data
 */
export const createPurchaseOrder = (poData) => async (dispatch) => {
  try {
    dispatch({ type: PO_CREATE_REQUEST });
    
    const data = await purchaseOrderService.createPO(poData);
    
    dispatch({
      type: PO_CREATE_SUCCESS,
      payload: data,
    });
    
    // Refresh the list after creating
    dispatch(listAllPurchaseOrders());
    
    return data;
  } catch (error) {
    dispatch({
      type: PO_CREATE_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to create purchase order",
    });
    throw error;
  }
};

/**
 * Update Purchase Order Status
 * @param {string|number} poId - Purchase Order ID
 * @param {string} status - New status ('P', 'R', 'C')
 */
export const updatePurchaseOrderStatus = (poId, status) => async (dispatch) => {
  try {
    dispatch({ type: PO_UPDATE_REQUEST });
    
    const data = await purchaseOrderService.updatePOStatus(poId, status);
    
    dispatch({
      type: PO_UPDATE_SUCCESS,
      payload: data,
    });
    
    // Refresh the list after updating
    dispatch(listAllPurchaseOrders());
    
    return data;
  } catch (error) {
    dispatch({
      type: PO_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to update purchase order",
    });
    throw error;
  }
};

/**
 * Clear selected Purchase Order
 */
export const clearSelectedPO = () => ({
  type: PO_CLEAR_SELECTED,
});
