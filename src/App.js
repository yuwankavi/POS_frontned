// import React from "react";
// import { Provider, useSelector, useDispatch } from "react-redux";
// import store from "./store";
// // import { AuthProvider } from "./reducers/authReducer";
// import { CartProvider } from "./context/CartContext";
// import { ThemeProvider } from "./context/ThemeContext";
// import { ModalProvider } from "./context/ModalContext";
// import Layout from "./components/common/Layout";
// import LoginModal from "./components/modals/LoginModal";
// import ScannerModal from "./components/modals/ScannerModal";
// import PaymentModal from "./components/modals/PaymentModal";
// import InvoiceModal from "./components/modals/InvoiceModal";
// import CashCalcModal from "./components/modals/CashCalcModal";
// import CustomerModal from "./components/modals/CustomerModal";
// import InventoryModal from "./components/modals/InventoryModal";
// import HistoryModal from "./components/modals/HistoryModal";
// import ReportsModal from "./components/modals/ReportsModal";
// import SettingsModal from "./components/modals/SettingsModal";
// import ReturnsModal from "./components/modals/ReturnsModal";
// import CouponModal from "./components/modals/CouponModal";
// import AddProductModal from "./components/modals/AddProductModal";
// import FeaturesModal from "./components/modals/FeaturesModal";
// import ERPSystemModal from "./components/modals/ERPSystemModal";
// import DiscountModal from "./components/modals/DiscountModal";
// import { LOGIN_SUCCESS } from "./constants/authConstants";
// import { openModal, closeModal } from "./actions/modalActions";
// import AddWarehouseModal from "../src/components/Inventory/modals/AddWarehouseModal.js";
// import AddInventoryProductModal from "./components/Inventory/modals/InventoryProduct/AddInventoryProductModal.js";
// import UpdateProductModal from "./components/Inventory/modals/InventoryProduct/UpdateProductModal.js";
// import { AddProductDetailModal } from "./components/Inventory/modals/InventoryProduct/AddProductDetailModal.js";
// import { UpdateProductDetailModal } from "./components/Inventory/modals/InventoryProduct/UpdateProductDetailModal.js"; 
// import AddBrandModal from "./components/Inventory/modals/brand/AddBrandModal.js";
// import AddBatchModal from "./components/Inventory/modals/batch/AddBatchModal.js";
// import AddPRNModal from "./components/Inventory/modals/AddPRN.js"; 
// import AddGRNModal from "../src/components/Inventory/modals/AddGRN.js";

