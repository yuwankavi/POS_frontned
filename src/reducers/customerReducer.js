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

export const customerListReducer = (
  state = { customers: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case FETCH_CUSTOMER_REQUEST:
      return { loading: true, customers: [] };
    case FETCH_CUSTOMER_SUCCESS:
      return { loading: false, customers: action.payload };
    case FETCH_CUSTOMER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const customerAddReducer = (
  state = { loadingAdd: false, success: false, errorAdd: null },
  action
) => {
  switch (action.type) {
    case CUSTOMER_ADD_REQUEST:
      return { loading: true };
    case CUSTOMER_ADD_SUCCESS:
      return { loading: false, success: true, customer: action.payload };
    case CUSTOMER_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const customerDetailsByPhoneReducer = (
  state = { customer: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case FETCH_BY_PHONE_NUMBER_CUSTOMER_REQUEST:
      return { loading: true, ...state };
    case FETCH_BY_PHONE_NUMBER_CUSTOMER_SUCCESS:
      return { loading: false, customer: action.payload };
    case FETCH_BY_PHONE_NUMBER_CUSTOMER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const customerUpdateReducer = (state =  {loading: false,customer: null,error: null,}, action) => {
  switch (action.type) {
    case UPDATE_CUSTOMER_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_CUSTOMER_SUCCESS:
      return { ...state, loading: false, customer: action.payload };
    case UPDATE_CUSTOMER_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};