
import {
  FETCH_PURCHASE_ORDER_REQUEST,
  FETCH_PURCHASE_ORDER_SUCCESS,
  FETCH_PURCHASE_ORDER_FAIL,
  ADD_PURCHASE_ORDER_REQUEST,
  ADD_PURCHASE_ORDER_SUCCESS,
  ADD_PURCHASE_ORDER_FAIL,
  UPDATE_SUPPLIER_REQUEST,
  UPDATE_SUPPLIER_SUCCESS,
  UPDATE_SUPPLIER_FAIL,
} from "../../constants/Inventory/purchaseConstants";

export const purchaseOrderListReducer = (
  state = { orders: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    
    case FETCH_PURCHASE_ORDER_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PURCHASE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: Array.isArray(action.payload) ? action.payload : [],
      };

    case FETCH_PURCHASE_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload };

    
    case ADD_PURCHASE_ORDER_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_PURCHASE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: [...state.orders, action.payload],
      };

    case ADD_PURCHASE_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload };

    
    case UPDATE_SUPPLIER_REQUEST:
      return { ...state, loading: true, error: null };

    case UPDATE_SUPPLIER_SUCCESS:


      return {
        ...state,
        loading: false,
        orders: state.orders.map((order) =>
          
          order.GRN_DocNo === action.payload.P_DOCNO
            ? { ...order, SUPCODE: action.payload.P_SUPCODE }
            : order
        ),
      };

    case UPDATE_SUPPLIER_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
