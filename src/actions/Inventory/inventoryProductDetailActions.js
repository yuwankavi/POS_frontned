import {
  FETCH_PRODUCT_DETAILS_REQUEST,
  FETCH_PRODUCT_DETAILS_SUCCESS,
  FETCH_PRODUCT_DETAILS_FAIL,
  ADD_PRODUCT_DETAILS_REQUEST,
  ADD_PRODUCT_DETAILS_SUCCESS,
  ADD_PRODUCT_DETAILS_FAIL,
  FETCH_ACTIVE_PRODUCT_DETAILS_REQUEST,
  FETCH_ACTIVE_PRODUCT_DETAILS_SUCCESS,
  FETCH_ACTIVE_PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../../constants/Inventory/inventoryProductDetailsConstant.js";

import ProductDetailsService from "../../services/Inventory/inventoryProductDetailsService.js";


export const addProductDetail = (detail) => async (dispatch) => {
  // dispatch({ type: ADD_PRODUCT_DETAILS_REQUEST });
  try {
    dispatch({ type: ADD_PRODUCT_DETAILS_REQUEST });
    const data = await ProductDetailsService.addProductDetails(detail);
    dispatch({ type: ADD_PRODUCT_DETAILS_SUCCESS, payload: data });
    dispatch(listProductDetails()); // refresh list after adding
  } catch (error) {
    dispatch({
      type: ADD_PRODUCT_DETAILS_FAIL,
      payload: error.message || "Failed to add product detail",
    });
    throw error; // ✅ rethrow so modal can catch
  }
};

export const listProductDetails = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PRODUCT_DETAILS_REQUEST });

    const data = await ProductDetailsService.getAll();

    dispatch({
      type: FETCH_PRODUCT_DETAILS_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCT_DETAILS_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load product details",
    });
  }
};

export const listActiveProductDetails = (P_PROCODE) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ACTIVE_PRODUCT_DETAILS_REQUEST });

    const data = await ProductDetailsService.getActivePD(P_PROCODE);


    dispatch({
      type: FETCH_ACTIVE_PRODUCT_DETAILS_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ACTIVE_PRODUCT_DETAILS_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load active product details",
    });
  }
};


export const fetchActiveProductDetails = (PPROCODE) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const data = await ProductDetailsService.getProductById(PPROCODE);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// actions/admin/inventoryProductDetailActions.js







// import {
//   ADD_PRODUCT_DETAILS_REQUEST,
//   ADD_PRODUCT_DETAILS_SUCCESS,
//   ADD_PRODUCT_DETAILS_FAIL,
//   FETCH_PRODUCT_DETAILS_REQUEST,
//   FETCH_PRODUCT_DETAILS_SUCCESS,
//   FETCH_PRODUCT_DETAILS_FAIL,
// } from "../../constants/admin/inventoryProductDetailsConstant.js";
// import ProductDetailsService from "../../services/admin/inventoryProductDetailsService.js";

// // Fetch all product details
// export const listProductDetails = () => async (dispatch) => {
//   try {
//     dispatch({ type: FETCH_PRODUCT_DETAILS_REQUEST });

//     const data = await ProductDetailsService.getAll();

//     dispatch({
//       type: FETCH_PRODUCT_DETAILS_SUCCESS,
//       payload: Array.isArray(data) ? data : [],
//     });
//   } catch (error) {
//     dispatch({
//       type: FETCH_PRODUCT_DETAILS_FAIL,
//       payload: error.message || "Failed to fetch product details",
//     });
//   }
// };

// // Add a new product detail and refresh list
// export const addProductDetail = (detail) => async (dispatch) => {
//   try {
//     dispatch({ type: ADD_PRODUCT_DETAILS_REQUEST });

//     // Call the API to add the new product detail
//     await ProductDetailsService.addProductDetails(detail);

//     dispatch({
//       type: ADD_PRODUCT_DETAILS_SUCCESS,
//       payload: detail, // optional, not critical if re-fetching
//     });

//     // ✅ Re-fetch all details to update the table
//     dispatch(listProductDetails());
//   } catch (error) {
//     dispatch({
//       type: ADD_PRODUCT_DETAILS_FAIL,
//       payload: error.message || "Failed to add product detail",
//     });
//   }
// };