// import {
//   RETURN_CREATE_REQUEST,
//   RETURN_CREATE_SUCCESS,
//   RETURN_CREATE_FAIL,
//   RETURN_CREATE_RESET,
//   RETURN_SCAN_INVOICE_REQUEST,
//   RETURN_SCAN_INVOICE_SUCCESS,
//   RETURN_SCAN_INVOICE_FAIL,
//   RETURN_UPDATE_ITEM,
//   RETURN_RESET_FORM,
//   RETURN_SET_INVOICE,
//   RETURN_SET_PREVIEW_INVOICE,
//   RETURN_FETCH_PRODUCT_QTY_REQUEST,
//   RETURN_FETCH_PRODUCT_QTY_SUCCESS,
//   RETURN_FETCH_PRODUCT_QTY_FAIL,
// } from '../constants/returnConstants';
// import { returnService } from '../services/returnService';

// export const createSalesReturn = (returnData) => async (dispatch, getState) => {
//   try {
//     dispatch({
//       type: RETURN_CREATE_REQUEST,
//     });

//     const token = localStorage.getItem('auth-key') || 'REoGAQQ7xp8Fym1uNNF5ltvpBUEoV2CfW1GLwA6Agas=';
    
//     const data = await returnService.createSalesReturn(returnData, token);

//     dispatch({
//       type: RETURN_CREATE_SUCCESS,
//       payload: data,
//     });
 
//     const totalReturnAmount = returnData[0].ReturnLines.reduce((total, line) => {
//       return total + (line.UNIT_PRICE * line.QUANTITY);
//     }, 0);
 
//     dispatch({ type: RETURN_RESET_FORM });

//     return { success: true, amount: totalReturnAmount };

//   } catch (error) {
//     dispatch({
//       type: RETURN_CREATE_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//     throw error;
//   }
// };

// export const scanInvoice = (invoiceNumber) => async (dispatch, getState) => {
//   try {
//     dispatch({
//       type: RETURN_SCAN_INVOICE_REQUEST,
//     });

//     const token = localStorage.getItem('auth-key') || 'REoGAQQ7xp8Fym1uNNF5ltvpBUEoV2CfW1GLwA6Agas=';
    
//     const apiResponse = await returnService.getInvoiceDetails(invoiceNumber, token);
 
//     if (!apiResponse.ResultSet || !Array.isArray(apiResponse.ResultSet) || apiResponse.ResultSet.length === 0) {
//       throw new Error('No invoice data found for this invoice number');
//     } 
//     const transformedInvoice = transformInvoiceData(apiResponse.ResultSet, invoiceNumber);
    
//     dispatch({
//       type: RETURN_SCAN_INVOICE_SUCCESS,
//       payload: transformedInvoice,
//     });

//     dispatch({
//       type: RETURN_SET_PREVIEW_INVOICE,
//       payload: transformedInvoice,
//     });

//   } catch (error) {
//     dispatch({
//       type: RETURN_SCAN_INVOICE_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//     throw error;
//   }
// };
 
// const transformInvoiceData = (apiData, invoiceNumber) => {
//   if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
//     throw new Error('Invalid invoice data received');
//   }
 
//   const firstItem = apiData[0];
   
//   const totalAmount = apiData.reduce((total, item) => {
//     return total + (parseFloat(item.UNITPRICE) * parseFloat(item.SOLDQTY));
//   }, 0);
 
//   const items = apiData.map((item, index) => ({
//     id: index + 1,
//     PRODUCT_CODE: parseInt(item.PRCODE),
//     BATCH_ID: parseInt(item.BATCHID),
//     name: item.PRDESC || `Product ${item.PRCODE}`,
//     sku: item.SKU || item.PRCODE,
//     price: parseFloat(item.UNITPRICE),
//     quantity: parseFloat(item.SOLDQTY),
//     returnQuantity: 0,
//     reason: '',
//     MRP: parseFloat(item.MRP),
//     profitPerUnit: parseFloat(item.PROFIT_PER_UNIT),
//     totalProfit: parseFloat(item.TOTAL_PROFIT)
//   }));

//   return {
//     invoiceNumber: invoiceNumber,
//     invoiceDate: firstItem.INDATE,
//     whCode: firstItem.WHCODE,
//     customerId: firstItem.CUSID,
//     customerName: firstItem.CUSNAME,
//     cashierId: firstItem.CASHIERID,
//     cashierName: firstItem.CAHIERNAME,
//     invoicedOn: firstItem.INNOVICED_ON,
//     totalAmount: totalAmount,
//     items: items
//   };
// };

// export const fetchProductQuantity = (productCode, invoiceNumber) => async (dispatch) => {
//   try {
//     dispatch({ type: RETURN_FETCH_PRODUCT_QTY_REQUEST });

//     const data = await returnService.getProductQuantity(productCode, invoiceNumber);
    
//     dispatch({
//       type: RETURN_FETCH_PRODUCT_QTY_SUCCESS,
//       payload: {
//         productCode,
//         invoiceNumber,
//         quantity: data.ResultSet?.[0]?.SUMQTY ? parseFloat(data.ResultSet[0].SUMQTY) : 0
//       }
//     });

//     return data;
//   } catch (error) {
//     dispatch({
//       type: RETURN_FETCH_PRODUCT_QTY_FAIL,
//       payload: error.response?.data?.message || error.message
//     });
//     throw error;
//   }
// };

// export const setInvoiceForReturn = (invoice) => ({
//   type: RETURN_SET_INVOICE,
//   payload: invoice
// });

// export const updateReturnItem = (itemId, field, value) => ({
//   type: RETURN_UPDATE_ITEM,
//   payload: { itemId, field, value }
// });

// export const resetReturnForm = () => ({
//   type: RETURN_RESET_FORM,
// });

