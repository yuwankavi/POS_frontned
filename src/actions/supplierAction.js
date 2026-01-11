 import {
  FETCH_SUPPLIER_REQUEST,
  FETCH_SUPPLIER_SUCCESS,
  FETCH_SUPPLIER_FAIL,
  SUPPLIER_ADD_REQUEST,
  SUPPLIER_ADD_SUCCESS,
  SUPPLIER_ADD_FAIL,
  SUPPLIER_UPDATE_REQUEST,
  SUPPLIER_UPDATE_SUCCESS,
  SUPPLIER_UPDATE_FAIL,
  FETCH_BY_ID_SUPPLIER_REQUEST,
  FETCH_BY_ID_SUPPLIER_SUCCESS,
  FETCH_BY_ID_SUPPLIER_FAIL,
  SUPPLIER_REQUEST, SUPPLIER_SUCCESS, SUPPLIER_FAIL,
} from "../constants/supplier.js";
import supplierService from "../services/supplierService.js";

 
export const addSupplier = (supplier) => async (dispatch) => {
  dispatch({ type: SUPPLIER_ADD_REQUEST });
  try {
    const data = await supplierService.addSupplier(supplier);
    dispatch({ type: SUPPLIER_ADD_SUCCESS, payload: data });
    dispatch(listSupplier());  
  } catch (error) {
    dispatch({
      type: SUPPLIER_ADD_FAIL,
      payload: error.message || "Failed to add supplier",
    });
  }
};

export const listSupplier = () => async (dispatch, getState) => {
  const { supplierList } = getState();
  if (supplierList.loading) return;
  try {
    dispatch({ type: FETCH_SUPPLIER_REQUEST });
    const data = await supplierService.getAll();
    dispatch({
      type: FETCH_SUPPLIER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SUPPLIER_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load suppliers",
    });
  }
};
export const listSupplierById = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BY_ID_SUPPLIER_REQUEST });
    const data = await supplierService.getSupplierById(id);
    dispatch({
      type: FETCH_BY_ID_SUPPLIER_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BY_ID_SUPPLIER_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load supplier",
    });
  }
};
export const updateSupplierStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: SUPPLIER_UPDATE_REQUEST });
    const data = await supplierService.updateSupplierStatus(id, status);
    dispatch({ type: SUPPLIER_UPDATE_SUCCESS, payload: data });
    dispatch(listSupplier());
  } catch (error) {
    dispatch({
      type: SUPPLIER_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to update supplier",
    });
  }

};

