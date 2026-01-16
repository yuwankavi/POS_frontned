



// import { createStore, combineReducers, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import { cartReducer, productReducer, uiReducer } from './reducers';
// import { authReducer } from './reducers/authReducer';
// import { userListReducer, userTypeReducer, userAddReducer } from './reducers/userReducer';
// import {supplierListReducer,supplierAddReducer,supplierDetailsReducer,supplierUpdateReducer,} from './reducers/supplierReducer';
// import {customerListReducer,customerAddReducer,customerDetailsByPhoneReducer,} from './reducers/customerReducer';

// const rootReducer = combineReducers({
//   auth: authReducer,
//   cart: cartReducer,
//   products: productReducer,
//   ui: uiReducer,
//   userList: userListReducer,
//   userTypes: userTypeReducer,
//   userAdd: userAddReducer,
//   supplierList: supplierListReducer,
//   supplierDetails: supplierDetailsReducer,
//   supplierAdd: supplierAddReducer,
//   customerList: customerListReducer,
//   customerAdd: customerAddReducer,
//   customerDetailsByPhone: customerDetailsByPhoneReducer,
// });
// const initialState = {};
// const middleware = [thunk];
// const store = createStore(
//   rootReducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );
// export default store;

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {  cartReducer, productReducer, uiReducer } from './reducers';
import { authReducer } from './reducers/authReducer';
import { userListReducer, userTypeReducer, userAddReducer } from './reducers/userReducer';
import { warehouseReducer } from './reducers/warehouseReducer.js';
import { purchaseOrderListReducer } from './reducers/Inventory/purchaseReducer.js';
import { purchaseReturnOrderListReducer } from './reducers/Inventory/purchaseReturnReducer.js';
import { mainCategoryReducer } from './reducers/Inventory/mainCategoryReducer.js';
import { subCategoryReducer } from './reducers/Inventory/subCategoryReducers.js';
import { supplierListReducer,
          supplierAddReducer,
          supplierDetailsReducer,
          supplierUpdateReducer,} from './reducers/supplierReducer';
import { customerListReducer,
          customerAddReducer,
          customerDetailsByPhoneReducer,
          customerUpdateReducer} from './reducers/customerReducer';
import { binCardReducer } from "./reducers/Inventory/binCardReducer.js"
import { brandActiveReducer, brandInactiveReducer, brandReducer } from './reducers/Inventory/brandReducer.js';
import { inventoryProductReducer,productActiveReducer,productInactiveReducer,productUpdateReducer } from './reducers/Inventory/InventoryProductReducer.js'; 
import { batchReducer, batchActiveReducer, batchInactiveReducer } from './reducers/Inventory/batchReducer.js';
import productReducer1 from './reducers/POS/productReducer.js';
import { invoiceReducer } from '../src/reducers/POS/invoiceReducer.js';
import { invoiceReturnReducer } from './reducers/invoiceReturnReducer';
import { adjustmentListReducer } from './reducers/Inventory/adjustmentReducer.js';
import { adjustmentAddReducer } from './reducers/Inventory/adjustmentReducer.js';  
import { salesReturnReducer } from './reducers/Inventory/SalesReturnReducer.js';
import { productDetailsReducer, activePDReducer, productDetailsByIdReducer } from './reducers/Inventory/inventoryProductDetailReducer.js';
import { returnReducer } from './reducers/returnReducer';
import { stockAdjustmentReducer } from './reducers/Inventory/stockAdjustmentReducers.js';
import { unitActiveListReducer, unitInactiveListReducer, unitAddReducer, unitUpdateReducer, unitDetailsReducer } from './reducers/Inventory/unitReducer.js';
import { dailySummaryReducer } from './reducers/dailySummaryReducer.js'; 
import { 
  warehouseListReducer, 
  productListReducer, 
  batchListReducer 
} from './reducers/Inventory/commonDropdownReducer.js';
// Import promotion reducer
import { promotionReducer } from './reducers/POS/promotionReducer.js';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  ui: uiReducer,
  userList: userListReducer,
  userTypes: userTypeReducer,
  userAdd: userAddReducer,
  warehouse: warehouseReducer,
  purchaseOrders: purchaseOrderListReducer,
  purchaseReturnOrders: purchaseReturnOrderListReducer,
  mainCategory: mainCategoryReducer,
  subCategory: subCategoryReducer, 
  supplierList: supplierListReducer,
  supplierDetails: supplierDetailsReducer,
  supplierAdd: supplierAddReducer,
  customerList : customerListReducer,
  customerAdd : customerAddReducer,
  customerDetailsByPhone : customerDetailsByPhoneReducer,
  binCard:binCardReducer,
  brand: brandReducer,
  inventoryProducts: inventoryProductReducer,
  productDetails: productDetailsReducer,
  batch: batchReducer,
  activeBatches: batchActiveReducer,
  inactiveBatches: batchInactiveReducer,
  activeProducts: productActiveReducer,
  inactiveProducts: productInactiveReducer,
  activeBrands: brandActiveReducer,
  inactiveBrands: brandInactiveReducer,
  activeProductDetails : activePDReducer,
  salesReturn: salesReturnReducer,
  productDetailsById: productDetailsByIdReducer,
  adjustment: adjustmentListReducer,
  adjustmentAdd: adjustmentAddReducer,
  unitActiveList: unitActiveListReducer,
  unitInactiveList: unitInactiveListReducer,
  unitAdd: unitAddReducer,
  unitUpdate: unitUpdateReducer,
  unitDetails: unitDetailsReducer,
  stockAdjustments: stockAdjustmentReducer,
  products: productReducer1,
  productDeatilsById: productDetailsByIdReducer,
  activeBatches: batchActiveReducer,
  inactiveBatches: batchInactiveReducer,
  stockAdjustments: stockAdjustmentReducer,
  return: returnReducer,
  invoice: invoiceReducer,
  invoiceReturn: invoiceReturnReducer,
  adjustment: adjustmentListReducer,
  adjustmentAdd: adjustmentAddReducer,
  salesReturn: salesReturnReducer,
  unitActiveList: unitActiveListReducer,
  unitInactiveList: unitInactiveListReducer,
  unitAdd: unitAddReducer,
  unitUpdate: unitUpdateReducer,
  unitDetails: unitDetailsReducer,
  productUpdate: productUpdateReducer,
  dailySummaryByDate: dailySummaryReducer,
  customerUpdate:customerUpdateReducer,
  warehouseList: warehouseListReducer,
  productList: productListReducer,
  batchList: batchListReducer,
  promotion: promotionReducer
});

const middleware = [thunk];
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;