// function AppInitializer() {
//   const dispatch = useDispatch();
//   React.useEffect(() => {
//     const user = localStorage.getItem("user");
//     const token = localStorage.getItem("token");
//     if (user && token) {
//       dispatch({
//         type: LOGIN_SUCCESS,
//         payload: { user: JSON.parse(user), token }
//       });
//     }
//   }, [dispatch]);
//   return null;
// }
// function AppContent() {
//   const dispatch = useDispatch();
//   const { darkMode, activeModal } = useSelector((state) => state.ui);
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   React.useEffect(() => {
//     if (!isAuthenticated && !activeModal) {
//       dispatch(openModal("LOGIN"));
//     } else if (isAuthenticated && activeModal === "LOGIN") {
//       dispatch(closeModal());
//     }
//   }, [isAuthenticated, activeModal, dispatch]);
//   const renderModal = () => {
//     switch (activeModal) {
//       case "LOGIN":
//         return <LoginModal />;
//       case "SCANNER":
//         return <ScannerModal />;
//       case "PAYMENT":
//         return <PaymentModal />;
//       case "INVOICE":
//         return <InvoiceModal />;
//       case "CASH_CALC":
//         return <CashCalcModal />;
//       case "CUSTOMER":
//         return <CustomerModal />;
//       case "INVENTORY":
//         return <InventoryModal />;
//       case "HISTORY":
//         return <HistoryModal />;
//       case "REPORTS":
//         return <ReportsModal />;
//       case "SETTINGS":
//         return <SettingsModal />;
//       case "RETURNS":
//         return <ReturnsModal />;
//       case "DISCOUNT":
//         return <DiscountModal />;
//       case "COUPON":
//         return <CouponModal />;
//          case "ADD_WAREHOUSE":
//         return <AddWarehouseModal />;
//       case "ADD_PRODUCT":
//         return <AddProductModal />;
//       case "FEATURES":
//         return <FeaturesModal />;
//          case "ADD_PRODUCT":
//         return <AddProductModal />;
//       case "ADD_INVENTORY_PRODUCT":
//         return <AddInventoryProductModal />;
//       case "UPDATE_INVENTORY_PRODUCT":
//         return <UpdateProductModal />;
//       case "ADD_PRODUCT_DETAIL":
//         return <AddProductDetailModal />;
//       case "UPDATE_PRODUCT_DETAIL":
//         return <UpdateProductDetailModal />;
//         case "ADD_BRAND":
//         return <AddBrandModal />;
//         case "ADD_BATCH":
//         return <AddBatchModal />;
//         case "ADD_PRN":
//         return <AddPRNModal />;
//         case "ADD_GRN":
//         return <AddGRNModal />;
//       case "ERP":
//         return <ERPSystemModal />;
//       default:
//         return null;
//     }
//   };
//   return (
//     <div
//       className={`min-h-screen ${
//         darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
//       }`}
//     >
//       <Layout />
//       {renderModal()}
//     </div>
//   );
// }
// function App() {
//   return (
//     <Provider store={store}>
//       {/* <AuthProvider> */}
//         <CartProvider>
//           <ThemeProvider>
//             <ModalProvider>
//               <AppInitializer />
//               <AppContent />
//             </ModalProvider>
//           </ThemeProvider>
//         </CartProvider>
//       {/* </AuthProvider> */}
//     </Provider>
//   );
// }
// export default App;





import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./store";
// import { AuthProvider } from "./reducers/authReducer";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ModalProvider } from "./context/ModalContext";
import Layout from "./components/common/Layout";
import LoginModal from "./components/modals/LoginModal";
import ScannerModal from "./components/modals/ScannerModal";
import PaymentModal from "./components/modals/PaymentModal";
import InvoiceModal from "./components/modals/InvoiceModal";
import CashCalcModal from "./components/modals/CashCalcModal";
import CustomerModal from "./components/modals/CustomerModal";
import InventoryModal from "./components/modals/InventoryModal";
import HistoryModal from "./components/modals/HistoryModal";
import ReportsModal from "./components/modals/ReportsModal";
import SettingsModal from "./components/modals/SettingsModal";
import ReturnsModal from "./components/modals/ReturnsModal";
import CouponModal from "./components/modals/CouponModal";
import AddProductModal from "./components/modals/AddProductModal";
import FeaturesModal from "./components/modals/FeaturesModal";
import ERPSystemModal from "./components/modals/ERPSystemModal";
import DiscountModal from "./components/modals/DiscountModal";
import { LOGIN_SUCCESS } from "./constants/authConstants";
import { openModal, closeModal } from "./actions/modalActions";
import AddWarehouseModal from "../src/components/Inventory/modals/AddWarehouseModal.js";
import AddGRNModal from "../src/components/Inventory/modals/AddGRN.js";
import SubCategoryAddModal from "./components/Inventory/modals/ProductSubadd.js";
import FilterByMonth from "./components/modals/filterByMonth.js"
import FilterByDate from "./components/modals/filterByDate.js";



import AddInventoryProductModal from "./components/Inventory/modals/InventoryProduct/AddInventoryProductModal.js";
import UpdateProductModal from "./components/Inventory/modals/InventoryProduct/UpdateProductModal.js";
import { AddProductDetailModal } from "./components/Inventory/modals/InventoryProduct/AddProductDetailModal.js";
import { UpdateProductDetailModal } from "./components/Inventory/modals/InventoryProduct/UpdateProductDetailModal.js";
import AddBrandModal from "./components/Inventory/modals/brand/AddBrandModal.js";
import ViewPRNModal from "./components/Inventory/modals/ViewPRNModal.js";
import AddPRNModal from "./components/Inventory/modals/AddPRN.js";
import AddBatchModal from "./components/Inventory/modals/batch/AddBatchModal.js";
import UpdateGrnSupplierModal from "./components/Inventory/modals/UpdateSupplierGRN.js";
import AddAdjustmentModal from "./components/Inventory/modals/AddAdjustmentModal.js";
import UnitAddModal from "./components/Inventory/modals/unitAddModal.js";



function AppInitializer() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: JSON.parse(user), token }
      });
    }
  }, [dispatch]);
  return null;
}


