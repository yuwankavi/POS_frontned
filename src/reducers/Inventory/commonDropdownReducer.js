
import {
  WAREHOUSE_LIST_REQUEST,
  WAREHOUSE_LIST_SUCCESS,
  WAREHOUSE_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_RESET,
  BATCH_LIST_REQUEST,
  BATCH_LIST_SUCCESS,
  BATCH_LIST_FAIL,
  BATCH_LIST_RESET,
} from '../../constants/Inventory/commonDropdownConstants';

export const warehouseListReducer = (state = { warehouses: [] }, action) => {
  switch (action.type) {
    case WAREHOUSE_LIST_REQUEST:
      return { loading: true, warehouses: [] };
    case WAREHOUSE_LIST_SUCCESS:
      return { loading: false, warehouses: action.payload };
    case WAREHOUSE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_LIST_RESET:
      return { products: [] };
    default:
      return state;
  }
};

export const batchListReducer = (state = { batches: [] }, action) => {
  switch (action.type) {
    case BATCH_LIST_REQUEST:
      return { loading: true, batches: [] };
    case BATCH_LIST_SUCCESS:
      return { loading: false, batches: action.payload };
    case BATCH_LIST_FAIL:
      return { loading: false, error: action.payload };
    case BATCH_LIST_RESET:
      return { batches: [] };
    default:
      return state;
  }
};