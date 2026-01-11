import {
  FETCH_BATCH_REQUEST,
  FETCH_BATCH_SUCCESS,
  FETCH_BATCH_FAIL,
  ADD_BATCH_REQUEST,
  ADD_BATCH_SUCCESS,
  ADD_BATCH_FAIL,
  TOGGLE_BATCH_STATUS_REQUEST,
  TOGGLE_BATCH_STATUS_SUCCESS,
  TOGGLE_BATCH_STATUS_FAIL,
  BATCH_ACTIVE_REQUEST,
  BATCH_ACTIVE_SUCCESS,
  BATCH_ACTIVE_FAIL,
  BATCH_INACTIVE_REQUEST,
  BATCH_INACTIVE_SUCCESS,
  BATCH_INACTIVE_FAIL
} from "../../constants/Inventory/batchConstant.js";

const initialState = {
  batches: [],
  activeBatches: [],
  inactiveBatches: [],
  loading: false,
  error: null,
};

export function batchReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_BATCH_REQUEST:
    case FETCH_BATCH_REQUEST:
      return { ...state, loading: true, error: null };
    case TOGGLE_BATCH_STATUS_REQUEST:
      return { ...state, loading: true, error:null};

    case ADD_BATCH_SUCCESS:
      return { ...state, loading: false };

    case FETCH_BATCH_SUCCESS:
      return { ...state, loading: false, batches: action.payload };

     case FETCH_BATCH_SUCCESS:
      return { ...state, loading: false, batches: action.payload };

    case ADD_BATCH_FAIL:
    case FETCH_BATCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case TOGGLE_BATCH_STATUS_FAIL:
      return { ...state, loading: false, error: action.payload };

    
    //actie batches
    // case BATCH_ACTIVE_REQUEST:
    //   return{loading:true, activeBatches:[]};
    // case BATCH_ACTIVE_SUCCESS:
    //   return { loading: false, activeBatches: action.payload };
    // case BATCH_ACTIVE_FAIL:
    //   return { loading: false, error: action.payload };


    // //inactive batches
    //  case BATCH_INACTIVE_REQUEST:
    //   return{loading:true, inactiveBatches:[]};
    // case BATCH_INACTIVE_SUCCESS:
    //   return { loading: false, inactiveBatches: action.payload };
    // case BATCH_INACTIVE_FAIL:
    //   return { loading: false, error: action.payload };

    default:
      return state;
  }
}


export const batchActiveReducer = (state = { activeBatches: [] }, action) => {
  switch (action.type) {
    case BATCH_ACTIVE_REQUEST:
      return { loading: true , activeBatches: [] };
    case BATCH_ACTIVE_SUCCESS:
      return { loading: false, activeBatches: action.payload };
    case BATCH_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const batchInactiveReducer = (state = { inactiveBatches: [] }, action) => {
  switch (action.type) {
    case BATCH_INACTIVE_REQUEST:
      return { loading: true, inactiveBatches: [] };
    case BATCH_INACTIVE_SUCCESS:
      return { loading: false, inactiveBatches: action.payload };
    case BATCH_INACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};