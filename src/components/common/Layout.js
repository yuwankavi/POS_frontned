// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import ProductsSection from "../sections/ProductsSection";
// import CartSection from "../sections/CartSection";
// import UserAccessPage from "../sections/UserAccessPage";
// import AddProduct from "../../Pages/Add_Product/product";
// import Supplier from "../../Pages/Supplier/Supplier";
// import Customer from "../../Pages/CustomerManagement/custom";
// import History from "../../Pages/History/history";
// import Return from "../../Pages/Return/return";
// import Invoice from "../../Pages/Invoice/invoice";
// import Settings from "../../Pages/Settings/Settings";
// import Help from "../../Pages/Help/help";
// import Category from "../../Pages/inventory/Catergory";
// import Product from "../../Pages/inventory/Product/ProductDetails";
// import WareHouse from "../../Pages/inventory/WareHouse";
// import GRN from "../../Pages/inventory/Store_Transaction/GRN";
// import MRQ from "../../Pages/inventory/Store_Transaction/MRQ";
// import PRN from "../../Pages/inventory/Store_Transaction/PRNS";
// import MRN from "../../Pages/inventory/Store_Transaction/MRN";
// import StockAjustment from "../../Pages/inventory/Store_Transaction/StockAdjustment";
// import Writoff from "../../Pages/inventory/Store_Transaction/Writoff";
// import Daily_sum from "../../Pages/Report/Daily_Summary";
// import Reorder from "../../Pages/Report/Reorder-level";
// import TotalPur from "../../Pages/Report/Total_Purchasing";
// import Batches from "../../Pages/inventory/Product/ProductBatches";
// import Brand from "../../Pages/inventory/Product/ProductBrand";
// import Bincard from "../../Pages/inventory/Bincard";
// import Barcode from "../../Pages/inventory/BarcodeGenerator";
// import Dashboard from "../../Pages/inventory/dashboard";
// import Unit from "../../Pages/inventory/Product/Unit";

