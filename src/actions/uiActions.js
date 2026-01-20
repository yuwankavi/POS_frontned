import { TOGGLE_THEME, SET_ACTIVE_PAGE, SET_PO_PREFILL_DATA, CLEAR_PO_PREFILL_DATA } from '../constants/actionTypes';

export const toggleTheme = () => ({
  type: TOGGLE_THEME
});

export const setActivePage = (page) => ({
  type: SET_ACTIVE_PAGE,
  payload: page
});

export const setPoPrefillData = (data) => ({
  type: SET_PO_PREFILL_DATA,
  payload: data
});

export const clearPoPrefillData = () => ({
  type: CLEAR_PO_PREFILL_DATA
});