function AppContent() {
  const dispatch = useDispatch();
  const { darkMode, activeModal } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  React.useEffect(() => {
    if (!isAuthenticated && !activeModal) {
      dispatch(openModal("LOGIN"));
    } else if (isAuthenticated && activeModal === "LOGIN") {
      dispatch(closeModal());
    }
  }, [isAuthenticated, activeModal, dispatch]);
  const renderModal = () => {
    switch (activeModal) {
      case "LOGIN":
        return <LoginModal />;
      case "SCANNER":
        return <ScannerModal />;
      case "SUBCATEGORY":
        return <SubCategoryAddModal />;
      case "PAYMENT":
        return <PaymentModal />;
      case "INVOICE":
        return <InvoiceModal />;
      case "CASH_CALC":
        return <CashCalcModal />;
      case "CUSTOMER":
        return <CustomerModal />;
      case "INVENTORY":
        return <InventoryModal />;
      case "HISTORY":
        return <HistoryModal />;
      case "REPORTS":
        return <ReportsModal />;
      case "SETTINGS":
        return <SettingsModal />;
      case "RETURNS":
        return <ReturnsModal />;
      case "DISCOUNT":
        return <DiscountModal />;
      case "COUPON":
        return <CouponModal />;
      case "ADD_WAREHOUSE":
        return <AddWarehouseModal />;
      case "ADD_PRODUCT":
        return <AddProductModal />;
      case "FEATURES":
        return <FeaturesModal />;
         case "ADD_PRODUCT":
        return <AddProductModal />;
      case "ADD_INVENTORY_PRODUCT":
        return <AddInventoryProductModal />;
      case "UPDATE_INVENTORY_PRODUCT":
        return <UpdateProductModal />;
      case "ADD_PRODUCT_DETAIL":
        return <AddProductDetailModal />;
      case "UPDATE_PRODUCT_DETAIL":
        return <UpdateProductDetailModal />;
      case "ADD_BRAND":
        return <AddBrandModal />;
      case "ADD_BATCH":
        return <AddBatchModal />;
      case "ADD_PRN":
        return <AddPRNModal />;
      case "ADD_GRN":
        return <AddGRNModal />;
      case "ERP":
        return <ERPSystemModal />;
      case "ADD_WAREHOUSE":
        return <AddWarehouseModal />;
      case "UPDATE_WAREHOUSE":
        return <UpdateWarehouseModal />;
      case "ADD_GRN":
        return <AddGRNModal />;
      case "VIEW_PRN":
        return <ViewPRNModal />;
      case "ADD_PRN":
        return <AddPRNModal />;
        case "ADD_PRODUCT":
        return <AddProductModal />;
      case "ADD_INVENTORY_PRODUCT":
        return <AddInventoryProductModal />;
      case "UPDATE_INVENTORY_PRODUCT":
        return <UpdateProductModal />;
      case "ADD_PRODUCT_DETAIL":
        return <AddProductDetailModal />;
      case "UPDATE_PRODUCT_DETAIL":
        return <UpdateProductDetailModal />;
      case "ADD_BRAND":
        return <AddBrandModal />;
      case "ADD_BATCH":
        return <AddBatchModal />;
      case "UPDATE_BRAND":
        return <UpdateBrandModal />;
      case "UPDATE_SUPPLIER_GRN":
        return <UpdateGrnSupplierModal />;
      case "ADD_ADJUSTMENT":
        return <AddAdjustmentModal />;
      case "UPDATE_PRODUCT":
        return <UpdateProductModal />
      case "ADD_UNIT":
        return <UnitAddModal />;
      default:
        return null;
    }
  };
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <Layout />
      {renderModal()}
    </div>
  );
}
function App() {
  return (
    <Provider store={store}>
      {/* <AuthProvider> */}
        <CartProvider>
          <ThemeProvider>
            <ModalProvider>
              <AppInitializer />
              <AppContent />
            </ModalProvider>
          </ThemeProvider>
        </CartProvider>
      {/* </AuthProvider> */}
    </Provider>
  );
}
export default App;






