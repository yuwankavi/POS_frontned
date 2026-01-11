
import {
  ADD_PRODUCT_DETAILS_REQUEST,
  ADD_PRODUCT_DETAILS_SUCCESS,
  ADD_PRODUCT_DETAILS_FAIL,
  FETCH_PRODUCT_DETAILS_REQUEST,
  FETCH_PRODUCT_DETAILS_SUCCESS,
  FETCH_PRODUCT_DETAILS_FAIL,
  FETCH_ACTIVE_PRODUCT_DETAILS_REQUEST,
  FETCH_ACTIVE_PRODUCT_DETAILS_SUCCESS,
  FETCH_ACTIVE_PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../../constants/Inventory/inventoryProductDetailsConstant.js";

const initialState = {
  details: [],
  loading: false,
  error: null,
   productDetailsByIdData: [],
  loadingById: false,
  errorById: null,
};



export const productDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT_DETAILS_REQUEST:
    
    case FETCH_PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        details: [...state.details, action.payload],
      };
    case FETCH_PRODUCT_DETAILS_SUCCESS:
      return { ...state, loading: false, details: action.payload };

    case ADD_PRODUCT_DETAILS_FAIL:
    
    case FETCH_PRODUCT_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


export const activePDReducer = (state = {activeProductDetails: []}, action) => {
  switch (action.type) {
    case FETCH_ACTIVE_PRODUCT_DETAILS_REQUEST:
      return { loading: true, activeProductDetails: [] };
    case FETCH_ACTIVE_PRODUCT_DETAILS_SUCCESS:
      return { loading: false, activeProductDetails: action.payload };
    case FETCH_ACTIVE_PRODUCT_DETAILS_FAIL:
      return { loading: false, error:action.payload };
    default:
      return state;
  }
};

export const productDetailsByIdReducer = (state = { productDeatilsByIdData: [],loadingById: false, errorById:null}, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loadingById: true, ...state };

    case PRODUCT_DETAILS_SUCCESS:
      return { lloadingById: false, productDeatilsByIdData: action.payload };

    case PRODUCT_DETAILS_FAIL:
      return { loadingById: false, errorById: action.payload };

    default:
      return state;
  }
};
