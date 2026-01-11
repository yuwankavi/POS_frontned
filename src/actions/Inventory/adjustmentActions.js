// src/actions/Inventory/adjustmentActions.js
import adjustmentService from "../../services/Inventory/adjustmentService";
import {
  ADJUSTMENT_ADD_REQUEST,
  ADJUSTMENT_ADD_SUCCESS,
  ADJUSTMENT_ADD_FAIL,
  ADJUSTMENT_LIST_REQUEST,
  ADJUSTMENT_LIST_SUCCESS,
  ADJUSTMENT_LIST_FAIL,
} from "../../constants/Inventory/adjustmentConstants";

// ✅ Get Adjustments
export const listAdjustments = () => async (dispatch) => {
  try {
    dispatch({ type: ADJUSTMENT_LIST_REQUEST });
    const data = await adjustmentService.getAdjustments();
    dispatch({ type: ADJUSTMENT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADJUSTMENT_LIST_FAIL,
      payload: error?.response?.data || error.message,
    });
  }
};

// ✅ Add Adjustment
export const addAdjustment = (adjustmentData) => async (dispatch) => {
  try {
    dispatch({ type: ADJUSTMENT_ADD_REQUEST });
    const data = await adjustmentService.addAdjustment(adjustmentData);
    dispatch({ type: ADJUSTMENT_ADD_SUCCESS, payload: data });
    
    
  } catch (error) {
    dispatch({
      type: ADJUSTMENT_ADD_FAIL,
      payload: error?.response?.data || error.message,
    });
  }
  dispatch(listAdjustments()); // Refresh the list after adding
};
