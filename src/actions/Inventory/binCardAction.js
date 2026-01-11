import {
  BinCard_MAXLINE_REQUEST,
  BinCard_MAXLINE_SUCCESS,
  BinCard_MAXLINE_FAIL,
  BinCard_BYLINE_REQUEST,
  BinCard_BYLINE_SUCCESS,
  BinCard_BYLINE_FAIL,
  BinCard_TRANSACTION_REQUEST,
  BinCard_TRANSACTION_SUCCESS,
  BinCard_TRANSACTION_FAIL,
} from "../../constants/Inventory/binCardConstants";

import binCardService from "../../services/Inventory/bincardService";

// Get Max Line
export const listGetMaxLine = () => async (dispatch) => {
  try {
    dispatch({ type: BinCard_MAXLINE_REQUEST });
    const data = await binCardService.getMaxLine();

    // Ensure it's always an array
    const safeData = Array.isArray(data) ? data : data?.ResultSet || [];

    dispatch({ type: BinCard_MAXLINE_SUCCESS, payload: safeData });
  } catch (error) {
    dispatch({
      type: BinCard_MAXLINE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


// Get By Line
export const listGetByLine =
  (BIN_WHCode, BIN_ProCode, DOCNo,BIN_DOCType) => async (dispatch) => {
    try {
      dispatch({ type: BinCard_BYLINE_REQUEST });
      const data = await binCardService.getByLine(
        BIN_WHCode,
        BIN_ProCode,
        DOCNo,
        BIN_DOCType
      );

      // Extract ResultSet array safely
      const safeData = Array.isArray(data)
        ? data
        : data?.ResultSet || (data ? [data] : []);

      dispatch({ type: BinCard_BYLINE_SUCCESS, payload: safeData });
    } catch (error) {
      dispatch({
        type: BinCard_BYLINE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Get Transactions
export const listGetTransaction = (whCode, proCode) => async (dispatch) => {
  try {
    dispatch({ type: BinCard_TRANSACTION_REQUEST });
    const data = await binCardService.getTransaction(whCode, proCode);

    // Always return an array
    const safeData = Array.isArray(data)
      ? data
      : data?.ResultSet || (data ? [data] : []);

    dispatch({ type: BinCard_TRANSACTION_SUCCESS, payload: safeData });
  } catch (error) {
    dispatch({
      type: BinCard_TRANSACTION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

