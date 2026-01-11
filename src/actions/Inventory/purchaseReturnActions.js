// actions/admin/purchaseActions.js
import {
  FETCH_PURCHASE_RETURN_REQUEST,
  FETCH_PURCHASE_RETURN_SUCCESS,
  FETCH_PURCHASE_RETURN_FAIL,
  ADD_PURCHASE_RETURN_REQUEST,
  ADD_PURCHASE_RETURN_SUCCESS,
  ADD_PURCHASE_RETURN_FAIL,
} from "../../constants/Inventory/purchaseReturnConstants";

import purchaseReturnService from "../../services/Inventory/purchaseReturnService";

export const listPurchaseReturnOrders = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PURCHASE_RETURN_REQUEST });

    const orders = await purchaseReturnService.getAll();  



    dispatch({
      type: FETCH_PURCHASE_RETURN_SUCCESS,
      payload: orders,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PURCHASE_RETURN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Add PRN (mapped to purchase constants)
// export const addPrn = (prnData) => async (dispatch) => {
//   dispatch({ type: ADD_PURCHASE_RETURN_REQUEST });
//   try {
//     const response = await purchaseReturnService.addPrn(prnData);


//     dispatch({
//       type: ADD_PURCHASE_RETURN_SUCCESS,
//       payload: response,
//     });


//     dispatch(listPurchaseOrders());
//   } catch (error) {
//     dispatch({
//       type: ADD_PURCHASE_RETURN_FAIL,
//       payload:
//         error.response?.data?.message || error.message || "Failed to add PRN",
//     });
//   }
// };

export const addPrn = (prnData) => async (dispatch) => {
  dispatch({ type: ADD_PURCHASE_RETURN_REQUEST });
  try {
    const response = await purchaseReturnService.addPrn(prnData);

    dispatch({
      type: ADD_PURCHASE_RETURN_SUCCESS,
      payload: response,
    });

    // Optionally refresh list
  dispatch(listPurchaseReturnOrders());
  } catch (error) {
    dispatch({
      type: ADD_PURCHASE_RETURN_FAIL,
      payload:
        error.response?.data?.message || error.message || "Failed to add PRN",
    });
  }
};