// import { SET_PRODUCTS, FILTER_PRODUCTS, SEARCH_PRODUCTS } from '../constants/actionTypes';

// export const setProducts = (products) => ({
//   type: SET_PRODUCTS,
//   payload: products
// });

// export const filterProducts = (category) => ({
//   type: FILTER_PRODUCTS,
//   payload: category
// });

// export const searchProducts = (query) => ({
//   type: SEARCH_PRODUCTS,
//   payload: query
// });



// productActions.js
import { SET_PRODUCTS, FILTER_PRODUCTS, SEARCH_PRODUCTS } from '../constants/actionTypes';

export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products
});

export const filterProducts = (category) => ({
  type: FILTER_PRODUCTS,
  payload: category
});

export const searchProducts = (query) => ({
  type: SEARCH_PRODUCTS,
  payload: query
});