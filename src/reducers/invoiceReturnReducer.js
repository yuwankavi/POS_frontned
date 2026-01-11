// src/reducers/invoiceReturnReducer.js
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

const initialState = {
  loading: false,
  error: null,
  success: false,
  
  // Complete invoice data
  invoiceData: null,
  isInvoiceLoaded: false,
  
  // Sales returns list
  salesReturns: [],
  returnsLoading: false,
  returnsError: null,
  
  // Print state
  printLoading: false,
  printError: null,
  printSuccess: false
};

export const invoiceReturnReducer = (state = initialState, action) => {
  switch (action.type) {
    // Load sales returns
    case INVOICE_RETURN_LOAD_RETURNS_REQUEST:
      return {
        ...state,
        returnsLoading: true,
        returnsError: null
      };

    case INVOICE_RETURN_LOAD_RETURNS_SUCCESS:
      return {
        ...state,
        returnsLoading: false,
        salesReturns: action.payload,
        returnsError: null
      };

    case INVOICE_RETURN_LOAD_RETURNS_FAIL:
      return {
        ...state,
        returnsLoading: false,
        returnsError: action.payload,
        salesReturns: []
      };

    // Fetch invoice details
    case INVOICE_RETURN_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        isInvoiceLoaded: false
      };

    case INVOICE_RETURN_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        invoiceData: action.payload,
        isInvoiceLoaded: true,
        error: null
      };

    case INVOICE_RETURN_FETCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        invoiceData: null,
        isInvoiceLoaded: false
      };

    // Print invoice
    case INVOICE_RETURN_PRINT_REQUEST:
      return {
        ...state,
        printLoading: true,
        printError: null,
        printSuccess: false
      };

    case INVOICE_RETURN_PRINT_SUCCESS:
      return {
        ...state,
        printLoading: false,
        printSuccess: true,
        printError: null
      };

    case INVOICE_RETURN_PRINT_FAIL:
      return {
        ...state,
        printLoading: false,
        printError: action.payload,
        printSuccess: false
      };

    // Set invoice data
    case INVOICE_RETURN_SET_INVOICE:
      return {
        ...state,
        invoiceData: action.payload,
        isInvoiceLoaded: true
      };

    // Reset state
    case INVOICE_RETURN_RESET:
      return {
        ...initialState,
        salesReturns: state.salesReturns // Keep sales returns on reset
      };

    // Clear errors
    case INVOICE_RETURN_CLEAR_ERROR:
      return {
        ...state,
        error: null,
        printError: null,
        returnsError: null
      };

    default:
      return state;
  }
};