// export const resetReturnCreation = () => ({
//   type: RETURN_CREATE_RESET,
// });

// export const resetPreviewInvoice = () => ({
//   type: RETURN_SET_PREVIEW_INVOICE,
//   payload: null
// });






import {
  RETURN_CREATE_REQUEST,
  RETURN_CREATE_SUCCESS,
  RETURN_CREATE_FAIL,
  RETURN_CREATE_RESET,
  RETURN_SCAN_INVOICE_REQUEST,
  RETURN_SCAN_INVOICE_SUCCESS,
  RETURN_SCAN_INVOICE_FAIL,
  RETURN_UPDATE_ITEM,
  RETURN_RESET_FORM,
  RETURN_SET_INVOICE,
  RETURN_SET_PREVIEW_INVOICE,
  RETURN_FETCH_PRODUCT_QTY_REQUEST,
  RETURN_FETCH_PRODUCT_QTY_SUCCESS,
  RETURN_FETCH_PRODUCT_QTY_FAIL,
} from '../constants/returnConstants';
import { returnService } from '../services/returnService';

export const createSalesReturn = (returnData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RETURN_CREATE_REQUEST,
    });

    const token = localStorage.getItem('auth-key') || 'REoGAQQ7xp8Fym1uNNF5ltvpBUEoV2CfW1GLwA6Agas=';
    
    const data = await returnService.createSalesReturn(returnData, token);

    dispatch({
      type: RETURN_CREATE_SUCCESS,
      payload: data,
    });
 
    const totalReturnAmount = returnData[0].ReturnLines.reduce((total, line) => {
      return total + (line.UNIT_PRICE * line.QUANTITY);
    }, 0);
 
    dispatch({ type: RETURN_RESET_FORM });

    return { success: true, amount: totalReturnAmount };

  } catch (error) {
    dispatch({
      type: RETURN_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    throw error;
  }
};

export const scanInvoice = (invoiceNumber) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RETURN_SCAN_INVOICE_REQUEST,
    });

    const token = localStorage.getItem('auth-key') || 'REoGAQQ7xp8Fym1uNNF5ltvpBUEoV2CfW1GLwA6Agas=';
    
    const apiResponse = await returnService.getInvoiceDetails(invoiceNumber, token);
 
    if (!apiResponse.ResultSet || !Array.isArray(apiResponse.ResultSet) || apiResponse.ResultSet.length === 0) {
      throw new Error('No invoice data found for this invoice number');
    } 
    const transformedInvoice = transformInvoiceData(apiResponse.ResultSet, invoiceNumber);
    
    dispatch({
      type: RETURN_SCAN_INVOICE_SUCCESS,
      payload: transformedInvoice,
    });

    dispatch({
      type: RETURN_SET_PREVIEW_INVOICE,
      payload: transformedInvoice,
    });

  } catch (error) {
    dispatch({
      type: RETURN_SCAN_INVOICE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    throw error;
  }
};
 
const transformInvoiceData = (apiData, invoiceNumber) => {
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    throw new Error('Invalid invoice data received');
  }
 
  const firstItem = apiData[0];
   
  const totalAmount = apiData.reduce((total, item) => {
    return total + (parseFloat(item.UNITPRICE) * parseFloat(item.SOLDQTY));
  }, 0);
 
  const items = apiData.map((item, index) => ({
    id: index + 1,
    PRODUCT_CODE: parseInt(item.PRCODE),
    BATCH_ID: parseInt(item.BATCHID),
    name: item.PRDESC || `Product ${item.PRCODE}`,
    sku: item.SKU || item.PRCODE,
    price: parseFloat(item.UNITPRICE),
    mrp: parseFloat(item.MRP),
    quantity: parseFloat(item.SOLDQTY),
    returnQuantity: 0,
    reason: '',
    MRP: parseFloat(item.MRP),
    profitPerUnit: parseFloat(item.PROFIT_PER_UNIT),
    totalProfit: parseFloat(item.TOTAL_PROFIT)
  }));

  return {
    invoiceNumber: invoiceNumber,
    invoiceDate: firstItem.INDATE,
    whCode: firstItem.WHCODE,
    customerId: firstItem.CUSID,
    customerName: firstItem.CUSNAME,
    cashierId: firstItem.CASHIERID,
    cashierName: firstItem.CAHIERNAME,
    invoicedOn: firstItem.INNOVICED_ON,
    totalAmount: totalAmount,
    items: items
  };
};

export const fetchProductQuantity = (productCode, invoiceNumber, batchId) => async (dispatch) => {
  try {
    dispatch({ type: RETURN_FETCH_PRODUCT_QTY_REQUEST });

    const data = await returnService.getProductQuantity(productCode, invoiceNumber, batchId);
    
    dispatch({
      type: RETURN_FETCH_PRODUCT_QTY_SUCCESS,
      payload: {
        productCode,
        invoiceNumber,
        batchId,
        quantity: data.ResultSet?.[0]?.SUMQTY ? parseFloat(data.ResultSet[0].SUMQTY) : 0
      }
    });

    return data;
  } catch (error) {
    dispatch({
      type: RETURN_FETCH_PRODUCT_QTY_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};

export const setInvoiceForReturn = (invoice) => ({
  type: RETURN_SET_INVOICE,
  payload: invoice
});

export const updateReturnItem = (itemId, field, value) => ({
  type: RETURN_UPDATE_ITEM,
  payload: { itemId, field, value }
});

export const resetReturnForm = () => ({
  type: RETURN_RESET_FORM,
});

export const resetReturnCreation = () => ({
  type: RETURN_CREATE_RESET,
});

export const resetPreviewInvoice = () => ({
  type: RETURN_SET_PREVIEW_INVOICE,
  payload: null
});