import { act } from "react";
import{
    ADD_BRAND_REQUEST,
    ADD_BRAND_SUCCESS,
    ADD_BRAND_FAIL,
    FETCH_BRAND_REQUEST,
    FETCH_BRAND_SUCCESS,
    FETCH_BRAND_FAIL,
    FETCH_BRAND_ID_REQUEST,
    FETCH_BRAND_ID_SUCCESS,
    FETCH_BRAND_ID_FAIL,
    FETCH_BRAND_STATUS_REQUEST,
    FETCH_BRAND_STATUS_SUCCESS,
    FETCH_BRAND_STATUS_FAIL,
    BRAND_ACTIVE_REQUEST,
    BRAND_ACTIVE_SUCCESS,
    BRAND_ACTIVE_FAIL,
    BRAND_INACTIVE_REQUEST,
    BRAND_INACTIVE_SUCCESS,
    BRAND_INACTIVE_FAIL,
    UPDATE_BRAND_REQUEST,
    UPDATE_BRAND_SUCCESS,
    UPDATE_BRAND_FAIL,
} from "../../constants/Inventory/brandConstant.js";

const initialState = {
  brands: [],
  loading: false,
  error: null,
  statusUpdating: false,
};

export function brandReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_BRAND_REQUEST:
    case FETCH_BRAND_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BRAND_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BRAND_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_BRAND_SUCCESS:
      return { ...state, loading: false };

    case FETCH_BRAND_SUCCESS:
      return { ...state, loading: false, brands: action.payload };

    case FETCH_BRAND_ID_SUCCESS:
      return { ...state, loading: false, brands: action.payload };
    
    case FETCH_BRAND_STATUS_SUCCESS:
      return { ...state, loading: false, brands: action.payload };

    case ADD_BRAND_FAIL:
    case FETCH_BRAND_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FETCH_BRAND_ID_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FETCH_BRAND_STATUS_FAIL:
      return { ...state, loading: false, error: action.payload };

      case UPDATE_BRAND_REQUEST:
        return { ...state, statusUpdating: true };
      case UPDATE_BRAND_SUCCESS:
        return {
          ...state,
          statusUpdating: false,
          brands: state.brands.map((b) =>
            b.P_BID === action.payload.P_BID ? { ...b, P_STATUS: action.payload.P_STATUS } : b
          ),
        };
      case UPDATE_BRAND_FAIL:
        return { ...state, statusUpdating: false, error: action.payload };

    default:
      return state;
  }
}


export const brandActiveReducer = (state = { activeBrands: [] }, action) => {
  switch (action.type) {
    case BRAND_ACTIVE_REQUEST:
      return { loading: true , activeBrands: [] };
    case BRAND_ACTIVE_SUCCESS:
      return { loading: false, activeBrands: action.payload };
    case BRAND_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const brandInactiveReducer = (state = { inactiveBrands: [] }, action) => {
  switch (action.type) {
    case BRAND_INACTIVE_REQUEST:
      return { loading: true, inactiveBrands: [] };
    case BRAND_INACTIVE_SUCCESS:
      return { loading: false, inactiveBrands: action.payload };
    case BRAND_INACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};