// import React from "react";
// import { Provider, useSelector, useDispatch } from "react-redux";
// import store from "./store";
// // import { AuthProvider } from "./reducers/authReducer";
// import { CartProvider } from "./context/CartContext";
// import { ThemeProvider } from "./context/ThemeContext";
// import { ModalProvider } from "./context/ModalContext";
// import Layout from "./components/common/Layout";
// import LoginModal from "./components/modals/LoginModal";
// import ScannerModal from "./components/modals/ScannerModal";
// import PaymentModal from "./components/modals/PaymentModal";
// import InvoiceModal from "./components/modals/InvoiceModal";
// import CashCalcModal from "./components/modals/CashCalcModal";
// import CustomerModal from "./components/modals/CustomerModal";
// import InventoryModal from "./components/modals/InventoryModal";
// import HistoryModal from "./components/modals/HistoryModal";
// import ReportsModal from "./components/modals/ReportsModal";
// import SettingsModal from "./components/modals/SettingsModal";
// import ReturnsModal from "./components/modals/ReturnsModal";
// import CouponModal from "./components/modals/CouponModal";
// import AddProductModal from "./components/modals/AddProductModal";
// import FeaturesModal from "./components/modals/FeaturesModal";
// import ERPSystemModal from "./components/modals/ERPSystemModal";
// import DiscountModal from "./components/modals/DiscountModal";

 
// import { openModal, closeModal } from "./actions/modalActions";
// function AppContent() {
//   const dispatch = useDispatch();
//   const { darkMode, activeModal } = useSelector((state) => state.ui);
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   React.useEffect(() => {
//     if (!isAuthenticated && !activeModal) {
//       dispatch(openModal("LOGIN"));
//     } else if (isAuthenticated && activeModal === "LOGIN") {
//       dispatch(closeModal());
//     }
//   }, [isAuthenticated, activeModal, dispatch]);

//   const renderModal = () => {
//     switch (activeModal) {
//       case "LOGIN":
//         return <LoginModal />;
//       case "SCANNER":
//         return <ScannerModal />;
//       case "PAYMENT":
//         return <PaymentModal />;
//       case "INVOICE":
//         return <InvoiceModal />;
//       case "CASH_CALC":
//         return <CashCalcModal />;
//       case "CUSTOMER":
//         return <CustomerModal />;
//       case "INVENTORY":
//         return <InventoryModal />;
//       case "HISTORY":
//         return <HistoryModal />;
//       case "REPORTS":
//         return <ReportsModal />;
//       case "SETTINGS":
//         return <SettingsModal />;
//       case "RETURNS":
//         return <ReturnsModal />;
//       case "DISCOUNT":
//         return <DiscountModal />;
//       case "COUPON":
//         return <CouponModal />;
//       case "ADD_PRODUCT":
//         return <AddProductModal />;
//       case "FEATURES":
//         return <FeaturesModal />;
//       case "ERP":
//         return <ERPSystemModal />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
//       }`}
//     >
//       <Layout />
//       {renderModal()}
//     </div>
//   );
// }

// function App() {
//   return (
//     <Provider store={store}>
//       {/* <AuthProvider> */}
//         <CartProvider>
//           <ThemeProvider>
//             <ModalProvider>
//               <AppContent />
//             </ModalProvider>
//           </ThemeProvider>
//         </CartProvider>
//       {/* </AuthProvider> */}
//     </Provider>
//   );
// }

// export default App;





// import React from "react";
// import { Provider, useSelector, useDispatch } from "react-redux";
// import store from "./store";
// // import { AuthProvider } from "./reducers/authReducer";
// import { CartProvider } from "./context/CartContext";
// import { ThemeProvider } from "./context/ThemeContext";
// import { ModalProvider } from "./context/ModalContext";
// import Layout from "./components/common/Layout";
// import LoginModal from "./components/modals/LoginModal";
// import ScannerModal from "./components/modals/ScannerModal";
// import PaymentModal from "./components/modals/PaymentModal";
// import InvoiceModal from "./components/modals/InvoiceModal";
// import CashCalcModal from "./components/modals/CashCalcModal";
// import CustomerModal from "./components/modals/CustomerModal";
// import InventoryModal from "./components/modals/InventoryModal";
// import HistoryModal from "./components/modals/HistoryModal";
// import ReportsModal from "./components/modals/ReportsModal";
// import SettingsModal from "./components/modals/SettingsModal";
// import ReturnsModal from "./components/modals/ReturnsModal";
// import CouponModal from "./components/modals/CouponModal";
// import AddProductModal from "./components/modals/AddProductModal";
// import FeaturesModal from "./components/modals/FeaturesModal";
// import ERPSystemModal from "./components/modals/ERPSystemModal";
// import DiscountModal from "./components/modals/DiscountModal";
// import { LOGIN_SUCCESS } from "./constants/authConstants";
// import { openModal, closeModal } from "./actions/modalActions";

// //admin
// import AddWarehouseModal from "../src/components/admin/modals/AddWarehouseModal.js";
// import AddGRNModal from "../src/components/admin/modals/AddGRN.js";

// //invetory product
// import AddInventoryProductModal from "./components/admin/modals/InventoryProduct/AddInventoryProductModal.js";
// import UpdateProductModal from "./components/admin/modals/InventoryProduct/UpdateProductModal.js";
// import { AddProductDetailModal } from "./components/admin/modals/InventoryProduct/AddProductDetailModal.js";
// import { UpdateProductDetailModal } from "./components/admin/modals/InventoryProduct/UpdateProductDetailModal.js";
// import AddBrandModal from "./components/admin/modals/brand/AddBrandModal.js";
// import ViewPRNModal from "./components/admin/modals/ViewPRNModal.js";
// import AddPRNModal from "./components/admin/modals/AddPRN.js";

// function AppInitializer() {
//   const dispatch = useDispatch();
//   React.useEffect(() => {
//     const user = localStorage.getItem("user");
//     const token = localStorage.getItem("token");
//     if (user && token) {
//       dispatch({
//         type: LOGIN_SUCCESS,
//         payload: { user: JSON.parse(user), token },
//       });
//     }
//   }, [dispatch]);
//   return null;
// }
// function AppContent() {
//   const dispatch = useDispatch();
//   const { darkMode, activeModal } = useSelector((state) => state.ui);
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   React.useEffect(() => {
//     if (!isAuthenticated && !activeModal) {
//       dispatch(openModal("LOGIN"));
//     } else if (isAuthenticated && activeModal === "LOGIN") {
//       dispatch(closeModal());
//     }
//   }, [isAuthenticated, activeModal, dispatch]);
//   const renderModal = () => {
//     switch (activeModal) {
//       case "LOGIN":
//         return <LoginModal />;
//       case "SCANNER":
//         return <ScannerModal />;
//       case "PAYMENT":
//         return <PaymentModal />;
//       case "INVOICE":
//         return <InvoiceModal />;
//       case "CASH_CALC":
//         return <CashCalcModal />;
//       case "CUSTOMER":
//         return <CustomerModal />;
//       case "INVENTORY":
//         return <InventoryModal />;
//       case "HISTORY":
//         return <HistoryModal />;
//       case "REPORTS":
//         return <ReportsModal />;
//       case "SETTINGS":
//         return <SettingsModal />;
//       case "RETURNS":
//         return <ReturnsModal />;
//       case "DISCOUNT":
//         return <DiscountModal />;
//       case "COUPON":
//         return <CouponModal />;
//       case "ADD_PRODUCT":
//         return <AddProductModal />;
//       case "ADD_INVENTORY_PRODUCT":
//         return <AddInventoryProductModal />;
//       case "UPDATE_INVENTORY_PRODUCT":
//         return <UpdateProductModal />;
//       case "ADD_PRODUCT_DETAIL":
//         return <AddProductDetailModal />;
//       case "UPDATE_PRODUCT_DETAIL":
//         return <UpdateProductDetailModal />;
//       case "ADD_BRAND":
//         return <AddBrandModal />;
//       case "FEATURES":
//         return <FeaturesModal />;
//       case "ERP":
//         return <ERPSystemModal />;
//       case "ADD_WAREHOUSE":
//         return <AddWarehouseModal />;
//       case "UPDATE_WAREHOUSE":
//         return <UpdateWarehouseModal />;
//       case "ADD_GRN":
//         return <AddGRNModal />;
//       case "VIEW_PRN":
//         return <ViewPRNModal />;
//       case "ADD_PRN":
//         return <AddPRNModal />;
//       default:
//         return null;
//     }
//   };
//   return (
//     <div
//       className={`min-h-screen ${
//         darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
//       }`}
//     >
//       <Layout />
//       {renderModal()}
//     </div>
//   );
// }
// function App() {
//   return (
//     <Provider store={store}>
//       {/* <AuthProvider> */}
//       <CartProvider>
//         <ThemeProvider>
//           <ModalProvider>
//             <AppInitializer />
//             <AppContent />
//           </ModalProvider>
//         </ThemeProvider>
//       </CartProvider>
//       {/* </AuthProvider> */}
//     </Provider>
//   );
// }
// export default App;

// import React from "react";
// import { Provider, useSelector, useDispatch } from "react-redux";
// import store from "./store";
// // import { AuthProvider } from "./reducers/authReducer";
// import { CartProvider } from "./context/CartContext";
// import { ThemeProvider } from "./context/ThemeContext";
// import { ModalProvider } from "./context/ModalContext";
// import Layout from "./components/common/Layout";
// import LoginModal from "./components/modals/LoginModal";
// import ScannerModal from "./components/modals/ScannerModal";
// import PaymentModal from "./components/modals/PaymentModal";
// import InvoiceModal from "./components/modals/InvoiceModal";
// import CashCalcModal from "./components/modals/CashCalcModal";
// import CustomerModal from "./components/modals/CustomerModal";
// import InventoryModal from "./components/modals/InventoryModal";
// import HistoryModal from "./components/modals/HistoryModal";
// import ReportsModal from "./components/modals/ReportsModal";
// import SettingsModal from "./components/modals/SettingsModal";
// import ReturnsModal from "./components/modals/ReturnsModal";
// import CouponModal from "./components/modals/CouponModal";
// import AddProductModal from "./components/modals/AddProductModal";
// import FeaturesModal from "./components/modals/FeaturesModal";
// import ERPSystemModal from "./components/modals/ERPSystemModal";
// import DiscountModal from "./components/modals/DiscountModal";

// import { openModal, closeModal } from "./actions/modalActions";
// function AppContent() {
//   const dispatch = useDispatch();
//   const { darkMode, activeModal } = useSelector((state) => state.ui);
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   React.useEffect(() => {
//     if (!isAuthenticated && !activeModal) {
//       dispatch(openModal("LOGIN"));
//     } else if (isAuthenticated && activeModal === "LOGIN") {
//       dispatch(closeModal());
//     }
//   }, [isAuthenticated, activeModal, dispatch]);

//   const renderModal = () => {
//     switch (activeModal) {
//       case "LOGIN":
//         return <LoginModal />;
//       case "SCANNER":
//         return <ScannerModal />;
//       case "PAYMENT":
//         return <PaymentModal />;
//       case "INVOICE":
//         return <InvoiceModal />;
//       case "CASH_CALC":
//         return <CashCalcModal />;
//       case "CUSTOMER":
//         return <CustomerModal />;
//       case "INVENTORY":
//         return <InventoryModal />;
//       case "HISTORY":
//         return <HistoryModal />;
//       case "REPORTS":
//         return <ReportsModal />;
//       case "SETTINGS":
//         return <SettingsModal />;
//       case "RETURNS":
//         return <ReturnsModal />;
//       case "DISCOUNT":
//         return <DiscountModal />;
//       case "COUPON":
//         return <CouponModal />;
//       case "ADD_PRODUCT":
//         return <AddProductModal />;
//       case "FEATURES":
//         return <FeaturesModal />;
//       case "ERP":
//         return <ERPSystemModal />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
//       }`}
//     >
//       <Layout />
//       {renderModal()}
//     </div>
//   );
// }

// function App() {
//   return (
//     <Provider store={store}>
//       {/* <AuthProvider> */}
//         <CartProvider>
//           <ThemeProvider>
//             <ModalProvider>
//               <AppContent />
//             </ModalProvider>
//           </ThemeProvider>
//         </CartProvider>
//       {/* </AuthProvider> */}
//     </Provider>
//   );
// }

// export default App;
