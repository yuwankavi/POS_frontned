

export const returnsData = {
  
  documentTypes: [
    {
      pdt_document_type: 'RTN',
      pdt_description: 'Sales Return',
      pdt_status: 'A',
      pdt_created_date: '2024-01-15T08:30:00.000Z',
      pdt_created_by: 1001,
      pdt_updated_date: null,
      pdt_updated_by: null
    },
    {
      pdt_document_type: 'PRN',
      pdt_description: 'Purchase Return',
      pdt_status: 'A',
      pdt_created_date: '2024-01-15T08:30:00.000Z',
      pdt_created_by: 1001,
      pdt_updated_date: null,
      pdt_updated_by: null
    }
  ],

  
  documentDetails: [
    {
      pdd_wh_code: 'W01',
      pdd_document_type: 'RTN',
      pdd_document_no: 1001,
      pdd_date: '2024-03-15T10:30:00.000Z',
      pdd_refdoc_type: 'INV',
      pdd_refloc_code: 'W01',
      pdd_refdoc_no: 5023,
      pdd_supplier_code: null,
      pdd_customer_id: 2001,
      pdd_invoice_no: 'INV-2024-5023',
      pdd_invoice_date: '2024-03-10T00:00:00.000Z',
      pdd_status: 'A',
      pdd_print_status: 'Y',
      pdd_created_date: '2024-03-15T10:30:00.000Z',
      pdd_created_by: 1002,
      pdd_updated_date: null,
      pdd_updated_by: null
    },
    {
      pdd_wh_code: 'W02',
      pdd_document_type: 'PRN',
      pdd_document_no: 2001,
      pdd_date: '2024-03-16T14:15:00.000Z',
      pdd_refdoc_type: 'GRN',
      pdd_refloc_code: 'W02',
      pdd_refdoc_no: 3045,
      pdd_supplier_code: 1005,
      pdd_customer_id: null,
      pdd_invoice_no: 'SUP-INV-2024-789',
      pdd_invoice_date: '2024-03-12T00:00:00.000Z',
      pdd_status: 'A',
      pdd_print_status: 'N',
      pdd_created_date: '2024-03-16T14:15:00.000Z',
      pdd_created_by: 1003,
      pdd_updated_date: null,
      pdd_updated_by: null
    },
    {
      pdd_wh_code: 'W01',
      pdd_document_type: 'RTN',
      pdd_document_no: 1002,
      pdd_date: '2024-03-17T11:45:00.000Z',
      pdd_refdoc_type: 'INV',
      pdd_refloc_code: 'W01',
      pdd_refdoc_no: 5029,
      pdd_supplier_code: null,
      pdd_customer_id: 2003,
      pdd_invoice_no: 'INV-2024-5029',
      pdd_invoice_date: '2024-03-14T00:00:00.000Z',
      pdd_status: 'A',
      pdd_print_status: 'Y',
      pdd_created_date: '2024-03-17T11:45:00.000Z',
      pdd_created_by: 1002,
      pdd_updated_date: null,
      pdd_updated_by: null
    },
    {
      pdd_wh_code: 'W03',
      pdd_document_type: 'RTN',
      pdd_document_no: 3001,
      pdd_date: '2024-03-18T09:15:00.000Z',
      pdd_refdoc_type: 'INV',
      pdd_refloc_code: 'W03',
      pdd_refdoc_no: 5035,
      pdd_supplier_code: null,
      pdd_customer_id: 2005,
      pdd_invoice_no: 'INV-2024-5035',
      pdd_invoice_date: '2024-03-16T00:00:00.000Z',
      pdd_status: 'I',
      pdd_print_status: 'N',
      pdd_created_date: '2024-03-18T09:15:00.000Z',
      pdd_created_by: 1004,
      pdd_updated_date: '2024-03-18T14:30:00.000Z',
      pdd_updated_by: 1004
    },
    {
      pdd_wh_code: 'W02',
      pdd_document_type: 'PRN',
      pdd_document_no: 2002,
      pdd_date: '2024-03-19T16:20:00.000Z',
      pdd_refdoc_type: 'GRN',
      pdd_refloc_code: 'W02',
      pdd_refdoc_no: 3050,
      pdd_supplier_code: 1008,
      pdd_customer_id: null,
      pdd_invoice_no: 'SUP-INV-2024-892',
      pdd_invoice_date: '2024-03-17T00:00:00.000Z',
      pdd_status: 'C',
      pdd_print_status: 'Y',
      pdd_created_date: '2024-03-19T16:20:00.000Z',
      pdd_created_by: 1005,
      pdd_updated_date: '2024-03-19T17:45:00.000Z',
      pdd_updated_by: 1003
    }
  ],

  
  transactionDetails: [
    
    {
      ptd_wh_code: 'W01',
      ptd_document_type: 'RTN',
      ptd_document_no: 1001,
      ptd_product_code: 10001,
      ptd_line: 1,
      ptd_batch_id: 50001,
      ptd_date: '2024-03-15T10:30:00.000Z',
      ptd_quantity: -2.00,
      ptd_value: -150.00,
      ptd_average_rate: 75.00,
      ptd_balance_quantity: 48.00,
      ptd_status: 'A',
      ptd_created_date: '2024-03-15T10:30:00.000Z',
      ptd_created_by: 1002,
      ptd_updated_date: null,
      ptd_updated_by: null
    },
    {
      ptd_wh_code: 'W01',
      ptd_document_type: 'RTN',
      ptd_document_no: 1001,
      ptd_product_code: 10005,
      ptd_line: 2,
      ptd_batch_id: 50005,
      ptd_date: '2024-03-15T10:30:00.000Z',
      ptd_quantity: -1.00,
      ptd_value: -25.50,
      ptd_average_rate: 25.50,
      ptd_balance_quantity: 24.00,
      ptd_status: 'A',
      ptd_created_date: '2024-03-15T10:30:00.000Z',
      ptd_created_by: 1002,
      ptd_updated_date: null,
      ptd_updated_by: null
    },
    
    {
      ptd_wh_code: 'W02',
      ptd_document_type: 'PRN',
      ptd_document_no: 2001,
      ptd_product_code: 20001,
      ptd_line: 1,
      ptd_batch_id: 60001,
      ptd_date: '2024-03-16T14:15:00.000Z',
      ptd_quantity: -5.00,
      ptd_value: -450.00,
      ptd_average_rate: 90.00,
      ptd_balance_quantity: 95.00,
      ptd_status: 'A',
      ptd_created_date: '2024-03-16T14:15:00.000Z',
      ptd_created_by: 1003,
      ptd_updated_date: null,
      ptd_updated_by: null
    },
    {
      ptd_wh_code: 'W02',
      ptd_document_type: 'PRN',
      ptd_document_no: 2001,
      ptd_product_code: 20003,
      ptd_line: 2,
      ptd_batch_id: 60003,
      ptd_date: '2024-03-16T14:15:00.000Z',
      ptd_quantity: -3.00,
      ptd_value: -180.00,
      ptd_average_rate: 60.00,
      ptd_balance_quantity: 47.00,
      ptd_status: 'A',
      ptd_created_date: '2024-03-16T14:15:00.000Z',
      ptd_created_by: 1003,
      ptd_updated_date: null,
      ptd_updated_by: null
    },
    {
      ptd_wh_code: 'W02',
      ptd_document_type: 'PRN',
      ptd_document_no: 2001,
      ptd_product_code: 20007,
      ptd_line: 3,
      ptd_batch_id: null,
      ptd_date: '2024-03-16T14:15:00.000Z',
      ptd_quantity: -1.00,
      ptd_value: -125.00,
      ptd_average_rate: 125.00,
      ptd_balance_quantity: 19.00,
      ptd_status: 'A',
      ptd_created_date: '2024-03-16T14:15:00.000Z',
      ptd_created_by: 1003,
      ptd_updated_date: null,
      ptd_updated_by: null
    },
    
    {
      ptd_wh_code: 'W01',
      ptd_document_type: 'RTN',
      ptd_document_no: 1002,
      ptd_product_code: 10003,
      ptd_line: 1,
      ptd_batch_id: 50003,
      ptd_date: '2024-03-17T11:45:00.000Z',
      ptd_quantity: -4.00,
      ptd_value: -200.00,
      ptd_average_rate: 50.00,
      ptd_balance_quantity: 36.00,
      ptd_status: 'A',
      ptd_created_date: '2024-03-17T11:45:00.000Z',
      ptd_created_by: 1002,
      ptd_updated_date: null,
      ptd_updated_by: null
    },
    {
      ptd_wh_code: 'W01',
      ptd_document_type: 'RTN',
      ptd_document_no: 1002,
      ptd_product_code: 10009,
      ptd_line: 2,
      ptd_batch_id: null,
      ptd_date: '2024-03-17T11:45:00.000Z',
      ptd_quantity: -2.00,
      ptd_value: -89.90,
      ptd_average_rate: 44.95,
      ptd_balance_quantity: 13.00,
      ptd_status: 'A',
      ptd_created_date: '2024-03-17T11:45:00.000Z',
      ptd_created_by: 1002,
      ptd_updated_date: null,
      ptd_updated_by: null
    },
    
    {
      ptd_wh_code: 'W03',
      ptd_document_type: 'RTN',
      ptd_document_no: 3001,
      ptd_product_code: 30001,
      ptd_line: 1,
      ptd_batch_id: 70001,
      ptd_date: '2024-03-18T09:15:00.000Z',
      ptd_quantity: -3.00,
      ptd_value: -225.75,
      ptd_average_rate: 75.25,
      ptd_balance_quantity: 22.00,
      ptd_status: 'I',
      ptd_created_date: '2024-03-18T09:15:00.000Z',
      ptd_created_by: 1004,
      ptd_updated_date: '2024-03-18T14:30:00.000Z',
      ptd_updated_by: 1004
    },
    
    {
      ptd_wh_code: 'W02',
      ptd_document_type: 'PRN',
      ptd_document_no: 2002,
      ptd_product_code: 20005,
      ptd_line: 1,
      ptd_batch_id: 60005,
      ptd_date: '2024-03-19T16:20:00.000Z',
      ptd_quantity: -10.00,
      ptd_value: -850.00,
      ptd_average_rate: 85.00,
      ptd_balance_quantity: 65.00,
      ptd_status: 'C',
      ptd_created_date: '2024-03-19T16:20:00.000Z',
      ptd_created_by: 1005,
      ptd_updated_date: '2024-03-19T17:45:00.000Z',
      ptd_updated_by: 1003
    },
    {
      ptd_wh_code: 'W02',
      ptd_document_type: 'PRN',
      ptd_document_no: 2002,
      ptd_product_code: 20012,
      ptd_line: 2,
      ptd_batch_id: null,
      ptd_date: '2024-03-19T16:20:00.000Z',
      ptd_quantity: -6.00,
      ptd_value: -540.00,
      ptd_average_rate: 90.00,
      ptd_balance_quantity: 34.00,
      ptd_status: 'C',
      ptd_created_date: '2024-03-19T16:20:00.000Z',
      ptd_created_by: 1005,
      ptd_updated_date: '2024-03-19T17:45:00.000Z',
      ptd_updated_by: 1003
    }
  ]
};


