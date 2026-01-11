// actions/admin/purchaseActions.js
import {
  FETCH_PURCHASE_ORDER_REQUEST,
  FETCH_PURCHASE_ORDER_SUCCESS,
  FETCH_PURCHASE_ORDER_FAIL,
  ADD_PURCHASE_ORDER_REQUEST,
  ADD_PURCHASE_ORDER_SUCCESS,
  ADD_PURCHASE_ORDER_FAIL,
  UPDATE_SUPPLIER_REQUEST,
  UPDATE_SUPPLIER_SUCCESS,
  UPDATE_SUPPLIER_FAIL,
} from "../../constants/Inventory/purchaseConstants";

import purchaseService from "../../services/Inventory/purchaseService";

// Fetch all purchase orders
export const listPurchaseOrders = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PURCHASE_ORDER_REQUEST });

    const orders = await purchaseService.getAll();



    dispatch({
      type: FETCH_PURCHASE_ORDER_SUCCESS,
      payload: orders,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PURCHASE_ORDER_FAIL,
      payload:
        error.response?.data?.message || error.message || "Failed to fetch",
    });
  }
};

// Add GRN
export const addGrn = (grnData) => async (dispatch) => {
  dispatch({ type: ADD_PURCHASE_ORDER_REQUEST });
  try {
    const response = await purchaseService.addGrn(grnData);

    dispatch({
      type: ADD_PURCHASE_ORDER_SUCCESS,
      payload: response,
    });

    // Optionally refresh list
  dispatch(listPurchaseOrders());
  } catch (error) {
    dispatch({
      type: ADD_PURCHASE_ORDER_FAIL,
      payload:
        error.response?.data?.message || error.message || "Failed to add GRN",
    });
  }
};

// Update GRN Supplier
export const updateSupplier = ({ P_SUPCODE, P_DOCNO }) => async (dispatch) => {
  dispatch({ type: UPDATE_SUPPLIER_REQUEST });
  try {
    const response = await purchaseService.updateGrnSupplier({ P_SUPCODE, P_DOCNO });



    dispatch({
      type: UPDATE_SUPPLIER_SUCCESS,
      payload: response,
    });

    // Optionally refresh list
    dispatch(listPurchaseOrders());
  } catch (error) {
    dispatch({
      type: UPDATE_SUPPLIER_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to update supplier",
    });
  }
};
