import {
  FETCH_INVOICE_REQUEST,
  FETCH_INVOICE_SUCCESS,
  FETCH_INVOICE_FAILURE
} from "../constants/dailySummary";

const initialState = {
  data: [],     
  loading: false, 
  error: null,    
};

export function dailySummaryReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_INVOICE_REQUEST: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case FETCH_INVOICE_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    }
    case FETCH_INVOICE_FAILURE: {
      return {
        ...state,
        loading: false,
        data: [],
        error: action.payload,
      };
    }
    default:
      return state;
  }
}