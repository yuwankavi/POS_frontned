
import {
  FETCH_UNIT_ACTIVE_REQUEST,
  FETCH_UNIT_ACTIVE_SUCCESS,
  FETCH_UNIT_ACTIVE_FAIL,
  FETCH_UNIT_INACTIVE_REQUEST,
  FETCH_UNIT_INACTIVE_SUCCESS,
  FETCH_UNIT_INACTIVE_FAIL,
  UNIT_ADD_REQUEST,
  UNIT_ADD_SUCCESS,
  UNIT_ADD_FAIL,
  UNIT_UPDATE_REQUEST,
  UNIT_UPDATE_SUCCESS,
  UNIT_UPDATE_FAIL,
  FETCH_BY_ID_UNIT_REQUEST,
  FETCH_BY_ID_UNIT_SUCCESS,
  FETCH_BY_ID_UNIT_FAIL,
} from "../../constants/Inventory/unitConstant.js";


export const unitActiveListReducer = (
  state = { units: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case FETCH_UNIT_ACTIVE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_UNIT_ACTIVE_SUCCESS:
      return { ...state, loading: false, units: action.payload };
    case FETCH_UNIT_ACTIVE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


export const unitInactiveListReducer = (
  state = { units: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case FETCH_UNIT_INACTIVE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_UNIT_INACTIVE_SUCCESS:
      return { ...state, loading: false, units: action.payload };
    case FETCH_UNIT_INACTIVE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


export const unitAddReducer = (
  state = { unit: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case UNIT_ADD_REQUEST:
      return { ...state, loading: true, error: null };
    case UNIT_ADD_SUCCESS:
      return { ...state, loading: false, unit: action.payload };
    case UNIT_ADD_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


export const unitUpdateReducer = (
  state = { success: false, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case UNIT_UPDATE_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case UNIT_UPDATE_SUCCESS:
      return { ...state, loading: false, success: true, unit: action.payload };
    case UNIT_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};


export const unitDetailsReducer = (
  state = { unit: null, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case FETCH_BY_ID_UNIT_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BY_ID_UNIT_SUCCESS:
      return { ...state, loading: false, unit: action.payload };
    case FETCH_BY_ID_UNIT_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
