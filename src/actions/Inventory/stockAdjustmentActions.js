// actions/Inventory/stockAdjustmentActions.js

import stockAdjustmentService from "../../services/Inventory/stockAdjustmentService.js";
import {
  FETCH_STOCK_ADJUSTMENT_REQUEST,
  FETCH_STOCK_ADJUSTMENT_SUCCESS,
  FETCH_STOCK_ADJUSTMENT_FAIL,
  ADD_STOCK_ADJUSTMENT_REQUEST,
  ADD_STOCK_ADJUSTMENT_SUCCESS,
  ADD_STOCK_ADJUSTMENT_FAIL,
} from "../../constants/Inventory/stockAdjustmentConstants.js";

// Fetch all stock adjustments
export const listStockAdjustments = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_STOCK_ADJUSTMENT_REQUEST });

    const data = await stockAdjustmentService.getAll();

    // API returns ResultSet or data array
    const adjustments = data?.ResultSet || [];

    dispatch({
      type: FETCH_STOCK_ADJUSTMENT_SUCCESS,
      payload: adjustments,
    });
  } catch (error) {
    dispatch({
      type: FETCH_STOCK_ADJUSTMENT_FAIL,
      payload: error.message || "Failed to fetch stock adjustments",
    });
  }
};

// Add a new stock adjustment
export const addStockAdjustment = (adjustment) => async (dispatch) => {
  try {
    dispatch({ type: ADD_STOCK_ADJUSTMENT_REQUEST });

    const data = await stockAdjustmentService.addStockAdjustment(adjustment);

    dispatch({
      type: ADD_STOCK_ADJUSTMENT_SUCCESS,
      payload: data, // you may adjust based on API response
    });

    // Refresh list after adding
    dispatch(listStockAdjustments());
  } catch (error) {
    dispatch({
      type: ADD_STOCK_ADJUSTMENT_FAIL,
      payload: error.message || "Failed to add stock adjustment",
    });
  }
};
