 
import { inventoryService } from '../../services/Inventory/commonDropdownService';
import {
  WAREHOUSE_LIST_REQUEST,
  WAREHOUSE_LIST_SUCCESS,
  WAREHOUSE_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_RESET,
  BATCH_LIST_REQUEST,
  BATCH_LIST_SUCCESS,
  BATCH_LIST_FAIL,
  BATCH_LIST_RESET,
} from '../../constants/Inventory/commonDropdownConstants';

// Get all warehouses
export const listWarehouses = () => async (dispatch) => {
  try {
    dispatch({ type: WAREHOUSE_LIST_REQUEST });

    const response = await inventoryService.getWarehouses();
    
    // Handle different possible response structures
    let warehouses = [];
    
    if (response.data.ResultSet) {
      // Structure: { ResultSet: [...] }
      warehouses = response.data.ResultSet;
    } else if (Array.isArray(response.data)) {
      // Structure: [...]
      warehouses = response.data;
    } else if (response.data.data) {
      // Structure: { data: [...] }
      warehouses = response.data.data;
    } else {
      // Fallback: use the entire response data
      warehouses = response.data;
    }
    

    
    dispatch({
      type: WAREHOUSE_LIST_SUCCESS,
      payload: Array.isArray(warehouses) ? warehouses : [],
    });
  } catch (error) {

    dispatch({
      type: WAREHOUSE_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get products by warehouse
export const listProductsByWarehouse = (warehouseCode) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    const response = await inventoryService.getProductsByWarehouse(warehouseCode);
    
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: response.data.ResultSet || [],
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get batches by product and warehouse
export const listBatchesByProduct = (productCode, warehouseCode) => async (dispatch) => {
  try {
    dispatch({ type: BATCH_LIST_REQUEST });

    const response = await inventoryService.getBatchesByProduct(productCode, warehouseCode);
    
    dispatch({
      type: BATCH_LIST_SUCCESS,
      payload: response.data.ResultSet || [],
    });
  } catch (error) {
    dispatch({
      type: BATCH_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Reset product list
export const resetProducts = () => (dispatch) => {
  dispatch({ type: PRODUCT_LIST_RESET });
};

// Reset batch list
export const resetBatches = () => (dispatch) => {
  dispatch({ type: BATCH_LIST_RESET });
};