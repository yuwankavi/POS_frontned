import {
  FETCH_UNIT_ACTIVE_REQUEST,
  FETCH_UNIT_ACTIVE_SUCCESS,
  FETCH_UNIT_ACTIVE_FAIL,
  FETCH_UNIT_INACTIVE_REQUEST,
  FETCH_UNIT_INACTIVE_SUCCESS,
  FETCH_UNIT_INACTIVE_FAIL,
  UNIT_ADD_REQUEST,
  UNIT_ADD_SUCCESS,
  UNIT_ADD_FAIL,
  UNIT_UPDATE_REQUEST,
  UNIT_UPDATE_SUCCESS,
  UNIT_UPDATE_FAIL,
  FETCH_BY_ID_UNIT_REQUEST,
  FETCH_BY_ID_UNIT_SUCCESS,
  FETCH_BY_ID_UNIT_FAIL,
} from "../../constants/Inventory/unitConstant.js";

import unitService from "../../services/Inventory/unitServices.js";

 
export const addUnit = (unit) => async (dispatch) => {
  try {
    dispatch({ type: UNIT_ADD_REQUEST });
    const data = await unitService.addUnit(unit);
    dispatch({ type: UNIT_ADD_SUCCESS, payload: data });

     
    dispatch(listUnitsActive());
    dispatch(listUnitsInactive());
  } catch (error) {
    dispatch({
      type: UNIT_ADD_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to add unit",
    });
  }
};
 
export const listUnitsActive = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_UNIT_ACTIVE_REQUEST });
    const data = await unitService.getAllActive();
    dispatch({
      type: FETCH_UNIT_ACTIVE_SUCCESS,
      payload: data.ResultSet || [],
    });
  } catch (error) {
    dispatch({
      type: FETCH_UNIT_ACTIVE_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load active units",
    });
  }
};

 
export const listUnitsInactive = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_UNIT_INACTIVE_REQUEST });
    const data = await unitService.getAllInactive();
    dispatch({
      type: FETCH_UNIT_INACTIVE_SUCCESS,
      payload: data.ResultSet || [],
    });
  } catch (error) {
    dispatch({
      type: FETCH_UNIT_INACTIVE_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load inactive units",
    });
  }
};

 
export const updateUnitStatus = (P_UNCODE, status) => async (dispatch) => {
  try {
    dispatch({ type: UNIT_UPDATE_REQUEST });

    const result = await unitService.updateStatus(P_UNCODE, status);

    const payload = result?.ResultSet?.[0] || { P_UNCODE, P_STATUS: status };

    dispatch({
      type: UNIT_UPDATE_SUCCESS,
      payload,
    });

     
    dispatch(listUnitsActive());
    dispatch(listUnitsInactive());
  } catch (error) {
    dispatch({
      type: UNIT_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to update unit status",
    });
  }
};

 
export const getUnitById = (P_UNCODE) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BY_ID_UNIT_REQUEST });
    const data = await unitService.getById(P_UNCODE);
    dispatch({
      type: FETCH_BY_ID_UNIT_SUCCESS,
      payload: data.ResultSet?.[0] || data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BY_ID_UNIT_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to fetch unit by ID",
    });
  }
};
