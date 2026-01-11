import {
  FETCH_WAREHOUSE_REQUEST,
  FETCH_WAREHOUSE_SUCCESS,
  FETCH_WAREHOUSE_FAIL,
  ADD_WAREHOUSE_REQUEST,
  ADD_WAREHOUSE_SUCCESS,
  ADD_WAREHOUSE_FAIL,
} from "../../constants/Inventory/warehouseConstants.js";

const initialState = {
  warehouses: [],
  loading: false,
  error: null,
};

export function warehouseReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_WAREHOUSE_REQUEST:
    case FETCH_WAREHOUSE_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_WAREHOUSE_SUCCESS:
      return { ...state, loading: false };

    case FETCH_WAREHOUSE_SUCCESS:
      return { ...state, loading: false, warehouses: action.payload };

    case ADD_WAREHOUSE_FAIL:
    case FETCH_WAREHOUSE_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}