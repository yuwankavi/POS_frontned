import {
  FETCH_INVOICE_REQUEST,
  FETCH_INVOICE_SUCCESS,
  FETCH_INVOICE_FAILURE,
} from "../constants/dailySummary";

import dailySummaryervice from "../services/dailySummaryService";

export const fetchDailySummaryByDate = (StartDate,endDate) => async (dispatch) => {
  dispatch({ type: FETCH_INVOICE_REQUEST });
  try {
    
    const data = await dailySummaryervice.getDailySummaryByDate(StartDate,endDate);
    

    dispatch({
      type: FETCH_INVOICE_SUCCESS,
      payload: data.ResultSet,
    });

  } catch (error) {
    dispatch({
      type: FETCH_INVOICE_FAILURE,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch invoice",
    });
  }
};