// const Layout = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { tabs } = useSelector((state) => state.cart);
//   const [activePage, setActivePage] = useState("POS");
//   const [cartHidden, setCartHidden] = useState(false);
//   // Determine default page based on user type
//   useEffect(() => {
//     let userType = "C"; 
//     if (user && user.userType) {
//       userType = user.userType;
//     } else {
//       const userData = localStorage.getItem("user");
//       if (userData) {
//         try {
//           const parsedUser = JSON.parse(userData);
//           userType = parsedUser.userType || "C";
//         } catch (err) {
//         }
//       }
//     }
//     if (userType === "A") {
//       setActivePage("DASHBOARD");
//     } else {
//       setActivePage("POS");
//     }
//   }, [user]);
//   const hasItemsInAnyTab = tabs.some((tab) => tab.items && tab.items.length > 0);
//   return (
//     <div className="container mx-auto p-2 max-w-screen-xl h-screen flex flex-col">
//       <Header />
//       <div className="flex flex-1 gap-2 md:gap-4 lg:gap-1 mt-2 overflow-hidden">
//         {/* Sidebar */}
//         <div className="flex-shrink-0 w-30">
//           <Sidebar setActivePage={setActivePage} />
//         </div>
//         {/* Main Content */}
//         <div
//           className={`flex-1 overflow-hidden transition-all duration-300 ${
//             cartHidden || !hasItemsInAnyTab || activePage !== "POS" ? "w-full" : ""
//           }`}
//         >
//           {activePage === "POS" && (
//             <ProductsSection
//               onExpandProduct={() => setCartHidden(true)}
//               onProductAdded={() => setCartHidden(false)}
//               onCancelExpand={() => setCartHidden(true)}
//             />
//           )}
//           {activePage === "DASHBOARD" && <Dashboard />}
//           {activePage === "USER_ACCESS" && <UserAccessPage />}
//           {activePage === "ADD_PRODUCT" && <AddProduct />}
//           {activePage === "SUPPLIER" && <Supplier />}
//           {activePage === "CUSTOMER" && <Customer />}
//           {activePage === "HISTORY" && <History />}
//           {activePage === "RETURNS" && <Return />}
//           {activePage === "PRINT_INVOICE" && <Invoice />}
//           {activePage === "SETTINGS" && <Settings />}
//           {activePage === "HELP" && <Help />}
//           {/* Inventory pages */}
//           {activePage.endsWith("CATEGORY") && <Category />}
//           {activePage.endsWith("DASHBOARD") && <Dashboard />}
//           {activePage.endsWith("PRODUCT_DETAILS") && <Product />}
//           {activePage.endsWith("WAREHOUSE") && <WareHouse />}
//           {activePage.endsWith("BATCHES") && <Batches />}
//           {activePage.endsWith("PRODUCT_BRAND") && <Brand />}
//           {activePage.endsWith("UNIT") && <Unit />}
//           {activePage.endsWith("PURCHASE_ITEM") && <GRN />}
//           {activePage.endsWith("SALES_INVOICE") && <MRQ />}
//           {activePage.endsWith("PURCHASE_RETURN") && <PRN />}
//           {activePage.endsWith("SALES_RETURN") && <MRN />}
//           {activePage.endsWith("STOCK_ADJUSTMENT") && <StockAjustment />}
//           {activePage.endsWith("WRITE_OFF") && <Writoff />}
//           {activePage.endsWith("BINCARD") && <Bincard />}
//           {activePage.endsWith("BARCODE") && <Barcode />}
//           {/* Report pages */}
//           {activePage.endsWith("REORDER_LEVEL") && <Reorder />}
//           {activePage.endsWith("DAILY_SUMMARY") && <Daily_sum />}
//           {activePage.endsWith("TOTAL_PURCHASING") && <TotalPur />}
//         </div>
//         {/* Cart Section */}
//         {activePage === "POS" && !cartHidden && hasItemsInAnyTab && (
//           <div className="flex-shrink-0 w-80 transition-all duration-300 overflow-y-auto">
//             <CartSection />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default Layout;



