import {
  FETCH_SALESRETURN_REQUEST,
  FETCH_SALESRETURN_SUCCESS,
  FETCH_SALESRETURN_FAIL,
  ADD_SALESRETURN_REQUEST,
  ADD_SALESRETURN_SUCCESS,
  ADD_SALESRETURN_FAIL,
  UPDATE_SALESRETURN_STATUS_REQUEST,
  UPDATE_SALESRETURN_STATUS_SUCCESS,
  UPDATE_SALESRETURN_STATUS_FAIL,
} from "../../constants/Inventory/salesReturnConstant.js";

import salesReturnService from "../../services/Inventory/salesReturnService.js";


// Fetch all sales returns
export const listSalesReturns = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SALESRETURN_REQUEST });

    const returns = await salesReturnService.getAll();



    dispatch({
      type: FETCH_SALESRETURN_SUCCESS,
      payload: returns,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SALESRETURN_FAIL,
      payload:
        error.response?.data?.message || error.message || "Failed to fetch",
    });
  }
};