import{
    ADD_INVENTORY_PRODUCT_REQUEST,
    ADD_INVENTORY_PRODUCT_SUCCESS,
    ADD_INVENTORY_PRODUCT_FAIL,
    FETCH_INVENTORY_PRODUCT_REQUEST,
    FETCH_INVENTORY_PRODUCT_SUCCESS,
    FETCH_INVENTORY_PRODUCT_FAIL,
    FETCH_INVENTORY_PRODUCT_ID_REQUEST,
    FETCH_INVENTORY_PRODUCT_ID_SUCCESS,
    FETCH_INVENTORY_PRODUCT_ID_FAIL,
    FETCH_INVENTORY_PRODUCT_STATUS_REQUEST,
    FETCH_INVENTORY_PRODUCT_STATUS_SUCCESS,
    FETCH_INVENTORY_PRODUCT_STATUS_FAIL,
    PRODUCT_ACTIVE_REQUEST,
    PRODUCT_ACTIVE_SUCCESS,
    PRODUCT_ACTIVE_FAIL,
    PRODUCT_INACTIVE_REQUEST,
    PRODUCT_INACTIVE_SUCCESS,
    PRODUCT_INACTIVE_FAIL,

    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,

  PRODUCT_CAT_REQUEST,
  PRODUCT_CAT_SUCCESS,
  PRODUCT_CAT_FAIL,
  PRODUCT_CAT_RESET,
} from "../../constants/Inventory/InventoryProductConstant";

const initialState = {
  inventoryProducts: [],
  loading: false,
  error: null,
};

export function inventoryProductReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_INVENTORY_PRODUCT_REQUEST:
    case FETCH_INVENTORY_PRODUCT_REQUEST:
      
    case FETCH_INVENTORY_PRODUCT_ID_REQUEST:
      
    case FETCH_INVENTORY_PRODUCT_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_INVENTORY_PRODUCT_SUCCESS:
      
      return{...state, loading:false}

    case FETCH_INVENTORY_PRODUCT_SUCCESS:
      return { ...state, loading: false, inventoryProducts: action.payload };

    case FETCH_INVENTORY_PRODUCT_ID_SUCCESS:
      return { ...state, loading: false, inventoryProducts: action.payload };

    case FETCH_INVENTORY_PRODUCT_STATUS_SUCCESS:
      return { ...state, loading: false, inventoryProducts: action.payload };

    case ADD_INVENTORY_PRODUCT_FAIL:
    case FETCH_INVENTORY_PRODUCT_FAIL: 
      return { ...state, loading: false, error: action.payload };
    case FETCH_INVENTORY_PRODUCT_ID_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FETCH_INVENTORY_PRODUCT_STATUS_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }

  
}

export const productActiveReducer = (state = { activeProducts: [] }, action) => {
  switch (action.type) {
    case PRODUCT_ACTIVE_REQUEST:
      return { loading: true, activeProducts: [] };
    case PRODUCT_ACTIVE_SUCCESS:
      return { loading: false, activeProducts: action.payload };
    case PRODUCT_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const productInactiveReducer = (state = { inactiveProducts: [] }, action) => {
  switch (action.type) {
    case PRODUCT_INACTIVE_REQUEST:
      return { loading: true, inactiveProducts: [] };
    case PRODUCT_INACTIVE_SUCCESS:
      return { loading: false, inactiveProducts: action.payload };
    case PRODUCT_INACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const productCatReducer = (state = { cat: {} }, action) => {
  switch (action.type) {
    case PRODUCT_CAT_REQUEST:
      return { loading: true };
    case PRODUCT_CAT_SUCCESS:
      return { loading: false, cat: action.payload };
    case PRODUCT_CAT_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CAT_RESET:
      return { cat: {} };
    default:
      return state;
  }
};