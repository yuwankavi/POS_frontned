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
} from "../constants/supplier.js";


export const supplierListReducer = (state = { suppliers: [] }, action) => {
  switch (action.type) {
    case FETCH_SUPPLIER_REQUEST:
      return { loading: true, suppliers: [] };
    case FETCH_SUPPLIER_SUCCESS:
      return { loading: false, suppliers: action.payload };
    case FETCH_SUPPLIER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const supplierAddReducer = (state = {}, action) => {
  switch (action.type) {
    case SUPPLIER_ADD_REQUEST:
      return { loading: true };
    case SUPPLIER_ADD_SUCCESS:
      return { loading: false, success: true, supplier: action.payload };
    case SUPPLIER_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const supplierDetailsReducer = (state = { supplier: {} }, action) => {
  switch (action.type) {
    case FETCH_BY_ID_SUPPLIER_REQUEST:
      return { loading: true, ...state };
    case FETCH_BY_ID_SUPPLIER_SUCCESS:
      return { loading: false, supplier: action.payload };
    case FETCH_BY_ID_SUPPLIER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const supplierUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SUPPLIER_UPDATE_REQUEST:
      return { loading: true };
    case SUPPLIER_UPDATE_SUCCESS:
      return { loading: false, success: true, supplier: action.payload };
    case SUPPLIER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
