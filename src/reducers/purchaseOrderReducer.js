import {
  PO_LIST_REQUEST,
  PO_LIST_SUCCESS,
  PO_LIST_FAIL,
  PO_BY_ID_REQUEST,
  PO_BY_ID_SUCCESS,
  PO_BY_ID_FAIL,
  PO_BY_SUPPLIER_REQUEST,
  PO_BY_SUPPLIER_SUCCESS,
  PO_BY_SUPPLIER_FAIL,
  PO_CREATE_REQUEST,
  PO_CREATE_SUCCESS,
  PO_CREATE_FAIL,
  PO_CREATE_RESET,
  PO_UPDATE_REQUEST,
  PO_UPDATE_SUCCESS,
  PO_UPDATE_FAIL,
  PO_UPDATE_RESET,
  PO_CLEAR_SELECTED,
} from "../constants/purchaseOrderConstants";

// Purchase Order List Reducer
export const poListReducer = (
  state = { loading: false, purchaseOrders: [], error: null },
  action
) => {
  switch (action.type) {
    case PO_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case PO_LIST_SUCCESS:
      return { loading: false, purchaseOrders: action.payload, error: null };
    case PO_LIST_FAIL:
      return { loading: false, purchaseOrders: [], error: action.payload };
    default:
      return state;
  }
};

// Purchase Order by ID Reducer
export const poDetailsReducer = (
  state = { loading: false, purchaseOrder: null, error: null },
  action
) => {
  switch (action.type) {
    case PO_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case PO_BY_ID_SUCCESS:
      return { loading: false, purchaseOrder: action.payload, error: null };
    case PO_BY_ID_FAIL:
      return { loading: false, purchaseOrder: null, error: action.payload };
    case PO_CLEAR_SELECTED:
      return { loading: false, purchaseOrder: null, error: null };
    default:
      return state;
  }
};

// Purchase Orders by Supplier Reducer
export const poBySupplierReducer = (
  state = { loading: false, purchaseOrders: [], error: null },
  action
) => {
  switch (action.type) {
    case PO_BY_SUPPLIER_REQUEST:
      return { ...state, loading: true, error: null };
    case PO_BY_SUPPLIER_SUCCESS:
      return { loading: false, purchaseOrders: action.payload, error: null };
    case PO_BY_SUPPLIER_FAIL:
      return { loading: false, purchaseOrders: [], error: action.payload };
    default:
      return state;
  }
};

// Purchase Order Create Reducer
export const poCreateReducer = (
  state = { loading: false, success: false, purchaseOrder: null, error: null },
  action
) => {
  switch (action.type) {
    case PO_CREATE_REQUEST:
      return { loading: true, success: false, purchaseOrder: null, error: null };
    case PO_CREATE_SUCCESS:
      return { loading: false, success: true, purchaseOrder: action.payload, error: null };
    case PO_CREATE_FAIL:
      return { loading: false, success: false, purchaseOrder: null, error: action.payload };
    case PO_CREATE_RESET:
      return { loading: false, success: false, purchaseOrder: null, error: null };
    default:
      return state;
  }
};

// Purchase Order Update Reducer
export const poUpdateReducer = (
  state = { loading: false, success: false, error: null },
  action
) => {
  switch (action.type) {
    case PO_UPDATE_REQUEST:
      return { loading: true, success: false, error: null };
    case PO_UPDATE_SUCCESS:
      return { loading: false, success: true, error: null };
    case PO_UPDATE_FAIL:
      return { loading: false, success: false, error: action.payload };
    case PO_UPDATE_RESET:
      return { loading: false, success: false, error: null };
    default:
      return state;
  }
};
