import {
  FETCH_SALESRETURN_REQUEST,
  FETCH_SALESRETURN_SUCCESS,
  FETCH_SALESRETURN_FAIL,
  ADD_SALESRETURN_REQUEST,
  ADD_SALESRETURN_SUCCESS,
  ADD_SALESRETURN_FAIL,
  UPDATE_SALESRETURN_STATUS_REQUEST,
  UPDATE_SALESRETURN_STATUS_SUCCESS,
  UPDATE_SALESRETURN_STATUS_FAIL,
} from "../../constants/Inventory/salesReturnConstant.js";

const initialState = {
  salesReturns: [],
  loading: false,
  error: null,
  statusUpdating: false,
};

export function salesReturnReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SALESRETURN_REQUEST:
    case FETCH_SALESRETURN_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_SALESRETURN_SUCCESS:
      return { ...state, loading: false };

    case FETCH_SALESRETURN_SUCCESS:
      return { ...state, loading: false, salesReturns: action.payload };

    case ADD_SALESRETURN_FAIL:
    case FETCH_SALESRETURN_FAIL:
      return { ...state, loading: false, error: action.payload };

     case UPDATE_SALESRETURN_STATUS_REQUEST:
      return { ...state, statusUpdating: true };

    case UPDATE_SALESRETURN_STATUS_SUCCESS:
      return {
        ...state,
        statusUpdating: false,
        salesReturns: state.salesReturns.map((sr) =>
          sr.id === action.payload.id ? { ...sr, status: action.payload.status } : sr
        ),
      };

    case UPDATE_SALESRETURN_STATUS_FAIL:
      return { ...state, statusUpdating: false, error: action.payload };

    default:
      return state;
  }
}
  
