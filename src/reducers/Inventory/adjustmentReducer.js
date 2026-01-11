
import {
  ADJUSTMENT_ADD_REQUEST,
  ADJUSTMENT_ADD_SUCCESS,
  ADJUSTMENT_ADD_FAIL,
  ADJUSTMENT_LIST_REQUEST,
  ADJUSTMENT_LIST_SUCCESS,
  ADJUSTMENT_LIST_FAIL,
} from "../../constants/Inventory/adjustmentConstants";

export const adjustmentListReducer = (state = { adjustments: [] }, action) => {
  switch (action.type) {
    case ADJUSTMENT_LIST_REQUEST:
      return { loading: true, adjustments: [] };
    case ADJUSTMENT_LIST_SUCCESS:
      return { loading: false, adjustments: action.payload };
    case ADJUSTMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const adjustmentAddReducer = (state = {}, action) => {
  switch (action.type) {
    case ADJUSTMENT_ADD_REQUEST:
      return { loading: true };
    case ADJUSTMENT_ADD_SUCCESS:
      return { loading: false, success: true, adjustment: action.payload };
    case ADJUSTMENT_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
