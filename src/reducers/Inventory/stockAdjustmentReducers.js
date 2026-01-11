import {
  FETCH_STOCK_ADJUSTMENT_REQUEST,
  FETCH_STOCK_ADJUSTMENT_SUCCESS,
  FETCH_STOCK_ADJUSTMENT_FAIL,
  ADD_STOCK_ADJUSTMENT_REQUEST,
  ADD_STOCK_ADJUSTMENT_SUCCESS,
  ADD_STOCK_ADJUSTMENT_FAIL,
} from "../../constants/Inventory/stockAdjustmentConstants.js";

const initialState = {
  adjustments: [],
  loading: false,
  error: null,
};

export function stockAdjustmentReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STOCK_ADJUSTMENT_REQUEST:
    case ADD_STOCK_ADJUSTMENT_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_STOCK_ADJUSTMENT_SUCCESS:
      return { ...state, loading: false, adjustments: action.payload };

    case ADD_STOCK_ADJUSTMENT_SUCCESS:
      return { ...state, loading: false };

    case FETCH_STOCK_ADJUSTMENT_FAIL:
    case ADD_STOCK_ADJUSTMENT_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}
