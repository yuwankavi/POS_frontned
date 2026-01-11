


export const purchaseOrders = [
  {
    ppo_id: 1,                           
    ppo_supplier_id: 101,                
    ppo_order_date: "2023-07-01",
    ppo_status: "OPEN",
    ppo_created_date: "2023-07-01",
    ppo_created_by: 1,                   
    ppo_updated_date: "2023-07-15",
    ppo_updated_by: 1
  },
  {
    ppo_id: 2,
    ppo_supplier_id: 102,
    ppo_order_date: "2023-07-05",
    ppo_status: "PARTIAL",
    ppo_created_date: "2023-07-05",
    ppo_created_by: 2,
    ppo_updated_date: "2023-08-10",
    ppo_updated_by: 2
  },
  {
    ppo_id: 3,
    ppo_supplier_id: 103,
    ppo_order_date: "2023-07-10",
    ppo_status: "CLOSED",
    ppo_created_date: "2023-07-10",
    ppo_created_by: 1,
    ppo_updated_date: "2023-08-20",
    ppo_updated_by: 3
  },
  {
    ppo_id: 4,
    ppo_supplier_id: 101,
    ppo_order_date: "2023-07-15",
    ppo_status: "CANCELLED",
    ppo_created_date: "2023-07-15",
    ppo_created_by: 2,
    ppo_updated_date: "2023-07-20",
    ppo_updated_by: 2
  }
];


export const purchaseOrderDetails = [
  
  {
    ppd_id: 1,                          
    ppd_ppo_id: 1,                      
    ppd_product_code: 1001,             
    ppd_qty_ordered: 50.00,
    ppd_unit_price: 25000.50,
    ppd_created_date: "2023-07-01",
    ppd_created_by: 1,
    ppd_updated_date: null,
    ppd_updated_by: null
  },
  {
    ppd_id: 2,
    ppd_ppo_id: 1,
    ppd_product_code: 1002,
    ppd_qty_ordered: 100.00,
    ppd_unit_price: 15000.75,
    ppd_created_date: "2023-07-01",
    ppd_created_by: 1,
    ppd_updated_date: null,
    ppd_updated_by: null
  },
  
  {
    ppd_id: 3,
    ppd_ppo_id: 2,
    ppd_product_code: 1003,
    ppd_qty_ordered: 25.00,
    ppd_unit_price: 120000.00,
    ppd_created_date: "2023-07-05",
    ppd_created_by: 2,
    ppd_updated_date: "2023-08-10",
    ppd_updated_by: 2
  },
  {
    ppd_id: 4,
    ppd_ppo_id: 2,
    ppd_product_code: 1004,
    ppd_qty_ordered: 75.00,
    ppd_unit_price: 825.00,
    ppd_created_date: "2023-07-05",
    ppd_created_by: 2,
    ppd_updated_date: null,
    ppd_updated_by: null
  },
  
  {
    ppd_id: 5,
    ppd_ppo_id: 3,
    ppd_product_code: 1001,
    ppd_qty_ordered: 200.00,
    ppd_unit_price: 24000.00,
    ppd_created_date: "2023-07-10",
    ppd_created_by: 1,
    ppd_updated_date: null,
    ppd_updated_by: null
  },
  
  {
    ppd_id: 6,
    ppd_ppo_id: 4,
    ppd_product_code: 1005,
    ppd_qty_ordered: 30.00,
    ppd_unit_price: 92669.99,
    ppd_created_date: "2023-07-15",
    ppd_created_by: 2,
    ppd_updated_date: null,
    ppd_updated_by: null
  }
];


export const getPurchaseOrderDetails = (ppoId) => {
  return purchaseOrderDetails.filter(detail => detail.ppd_ppo_id === ppoId);
};


export const getFullPurchaseOrder = (ppoId) => {
  const purchaseOrder = purchaseOrders.find(po => po.ppo_id === ppoId);
  const details = getPurchaseOrderDetails(ppoId);
  
  return {
    ...purchaseOrder,
    details: details
  };
};


export const supplierDetails = [
  { psd_supplier_code: 101, psd_supplier_name: "ABC Electronics Ltd" },
  { psd_supplier_code: 102, psd_supplier_name: "XYZ Manufacturing Co" },
  { psd_supplier_code: 103, psd_supplier_name: "Global Parts Supply" }
];

export const productCatalogue = [
  { ppc_product_code: 1001, ppc_product_name: "Laptop Computer", ppc_category: "Electronics" },
  { ppc_product_code: 1002, ppc_product_name: "Office Chair", ppc_category: "Furniture" },
  { ppc_product_code: 1003, ppc_product_name: "Printer Toner", ppc_category: "Supplies" },
  { ppc_product_code: 1004, ppc_product_name: "USB Cable", ppc_category: "Accessories" },
  { ppc_product_code: 1005, ppc_product_name: "Monitor Stand", ppc_category: "Accessories" }
];

export const userDetails = [
  { user_id: 1, user_name: "John Smith", user_role: "Purchase Manager" },
  { user_id: 2, user_name: "Jane Doe", user_role: "Purchase Officer" },
  { user_id: 3, user_name: "Mike Johnson", user_role: "Supervisor" }
];