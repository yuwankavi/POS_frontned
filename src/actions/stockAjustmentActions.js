// actions/Inventory/stockAdjustmentActions.js

import {
  FETCH_STOCK_ADJUSTMENT_REQUEST,
  FETCH_STOCK_ADJUSTMENT_SUCCESS,
  FETCH_STOCK_ADJUSTMENT_FAIL,
  ADD_STOCK_ADJUSTMENT_REQUEST,
  ADD_STOCK_ADJUSTMENT_SUCCESS,
  ADD_STOCK_ADJUSTMENT_FAIL,
} from "../../src/constants/Inventory/stockAdjustmentConstants";

import stockAdjustmentService from "../../src/services/Inventory/stockAdjustmentService";

//Add Stock Adjustment
export const addStockAdjustmentAction = (adjustmentData) => async (dispatch) => {
  dispatch({ type: ADD_STOCK_ADJUSTMENT_REQUEST });
  try {
    const data = await stockAdjustmentService.addStockAdjustment(adjustmentData);
    dispatch({ type: ADD_STOCK_ADJUSTMENT_SUCCESS, payload: data });

    // Refresh stock adjustments after adding
    dispatch(fetchStockAdjustmentsAction());
  } catch (error) {
    dispatch({
      type: ADD_STOCK_ADJUSTMENT_FAIL,
      payload: error.message || "Failed to add stock adjustment",
    });
  }
};

//List Stock Adjustments
export const fetchStockAdjustmentsAction = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_STOCK_ADJUSTMENT_REQUEST });

    const data = await stockAdjustmentService.getStockAdjustmentDetails();

    dispatch({
      type: FETCH_STOCK_ADJUSTMENT_SUCCESS,
      payload: data?.ResultSet || [],
    });
  } catch (error) {
    dispatch({
      type: FETCH_STOCK_ADJUSTMENT_FAIL,
      payload:
        error.response?.data?.message || error.message || "Failed to load stock adjustments",
    });
  }
};
