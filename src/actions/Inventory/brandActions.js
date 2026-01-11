import {
  FETCH_BRAND_REQUEST,
  FETCH_BRAND_SUCCESS,
  FETCH_BRAND_FAIL,
  ADD_BRAND_REQUEST,
  ADD_BRAND_SUCCESS,
  ADD_BRAND_FAIL,
  FETCH_BRAND_ID_REQUEST,
  FETCH_BRAND_ID_SUCCESS,
  FETCH_BRAND_ID_FAIL,
  FETCH_BRAND_STATUS_REQUEST,
  FETCH_BRAND_STATUS_SUCCESS,
  FETCH_BRAND_STATUS_FAIL,
  BRAND_ACTIVE_REQUEST,
  BRAND_ACTIVE_SUCCESS,
  BRAND_ACTIVE_FAIL,
  BRAND_INACTIVE_REQUEST,
  BRAND_INACTIVE_SUCCESS,
  BRAND_INACTIVE_FAIL,
  UPDATE_BRAND_REQUEST,
  UPDATE_BRAND_SUCCESS,
  UPDATE_BRAND_FAIL,
} from "../../constants/Inventory/brandConstant.js";

import brandService from "../../services/Inventory/brandService.js";

// Action: Add Brand
export const addBrand = (brand) => async (dispatch) => {
  dispatch({ type: ADD_BRAND_REQUEST });
  try {
    const data = await brandService.addBrand(brand);
    dispatch({ type: ADD_BRAND_SUCCESS, payload: data });
    dispatch(getBrandbyStatus("A")); // refresh list after adding
  } catch (error) {
    dispatch({
      type: ADD_BRAND_FAIL,
      payload: error.message || "Failed to add brand",
    });
  }
};

export const listBrands = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BRAND_REQUEST });

    const data = await brandService.getAll();

    dispatch({
      type: FETCH_BRAND_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BRAND_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load brands",
    });
  }
};

//list by id
export const getBrandbyID = (P_BRID) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BRAND_ID_REQUEST });

    const data = await brandService.getBrandbyID(P_BRID);
    dispatch({
      type: FETCH_BRAND_ID_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BRAND_ID_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load brand by ID",
    });
  }
};

//list by status
export const getBrandbyStatus = (P_STATUS) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BRAND_STATUS_REQUEST });

    const data = await brandService.getBrandbyStatus(P_STATUS);
    const result = data.ResultSet;
    dispatch({
      type: FETCH_BRAND_STATUS_SUCCESS,
      payload: result,
    });

  } catch (error) {
    dispatch({
      type: FETCH_BRAND_STATUS_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load brand by status",
    });
  }
  
};

//brand active
export const brandActive = () => async (dispatch) => {
  try {
    dispatch({ type: BRAND_ACTIVE_REQUEST });
    const data = await brandService.brandActive();

    dispatch({
      type: BRAND_ACTIVE_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: BRAND_ACTIVE_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load active brands",
    });
  }
};

//brand inactive
export const brandInactive = () => async (dispatch) => {
  try {
    dispatch({ type: BRAND_INACTIVE_REQUEST });

    const data = await brandService.brandInactive();
    dispatch({
      type: BRAND_INACTIVE_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: BRAND_INACTIVE_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load inactive brands",
    });
  }
};

// Update brand status
export const updateBrand = (P_BRID,P_STATUS, currentFilter) => async (dispatch) => { 
  try {
    dispatch({ type: UPDATE_BRAND_REQUEST });

    const data = await brandService.updateBrand(P_BRID,P_STATUS);

    dispatch({
      type: UPDATE_BRAND_SUCCESS,
      payload: {P_BID: P_BRID, P_STATUS },
    });

    // Refresh active/inactive brands after update
    // dispatch(brandActive());
    // dispatch(brandInactive());

    // dispatch(getBrandbyStatus(P_STATUS));

    if(currentFilter === "active"){
      dispatch(getBrandbyStatus("A"));
    }else if(currentFilter === "inactive"){
      dispatch(getBrandbyStatus("I"));
    } else {
      dispatch(listBrands());
    }

  } catch (error) {
    dispatch({
      type: UPDATE_BRAND_FAIL,
      payload: error.message || "Failed to update brand",
    });
  }
};