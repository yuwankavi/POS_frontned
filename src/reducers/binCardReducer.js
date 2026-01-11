import { 
    BinCard_LIST_REQUEST,
    BinCard_LIST_SUCCESS,
    BinCard_LIST_FAIL
 } from "../constants/admin/binCardConstants";

 const initialState = {
  binCard: [],
  loading: false,
  error: null,
};

export function binCardReducer(state = initialState, action) {
  switch (action.type) {
    case BinCard_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case BinCard_LIST_SUCCESS:
      return { ...state, loading: false, binCards: action.payload };
    case BinCard_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}