import {
  FETCH_WAREHOUSE_REQUEST,
  FETCH_WAREHOUSE_SUCCESS,
  FETCH_WAREHOUSE_FAIL,
  ADD_WAREHOUSE_REQUEST,
  ADD_WAREHOUSE_SUCCESS,
  ADD_WAREHOUSE_FAIL,
  UPDATE_WAREHOUSE_STATUS_REQUEST,
  UPDATE_WAREHOUSE_STATUS_SUCCESS,
  UPDATE_WAREHOUSE_STATUS_FAIL,
  MONTH_END_REQUEST,
  MONTH_END_SUCCESS,
  MONTH_END_FAIL,
} from "../constants/warehouseConstants.js";

const initialState = {
  warehouses: [],
  loading: false,
  error: null,
  statusUpdating: false,
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

    case UPDATE_WAREHOUSE_STATUS_REQUEST:
      return { ...state, statusUpdating: true };

    case UPDATE_WAREHOUSE_STATUS_SUCCESS:
      return {
        ...state,
        statusUpdating: false,
        warehouses: state.warehouses.map((w) =>
          w.WH_Code === action.payload.WH_Code
            ? { ...w, WH_Status: action.payload.status }
            : w
        ),
      };

    case UPDATE_WAREHOUSE_STATUS_FAIL:
      return { ...state, statusUpdating: false, error: action.payload };

    default:
      return state;
  }
}




export const monthEndReducer = (state = {}, action) => {
  switch (action.type) {
    case MONTH_END_REQUEST:
      return { loading: true };
    case MONTH_END_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case MONTH_END_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};