import {
  FETCH_MAIN_CATEGORY_REQUEST,
  FETCH_MAIN_CATEGORY_SUCCESS,
  FETCH_MAIN_CATEGORY_FAIL,
} from "../../constants/Inventory/mainCatConstants.js";

const initialState = {
  mainCategories: [],
  loading: false,
  error: null,
};

export function mainCategoryReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MAIN_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_MAIN_CATEGORY_SUCCESS:
      return { ...state, loading: false, mainCategories: action.payload };

    case FETCH_MAIN_CATEGORY_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}