import {
  FETCH_CUSTOMER_REQUEST,
  FETCH_CUSTOMER_SUCCESS,
  FETCH_CUSTOMER_FAIL,
  CUSTOMER_ADD_REQUEST,
  CUSTOMER_ADD_SUCCESS,
  CUSTOMER_ADD_FAIL,
  FETCH_BY_PHONE_NUMBER_CUSTOMER_REQUEST,
  FETCH_BY_PHONE_NUMBER_CUSTOMER_SUCCESS,
  FETCH_BY_PHONE_NUMBER_CUSTOMER_FAIL,
  UPDATE_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
} from "../constants/customer.js";

import customerService from "../services/customerService.js";

export const addCustomer = (customer) => async (dispatch) => {
  dispatch({ type: CUSTOMER_ADD_REQUEST });
  try {
    const data = await customerService.addCustomer(customer);
    dispatch({ type: CUSTOMER_ADD_SUCCESS, payload: data });
    dispatch(listCustomers()); // refresh list after adding
  } catch (error) {
    dispatch({
      type: CUSTOMER_ADD_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to add customer",
    });
    throw error
    
  }
};

export const listCustomers = () => async (dispatch, getState) => {
  const {customerList} = getState();
  if (customerList.loading)  return;
  try {
    dispatch({ type: FETCH_CUSTOMER_REQUEST });
    const data = await customerService.getAll();
    dispatch({
      type: FETCH_CUSTOMER_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CUSTOMER_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load customers",
    });
    
  }
};

export const getCustomerByPhoneNumber = (phoneNumber) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BY_PHONE_NUMBER_CUSTOMER_REQUEST });
    const data = await customerService.getCustomerByPhoneNumber(phoneNumber);
    dispatch({
      type: FETCH_BY_PHONE_NUMBER_CUSTOMER_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BY_PHONE_NUMBER_CUSTOMER_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load customer",
    });
    ;
  }
};

export const updateCustomerAction = (customer) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CUSTOMER_REQUEST });

    const data = await customerService.updateCustomer(customer);

    dispatch({
      type: UPDATE_CUSTOMER_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CUSTOMER_FAIL,
      payload: error.response?.data?.message || error.message || "Failed to load customer",
    });
    throw error
  }
};