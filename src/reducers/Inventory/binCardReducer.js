import {
  BinCard_MAXLINE_REQUEST,
  BinCard_MAXLINE_SUCCESS,
  BinCard_MAXLINE_FAIL,
  BinCard_BYLINE_REQUEST,
  BinCard_BYLINE_SUCCESS,
  BinCard_BYLINE_FAIL,
  BinCard_TRANSACTION_REQUEST,
  BinCard_TRANSACTION_SUCCESS,
  BinCard_TRANSACTION_FAIL,
} from "../../constants/Inventory/binCardConstants";

const initialState = {
  maxLine: [],
  transactions: [],
  byLine: [],
  loading: false,
  error: null,
};

export function binCardReducer(state = initialState, action) {
  switch (action.type) {
    
    case BinCard_MAXLINE_REQUEST:
      return { ...state, loading: true, error: null };
    case BinCard_MAXLINE_SUCCESS:
      return { ...state, loading: false, maxLine: action.payload };
    case BinCard_MAXLINE_FAIL:
      return { ...state, loading: false, error: action.payload };

    
    case BinCard_BYLINE_REQUEST:
      return { ...state, loading: true, error: null };
    case BinCard_BYLINE_SUCCESS:
      return { ...state, loading: false, byLine: action.payload };
    case BinCard_BYLINE_FAIL:
      return { ...state, loading: false, error: action.payload };

    
    case BinCard_TRANSACTION_REQUEST:
      return { ...state, loading: true, error: null };
    case BinCard_TRANSACTION_SUCCESS:
      return { ...state, loading: false, transactions: action.payload };
    case BinCard_TRANSACTION_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
