import {
  FETCH_PURCHASE_RETURN_REQUEST,
  FETCH_PURCHASE_RETURN_SUCCESS,
  FETCH_PURCHASE_RETURN_FAIL,
  ADD_PURCHASE_RETURN_REQUEST,
  ADD_PURCHASE_RETURN_SUCCESS,
  ADD_PURCHASE_RETURN_FAIL,
} from "../../constants/Inventory/purchaseReturnConstants";

export const purchaseReturnOrderListReducer = (
  state = { returns: [] },
  action
) => {
  switch (action.type) {
    case FETCH_PURCHASE_RETURN_REQUEST:
      return { ...state, loading: true };

    case FETCH_PURCHASE_RETURN_SUCCESS:
      return {
        loading: false,
        returns: Array.isArray(action.payload) ? action.payload : [],
      };

    case FETCH_PURCHASE_RETURN_FAIL:
      return { loading: false, error: action.payload, returns: [] };


    
    case ADD_PURCHASE_RETURN_REQUEST:
      return { ...state, loading: true };

    case ADD_PURCHASE_RETURN_SUCCESS:
      return {
        ...state,
        loading: false,
        
        returns: [action.payload, ...state.returns],
        success: true,
      };

    case ADD_PURCHASE_RETURN_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

















