export const getTransactionDetails = (whCode, docType, docNo) => {
  return returnsData.transactionDetails.filter(
    (transaction) =>
      transaction.ptd_wh_code === whCode &&
      transaction.ptd_document_type === docType &&
      transaction.ptd_document_no === docNo
  );
};

export const getDocumentWithLines = (warehouseCode, documentType, documentNo) => {
  const document = returnsData.documentDetails.find(doc => 
    doc.pdd_wh_code === warehouseCode && 
    doc.pdd_document_type === documentType && 
    doc.pdd_document_no === documentNo
  );
  
  const lines = getTransactionDetails(warehouseCode, documentType, documentNo);
  
  return {
    header: document,
    lines: lines
  };
};

export const getWarehouseReturns = (warehouseCode) => {
  return returnsData.documentDetails.filter(doc => 
    doc.pdd_wh_code === warehouseCode && 
    (doc.pdd_document_type === 'RTN' || doc.pdd_document_type === 'PRN')
  );
};

export const getReturnsSummary = () => {
  const totalDocuments = returnsData.documentDetails.length;
  const totalTransactions = returnsData.transactionDetails.length;
  const totalValue = returnsData.transactionDetails.reduce((sum, transaction) => 
    sum + transaction.ptd_value, 0
  );
  const totalQuantity = returnsData.transactionDetails.reduce((sum, transaction) => 
    sum + transaction.ptd_quantity, 0
  );

  return {
    totalDocuments,
    totalTransactions,
    totalValue,
    totalQuantity,
    salesReturns: returnsData.documentDetails.filter(doc => doc.pdd_document_type === 'RTN').length,
    purchaseReturns: returnsData.documentDetails.filter(doc => doc.pdd_document_type === 'PRN').length
  };
};