import {
  FETCH_SUB_CATEGORY_REQUEST,
  FETCH_SUB_CATEGORY_SUCCESS,
  FETCH_SUB_CATEGORY_FAIL,
  UPDATE_SUB_CATEGORY_FAIL,
  UPDATE_SUB_CATEGORY_REQUEST,
  UPDATE_SUB_CATEGORY_SUCCESS,
} from "../../constants/Inventory/subCatConstant";

const initialState = {
  mainCategories: [],
  loading: false,
  error: null,
};

export function subCategoryReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SUB_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_SUB_CATEGORY_SUCCESS:
      return { ...state, loading: false, subCategories: action.payload };

    case FETCH_SUB_CATEGORY_FAIL:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_SUB_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };

    case UPDATE_SUB_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        subCategories: state.subCategories.map((subcategory) =>
          subcategory.Sub_CatID === action.payload.Sub_CatID
            ? { ...subcategory, status: action.payload.status }
            : subcategory
        ),
      };

    case UPDATE_SUB_CATEGORY_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}