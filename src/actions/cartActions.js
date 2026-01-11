// // src/actions/cartActions.js
// import { 
//   ADD_TO_CART, 
//   REMOVE_FROM_CART, 
//   UPDATE_QUANTITY, 
//   CLEAR_CART, 
//   APPLY_DISCOUNT,
//   ADD_TAB,
//   REMOVE_TAB,
//   SWITCH_TAB,
//   RENAME_TAB
// } from '../constants/actionTypes';

// export const addToCart = (product) => (dispatch, getState) => {
//   const { products } = getState();
//   const productData = products.allProducts.find(p => p.id === product.id);
  
//   if (productData && productData.stock > 0) {
//     dispatch({
//       type: ADD_TO_CART,
//       payload: product
//     });
//   }
// };

// export const removeFromCart = (id) => ({
//   type: REMOVE_FROM_CART,
//   payload: id
// });

// export const updateQuantity = (id, quantity) => ({
//   type: UPDATE_QUANTITY,
//   payload: { id, quantity }
// });

// export const clearCart = () => ({
//   type: CLEAR_CART
// });

// export const applyDiscount = (amount, type) => ({
//   type: APPLY_DISCOUNT,
//   payload: { amount, type }
// });

// export const addTab = () => ({
//   type: ADD_TAB
// });

// export const removeTab = (tabId) => ({
//   type: REMOVE_TAB,
//   payload: tabId
// });

// export const switchTab = (tabId) => ({
//   type: SWITCH_TAB,
//   payload: tabId
// });

// export const renameTab = (tabId, newName) => ({
//   type: RENAME_TAB,
//   payload: { tabId, newName }
// });

// export const scanBarcode = (barcodeData) => (dispatch, getState) => {
//   const { products } = getState();
//   const product = products.allProducts.find(p => p.barcode === barcodeData);
  
//   if (product) {
//     dispatch({
//       type: SCAN_BARCODE,
//       payload: product
//     });
//     dispatch(addToCart(product));
//   } else {
//     // Product not found, could show notification
//   }
// };

// export const manualAddProduct = (productData) => ({
//   type: MANUAL_ADD_PRODUCT,
//   payload: productData
// });

// export const setBarcodeData = (barcodeData) => ({
//   type: SET_BARCODE_DATA,
//   payload: barcodeData
// });



// cartActions.js
import { 
  ADD_TO_CART, 
  REMOVE_FROM_CART, 
  UPDATE_QUANTITY, 
  CLEAR_CART, 
  APPLY_DISCOUNT,
  ADD_TAB,
  REMOVE_TAB,
  SWITCH_TAB,
  RENAME_TAB
} from '../constants/actionTypes';

export const addToCart = (product) => (dispatch, getState) => {
  const { products } = getState();
  const productData = products.allProducts.find(p => p.id === product.id);
  
  if (productData && productData.stock > 0) {
    dispatch({
      type: ADD_TO_CART,
      payload: product
    });
  }
};

export const removeFromCart = (id) => ({
  type: REMOVE_FROM_CART,
  payload: id
});

export const updateQuantity = (id, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { id, quantity }
});

export const clearCart = () => ({
  type: CLEAR_CART
});

export const applyDiscount = (amount, type) => ({
  type: APPLY_DISCOUNT,
  payload: { amount, type }
});

export const addTab = () => ({
  type: ADD_TAB
});

export const removeTab = (tabId) => ({
  type: REMOVE_TAB,
  payload: tabId
});

export const switchTab = (tabId) => ({
  type: SWITCH_TAB,
  payload: tabId
});

export const renameTab = (tabId, newName) => ({
  type: RENAME_TAB,
  payload: { tabId, newName }
});

// In your cartActions.js
export const applyProductDiscount = (itemId, discountType) => ({
  type: 'APPLY_PRODUCT_DISCOUNT',
  payload: { itemId, discountType }
});

// import { 
//   ADD_TO_CART, 
//   REMOVE_FROM_CART, 
//   UPDATE_QUANTITY, 
//   CLEAR_CART, 
//   APPLY_DISCOUNT 
// } from '../constants/actionTypes';

// export const addToCart = (product) => (dispatch, getState) => {
//   const { products } = getState();
//   const productData = products.allProducts.find(p => p.id === product.id);
  
//   if (productData && productData.stock > 0) {
//     dispatch({
//       type: ADD_TO_CART,
//       payload: product
//     });
//   }
// };

// export const removeFromCart = (id) => ({
//   type: REMOVE_FROM_CART,
//   payload: id
// });

// export const updateQuantity = (id, quantity) => ({
//   type: UPDATE_QUANTITY,
//   payload: { id, quantity }
// });

// export const clearCart = () => ({
//   type: CLEAR_CART
// });

// export const applyDiscount = (amount, type) => ({
//   type: APPLY_DISCOUNT,
//   payload: { amount, type }
// });