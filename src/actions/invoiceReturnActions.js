// src/actions/invoiceReturnActions.js
import {
  INVOICE_RETURN_FETCH_REQUEST,
  INVOICE_RETURN_FETCH_SUCCESS,
  INVOICE_RETURN_FETCH_FAIL,
  INVOICE_RETURN_PRINT_REQUEST,
  INVOICE_RETURN_PRINT_SUCCESS,
  INVOICE_RETURN_PRINT_FAIL,
  INVOICE_RETURN_LOAD_RETURNS_REQUEST,
  INVOICE_RETURN_LOAD_RETURNS_SUCCESS,
  INVOICE_RETURN_LOAD_RETURNS_FAIL,
  INVOICE_RETURN_SET_INVOICE,
  INVOICE_RETURN_RESET,
  INVOICE_RETURN_CLEAR_ERROR
} from '../constants/invoiceReturnConstants';
import { invoiceReturnService } from '../services/invoiceReturnService';

// Load all sales returns from API
export const loadSalesReturns = () => async (dispatch) => {
  try {
    dispatch({ type: INVOICE_RETURN_LOAD_RETURNS_REQUEST });

    const response = await invoiceReturnService.getAllSalesReturns();
    
    dispatch({
      type: INVOICE_RETURN_LOAD_RETURNS_SUCCESS,
      payload: response.ResultSet || []
    });

    return response.ResultSet || [];
  } catch (error) {
    dispatch({
      type: INVOICE_RETURN_LOAD_RETURNS_FAIL,
      payload: error.response?.data?.message || error.message || 'Failed to load sales returns'
    });
    throw error;
  }
};

// Fetch Complete Invoice Details
export const fetchInvoiceDetails = (invoiceNumber) => async (dispatch) => {
  try {
    dispatch({ type: INVOICE_RETURN_FETCH_REQUEST });

    const completeInvoiceData = await invoiceReturnService.getInvoiceDetails(invoiceNumber);
    
    dispatch({
      type: INVOICE_RETURN_FETCH_SUCCESS,
      payload: completeInvoiceData
    });

    // Also set the invoice data
    dispatch(setInvoiceData(completeInvoiceData));

    return completeInvoiceData;
  } catch (error) {
    dispatch({
      type: INVOICE_RETURN_FETCH_FAIL,
      payload: error.response?.data?.message || error.message || 'Failed to fetch invoice details'
    });
    throw error;
  }
};

// Print Invoice
export const printInvoiceForReturn = (invoiceData) => async (dispatch) => {
  try {
    dispatch({ type: INVOICE_RETURN_PRINT_REQUEST });

    const result = await invoiceReturnService.printInvoice(invoiceData);
    
    dispatch({
      type: INVOICE_RETURN_PRINT_SUCCESS,
      payload: result
    });

    return result;
  } catch (error) {
    dispatch({
      type: INVOICE_RETURN_PRINT_FAIL,
      payload: error.response?.data?.message || error.message || 'Failed to print invoice'
    });
    throw error;
  }
};

// Set Invoice Data
export const setInvoiceData = (invoiceData) => (dispatch) => {
  dispatch({
    type: INVOICE_RETURN_SET_INVOICE,
    payload: invoiceData
  });
};

// Clear Errors
export const clearInvoiceReturnErrors = () => (dispatch) => {
  dispatch({ type: INVOICE_RETURN_CLEAR_ERROR });
};

// Reset State
export const resetInvoiceReturn = () => (dispatch) => {
  dispatch({ type: INVOICE_RETURN_RESET });
};