import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProductsSection from "../sections/ProductsSection";
import CartSection from "../sections/CartSection";
import UserAccessPage from "../sections/UserAccessPage";
import AddProduct from "../../Pages/Add_Product/product";
import Supplier from "../../Pages/Supplier/Supplier";
import Customer from "../../Pages/CustomerManagement/custom";
import History from "../../Pages/History/history";
import Return from "../../Pages/Return/return";
import Invoice from "../../Pages/Invoice/invoice";
import Settings from "../../Pages/Settings/Settings";
import Help from "../../Pages/Help/help";
import Category from "../../Pages/inventory/Catergory";
import Product from "../../Pages/inventory/Product/ProductDetails";
import WareHouse from "../../Pages/inventory/WareHouse";
import GRN from "../../Pages/inventory/Store_Transaction/GRN";
import MRQ from "../../Pages/inventory/Store_Transaction/MRQ";
import PRN from "../../Pages/inventory/Store_Transaction/PRNS";
import MRN from "../../Pages/inventory/Store_Transaction/MRN";
import StockAjustment from "../../Pages/inventory/Store_Transaction/StockAdjustment";
import Writoff from "../../Pages/inventory/Store_Transaction/Writoff";
import Daily_sum from "../../Pages/Report/Daily_Summary";
import Reorder from "../../Pages/Report/Reorder-level";
import ExpLevel from "../../Pages/Report/exp";
import TotalPur from "../../Pages/Report/Total_Purchasing";
import CashierReport from "../../Pages/Report/Cashier";
import ItemsReport from "../../Pages/Report/Items";
import CategoriesReport from "../../Pages/Report/Categories";
import Batches from "../../Pages/inventory/Product/ProductBatches";
import Brand from "../../Pages/inventory/Product/ProductBrand";
import Bincard from "../../Pages/inventory/Bincard";
import Barcode from "../../Pages/inventory/BarcodeGenerator";
import Dashboard from "../../Pages/inventory/dashboard";
import Unit from "../../Pages/inventory/Product/Unit";
import Invoice_Return from "../../Pages/Invoice_return/InvoiceReturn";

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const { tabs } = useSelector((state) => state.cart);
  const [activePage, setActivePage] = useState("POS");
  const [cartHidden, setCartHidden] = useState(false);
  
  // Determine default page based on user type
  useEffect(() => {
    let userType = "C"; 
    if (user && user.userType) {
      userType = user.userType;
    } else {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          userType = parsedUser.userType || "C";
        } catch (err) {
        }
      }
    }
    if (userType === "A") {
      setActivePage("DASHBOARD");
    } else {
      setActivePage("POS");
    }
  }, [user]);

  return (
    <div className="container mx-auto p-2 max-w-screen-xl h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 gap-2 md:gap-4 lg:gap-1 mt-2 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-30">
          <Sidebar setActivePage={setActivePage} />
        </div>
        
        {/* Main Content */}
        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ${
            cartHidden || activePage !== "POS" ? "w-full" : ""
          }`}
        >
          {activePage === "POS" && (
            <ProductsSection
              onExpandProduct={() => setCartHidden(true)}
              onProductAdded={() => setCartHidden(false)}
              onCancelExpand={() => setCartHidden(true)}
            />
          )}
          {activePage === "DASHBOARD" && <Dashboard />}
          {activePage === "INVOICE_RETURN" && <Invoice_Return />}
          {activePage === "USER_ACCESS" && <UserAccessPage />}
          {activePage === "ADD_PRODUCT" && <AddProduct />}
          {activePage === "SUPPLIER" && <Supplier />}
          {activePage === "CUSTOMER" && <Customer />}
          {activePage === "HISTORY" && <History />}
          {activePage === "RETURNS" && <Return />}
          {activePage === "PRINT_INVOICE" && <Invoice />}
          {activePage === "SETTINGS" && <Settings />}
          {activePage === "HELP" && <Help />}
          {/* Inventory pages */}
          {activePage === "INVENTORY_CATEGORY" && <Category />}
          {activePage.endsWith("DASHBOARD") && <Dashboard />}
          {activePage.endsWith("PRODUCT_DETAILS") && <Product />}
          {activePage.endsWith("WAREHOUSE") && <WareHouse />}
          {activePage.endsWith("BATCHES") && <Batches />}
          {activePage.endsWith("PRODUCT_BRAND") && <Brand />}
          {activePage.endsWith("UNIT") && <Unit />}
          {activePage.endsWith("PURCHASE_ITEM") && <GRN />}
          {activePage.endsWith("SALES_INVOICE") && <MRQ />}
          {activePage.endsWith("PURCHASE_RETURN") && <PRN />}
          {activePage.endsWith("SALES_RETURN") && <MRN />}
          {activePage.endsWith("STOCK_ADJUSTMENT") && <StockAjustment />}
          {activePage.endsWith("WRITE_OFF") && <Writoff />}
          {activePage.endsWith("BINCARD") && <Bincard />}
          {activePage.endsWith("BARCODE") && <Barcode />}
          {/* Report pages */}
          {activePage.endsWith("EXP_LEVEL") && <ExpLevel />}
          {activePage === "REPORTS_CASHIER" && <CashierReport />}
          {activePage === "REPORTS_ITEM" && <ItemsReport />}
          {activePage === "REPORTS_CATEGORY" && <CategoriesReport />}
          {activePage.endsWith("REORDER_LEVEL") && <Reorder />}
          {activePage.endsWith("DAILY_SUMMARY") && <Daily_sum />}
          {activePage.endsWith("TOTAL_PURCHASING") && <TotalPur />}
        </div>
        
        {/* Cart Section - Always show on POS page, regardless of items */}
        {activePage === "POS" && !cartHidden && (
          <div className="flex-shrink-0 w-80 transition-all duration-300 overflow-y-auto">
            <CartSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;