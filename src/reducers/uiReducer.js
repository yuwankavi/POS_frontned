import { TOGGLE_THEME, OPEN_MODAL, CLOSE_MODAL } from '../constants/actionTypes';
const initialState = {
  darkMode: localStorage.getItem('darkMode') === 'true' ? true : false,
  // darkMode: false,
  activeModal: null,
  modalProps: null,
  sidebarCollapsed: false
};
export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', newDarkMode);
      return {
        ...state,
        darkMode: !state.darkMode
      };
    case OPEN_MODAL:
      return {
        ...state,
        activeModal: action.payload.modalType,
        modalProps: action.payload.props || null
      };
    case CLOSE_MODAL:
      return {
        ...state,
        activeModal: null,
        modalProps: null
      };
    default:
      return state;
  }
};