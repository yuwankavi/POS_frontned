import axios from 'axios';

import { API_URL } from "../config";

const AUTH_KEY = localStorage.getItem("token");

 

export const returnService = { 
  createSalesReturn: async (returnData, token) => {
    const config = {
      headers: {
        'auth-key': AUTH_KEY,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post(`${API_URL}/AddSRN/AddSRN`, returnData, config);
    return response.data;
  },
 
  getInvoiceDetails: async (invoiceNumber, token) => {
    const config = {
      headers: {
        'auth-key': AUTH_KEY,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.get(
      `${API_URL}/SRD/InvoiceDetailsById?InvoiceNo=${invoiceNumber}`,
      config
    );
    return response.data;
  },

  getProductQuantity: async (productCode, invoiceNumber,batchId) => {
    const config = {
      headers: {
        'auth-key': AUTH_KEY,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.get(
      `${API_URL}/DropDown/GetINVSumqty?P_Procode=${productCode}&P_Refcod=${invoiceNumber}&P_BatchId=${batchId}`,
      config
    );
    return response.data;
  }

  
};


