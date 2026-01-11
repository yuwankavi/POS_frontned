import {
  PROMOTION_CREATE_REQUEST,
  PROMOTION_CREATE_SUCCESS,
  PROMOTION_CREATE_FAIL,
  PROMOTION_LIST_REQUEST,
  PROMOTION_LIST_SUCCESS,
  PROMOTION_LIST_FAIL,
  PROMOTION_UPDATE_REQUEST,
  PROMOTION_UPDATE_SUCCESS,
  PROMOTION_UPDATE_FAIL,
  PROMOTION_DELETE_REQUEST,
  PROMOTION_DELETE_SUCCESS,
  PROMOTION_DELETE_FAIL,
  PROMOTION_DETAILS_REQUEST,
  PROMOTION_DETAILS_SUCCESS,
  PROMOTION_DETAILS_FAIL,
  PROMOTION_STATUS_UPDATE_REQUEST,
  PROMOTION_STATUS_UPDATE_SUCCESS,
  PROMOTION_STATUS_UPDATE_FAIL,
  PRODUCT_LIST_FOR_PROMOTION_REQUEST,
  PRODUCT_LIST_FOR_PROMOTION_SUCCESS,
  PRODUCT_LIST_FOR_PROMOTION_FAIL
} from '../../constants/POS/promotionConstants';
const initialState = {
  promotions: [],
  products: [],
  promotion: null,
  loading: false,
  error: null,
  success: false,
  statusLoading: false
};
export const promotionReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROMOTION_CREATE_REQUEST:
    case PROMOTION_LIST_REQUEST:
    case PROMOTION_UPDATE_REQUEST:
    case PROMOTION_DELETE_REQUEST:
    case PROMOTION_DETAILS_REQUEST:
    case PRODUCT_LIST_FOR_PROMOTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false
      };
    case PROMOTION_STATUS_UPDATE_REQUEST:
      return {
        ...state,
        statusLoading: true,
        error: null
      };
    case PROMOTION_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        promotions: [...state.promotions, action.payload]
      };
    case PROMOTION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        promotions: action.payload
      };
    case PROMOTION_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        promotions: state.promotions.map(promo =>
          promo.id === action.payload.id ? action.payload : promo
        )
      };
    case PROMOTION_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        promotions: state.promotions.filter(promo => promo.id !== action.payload)
      };
    case PROMOTION_STATUS_UPDATE_SUCCESS:
      return {
        ...state,
        statusLoading: false,
        promotions: state.promotions.map(promo =>
          promo.id === action.payload.promotionId
            ? { ...promo, P_STATUS: 'I' } 
            : promo
        )
      };
    case PROMOTION_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        promotion: action.payload
      };
    case PRODUCT_LIST_FOR_PROMOTION_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload
      };
    case PROMOTION_CREATE_FAIL:
    case PROMOTION_LIST_FAIL:
    case PROMOTION_UPDATE_FAIL:
    case PROMOTION_DELETE_FAIL:
    case PROMOTION_DETAILS_FAIL:
    case PRODUCT_LIST_FOR_PROMOTION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false
      };
    case PROMOTION_STATUS_UPDATE_FAIL:
      return {
        ...state,
        statusLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};





