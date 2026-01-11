import {
  FETCH_INVENTORY_PRODUCT_REQUEST,
  FETCH_INVENTORY_PRODUCT_SUCCESS,
  FETCH_INVENTORY_PRODUCT_FAIL,
  ADD_INVENTORY_PRODUCT_REQUEST,
  ADD_INVENTORY_PRODUCT_SUCCESS,
  ADD_INVENTORY_PRODUCT_FAIL,
  FETCH_INVENTORY_PRODUCT_ID_REQUEST,
  FETCH_INVENTORY_PRODUCT_ID_SUCCESS,
  FETCH_INVENTORY_PRODUCT_ID_FAIL,
  FETCH_INVENTORY_PRODUCT_STATUS_REQUEST,
  FETCH_INVENTORY_PRODUCT_STATUS_SUCCESS,
  FETCH_INVENTORY_PRODUCT_STATUS_FAIL,
  PRODUCT_ACTIVE_REQUEST,
  PRODUCT_ACTIVE_SUCCESS,
  PRODUCT_ACTIVE_FAIL,
  PRODUCT_INACTIVE_REQUEST,
  PRODUCT_INACTIVE_SUCCESS,
  PRODUCT_INACTIVE_FAIL,
  //update
   PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,  // ✅ make sure this is here
  PRODUCT_UPDATE_RESET,
//yasas

PRODUCT_CAT_REQUEST,
  PRODUCT_CAT_SUCCESS,
  PRODUCT_CAT_FAIL,

} from "../../constants/Inventory/InventoryProductConstant.js";

import InventoryProductService from "../../services/Inventory/InventoryProductServices.js";

// Action: Add Inventory Product
// export const addInventoryProduct = (inventoryProducts) => async (dispatch) => {
//   dispatch({ type: ADD_INVENTORY_PRODUCT_REQUEST });
//   try {
//     const data = await InventoryProductService.addInventoryProduct(
//       inventoryProducts
//     );
//     dispatch({ type: ADD_INVENTORY_PRODUCT_SUCCESS, payload: data });
//     dispatch(listInventoryProductsByStatus("A")); // refresh list after adding
//   } catch (error) {
//     dispatch({
//       type: ADD_INVENTORY_PRODUCT_FAIL,
//       payload: error.message || "Failed to add inventory product",
//     });
//     throw error; // ✅ rethrow so modal can catch
//   }
// };



export const addInventoryProduct = (inventoryProducts, file) => async (dispatch) => {
  dispatch({ type: ADD_INVENTORY_PRODUCT_REQUEST });
  try {
    const data = await InventoryProductService.addInventoryProduct(
      inventoryProducts,
      file
    );
    dispatch({ type: ADD_INVENTORY_PRODUCT_SUCCESS, payload: data });
    dispatch(listInventoryProductsByStatus("A"));  
  } catch (error) {
    dispatch({
      type: ADD_INVENTORY_PRODUCT_FAIL,
      payload: error.message || "Failed to add inventory product",
    });
    throw error;
  }
};


export const listInventoryProducts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_INVENTORY_PRODUCT_REQUEST });

    const data = await InventoryProductService.getAll();


    dispatch({
      type: FETCH_INVENTORY_PRODUCT_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_INVENTORY_PRODUCT_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load inventory products",
    });
  }
};


//list by id
export const listInventoryProductsById = (P_CODE) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_INVENTORY_PRODUCT_ID_REQUEST });
    const data = await InventoryProductService.getById(P_CODE);
    dispatch({ type: FETCH_INVENTORY_PRODUCT_ID_SUCCESS, payload: data.ResultSet });

  } catch (error) {
    dispatch({
      type: FETCH_INVENTORY_PRODUCT_ID_FAIL,
      payload:
        error.message?.data?.message ||
        error.message ||
        "Failed to load inventory product",
    });
  }
};

//list by status
export const listInventoryProductsByStatus = (P_STATUS) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_INVENTORY_PRODUCT_STATUS_REQUEST });
    const data = await InventoryProductService.getByStatus(P_STATUS);

    dispatch({ type: FETCH_INVENTORY_PRODUCT_STATUS_SUCCESS, payload: data.ResultSet });
  } catch (error) {
    dispatch({
      type: FETCH_INVENTORY_PRODUCT_STATUS_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load inventory product",
    });
  }
};

export const listActiveProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_ACTIVE_REQUEST });

    const data = await InventoryProductService.getActiveStatus();

    dispatch({
      type: PRODUCT_ACTIVE_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_ACTIVE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get Inactive Products
export const listInactiveProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_INACTIVE_REQUEST });

    const data = await InventoryProductService.getInactiveStatus();

    dispatch({
      type: PRODUCT_INACTIVE_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_INACTIVE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProductStatus = (PC_Code, newStatus) => async (dispatch) => {
  try {
    await InventoryProductService.updateStatus(PC_Code, newStatus);

    if(newStatus === "I"){
      dispatch(listInventoryProductsByStatus("A"));
    }
    else{
       dispatch(listInventoryProductsByStatus("I"));
    }
  } catch (error) {

  }
};
//update product catalogue
// export const updateProduct = (productId, updatedData) => async (dispatch) => {
//   try {
//     dispatch({ type: PRODUCT_UPDATE_REQUEST });

//     await InventoryProductService.updateProductCatalogue(productId, updatedData);

//     dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({
//       type: PRODUCT_UPDATE_FAIL,
//       payload:
//         error.response?.data?.message || error.message || "Update failed",
//     });
//   }
// };




//YASAS

// actions/inventoryProductActions.js
export const updateProduct = (productId, updatedData, file) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST });

    const data = await InventoryProductService.updateProductCatalogue(
      { P_PROCODE: productId, ...updatedData },
      file
    );

    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    dispatch(listInventoryProductsByStatus("A")); // Refresh list after update
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,  // ✅ correct reference
      payload: error.response?.data?.message || error.message || "Update failed",
    });
  }
};


///yasas 

export const getProductCatById = (productCode) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_CAT_REQUEST });

    const data = await InventoryProductService.getProductCatById(productCode);

    dispatch({ type: PRODUCT_CAT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_CAT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
