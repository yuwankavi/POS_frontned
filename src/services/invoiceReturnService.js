// src/services/invoiceReturnService.js
import axios from 'axios';
import { API_URL } from "../config";

const AUTH_KEY = localStorage.getItem("token");

export const invoiceReturnService = {
  // Get all sales returns
  getAllSalesReturns: async () => {
    const config = {
      headers: {
        'auth-key': AUTH_KEY,
        'Content-Type': 'application/json'
      }
    };

    try {
      // Use the accurate endpoint for invoice returns
      const response = await axios.get(`${API_URL}/SRD/GetAllInvoiceDetails`, config);

      // Debug log the raw response for easier troubleshooting
      console.debug('GetAllInvoiceDetails response:', response.data);

      // Normalize common API shapes so UI table columns map correctly
      let rawList = [];
      if (response.data) {
        if (Array.isArray(response.data.ResultSet)) rawList = response.data.ResultSet;
        else if (Array.isArray(response.data)) rawList = response.data;
        else if (Array.isArray(response.data.resultSet)) rawList = response.data.resultSet;
      }

      if (rawList.length > 0) {
        const mapped = rawList.map(item => ({
          INNO: item.INNO || item.INVOICENO || item.InvoiceNo || '',
          CUSNAME: item.CUSNAME || item.CUSTOMERNAME || item.Customer || 'Walk-in',
          INDATE: item.INDATE || item.INVDATE || item.Date || null,
          MRP: item.MRP || item.UNITPRICE || item.Price || item.Total || '0.00',
          SOLDQTY: item.SOLDQTY || item.ITEM_COUNT || item.Quantity || '1',
          CAHIERNAME: item.CAHIERNAME || item.CASHIER || item.Cashier || 'Admin',
          // keep other fields if component uses them
          TOTALAMOUNT: item.TOTALAMOUNT || item.SALESVALUE || item.Total || item.MRP || '0.00',
          ITEM_COUNT: item.ITEM_COUNT || item.ITEMS || item.SOLDQTY || item.Quantity || '1',
          ...item
        }));

        // Return same shape but with mapped ResultSet so reducers/actions receive expected data
        return { ...response.data, ResultSet: mapped };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching sales returns:', error);
      throw error;
    }
  },

  // Get complete invoice details by invoice number using the specific API
  getInvoiceDetails: async (invoiceNumber) => {
    const config = {
      headers: {
        'auth-key': AUTH_KEY,
        'Content-Type': 'application/json'
      }
    };

    try {
      // Use the exact API endpoint you provided
      const response = await axios.get(
        `${API_URL}/SRD/InvoiceDetailsById?InvoiceNo=${invoiceNumber}`,
        config
      );

      console.log('API Response:', response.data); // For debugging

      if (response.data && response.data.StatusCode === 200) {
        // Transform the API response to our format
        const transformedData = transformInvoiceData(response.data.ResultSet, invoiceNumber);
        return transformedData;
      } else {
        throw new Error('Invoice not found or API error');
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      
      // Return mock data for testing if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        return getMockInvoiceData(invoiceNumber);
      }
      
      throw error;
    }
  },

  // Print invoice
  printInvoice: async (invoiceData) => {
    // Simulate print for web version
    return new Promise((resolve) => {
      setTimeout(() => {
        // Open browser print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const printContent = generatePrintHTML(invoiceData);
          
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Invoice ${invoiceData.invoiceNumber}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
                  @media print { body { margin: 0; } }
                </style>
              </head>
              <body>${printContent}</body>
            </html>
          `);
          
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
        resolve({ success: true, message: 'Invoice printed successfully' });
      }, 500);
    });
  },

  // Get product quantity for return validation
  getProductQuantity: async (productCode, invoiceNumber, batchId) => {
    const config = {
      headers: {
        'auth-key': AUTH_KEY,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.get(
        `${API_URL}/DropDown/GetINVSumqty?P_Procode=${productCode}&P_Refcod=${invoiceNumber}&P_BatchId=${batchId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching product quantity:', error);
      throw error;
    }
  }
};

// Transform API data to our format
const transformInvoiceData = (apiData, invoiceNumber) => {
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    return {
      items: [],
      header: {},
      payment: {},
      invoiceNumber: invoiceNumber,
      isEmpty: true
    };
  }

  const firstItem = apiData[0];
  
  // Calculate totals from items
  let subtotal = 0;
  let totalProfit = 0;
  
  apiData.forEach(item => {
    subtotal += parseFloat(item.SALESVALUE) || 0;
    totalProfit += parseFloat(item.TOTAL_PROFIT) || 0;
  });

  // Extract header information from first item
  const header = {
    INNO: firstItem.INNO || invoiceNumber,
    INDATE: firstItem.INDATE || new Date().toISOString(),
    WHCODE: firstItem.WHCODE || 'A01',
    CUSID: firstItem.CUSID || '',
    CUSNAME: firstItem.CUSNAME || '',
    CAHIERNAME: firstItem.CAHIERNAME || 'Admin',
    INNOVICED_ON: firstItem.INNOVICED_ON || new Date().toISOString()
  };

  // Create payment info (you might need to adjust this based on your actual payment API)
  const payment = {
    PAYMENT_METHOD: 'Cash', // Default, adjust as needed
    PAID_AMOUNT: subtotal,
    CHANGE_AMOUNT: 0
  };

  return {
    items: apiData,
    header: header,
    payment: payment,
    invoiceNumber: invoiceNumber,
    subtotal: subtotal,
    totalProfit: totalProfit,
    totalAmount: subtotal,
    isEmpty: false
  };
};

// Mock data for development/testing
const getMockInvoiceData = (invoiceNumber) => {
  const mockData = {
    items: [
      {
        "INNO": "13",
        "INDATE": "2025-12-31",
        "WHCODE": "A01",
        "CUSID": "",
        "CUSNAME": "",
        "PRCODE": "65",
        "SKU": "BEE_VOL_LIO_65",
        "PRDESC": "Lion Strong Beer 330ml",
        "BATCHID": "1",
        "SOLDQTY": "1.00",
        "UNITPRICE": "450.00",
        "SALESVALUE": "450.00",
        "MRP": "450.00",
        "PROFIT_PER_UNIT": "50.00",
        "TOTAL_PROFIT": "50.00",
        "CASHIERID": "19",
        "CAHIERNAME": "Admin",
        "INNOVICED_ON": "2025-12-31"
      },
      {
        "INNO": "13",
        "INDATE": "2025-12-31",
        "WHCODE": "A01",
        "CUSID": "",
        "CUSNAME": "John Doe",
        "PRCODE": "66",
        "SKU": "BEE_VOL_CAR_66",
        "PRDESC": "Carlsberg Beer 330ml",
        "BATCHID": "2",
        "SOLDQTY": "2.00",
        "UNITPRICE": "500.00",
        "SALESVALUE": "1000.00",
        "MRP": "500.00",
        "PROFIT_PER_UNIT": "75.00",
        "TOTAL_PROFIT": "150.00",
        "CASHIERID": "19",
        "CAHIERNAME": "Admin",
        "INNOVICED_ON": "2025-12-31"
      }
    ],
    header: {
      INNO: invoiceNumber,
      INDATE: "2025-12-31",
      WHCODE: "A01",
      CUSID: "CUST001",
      CUSNAME: "John Doe",
      CAHIERNAME: "Admin",
      INNOVICED_ON: "2025-12-31"
    },
    payment: {
      PAYMENT_METHOD: "Cash",
      PAID_AMOUNT: 1450.00,
      CHANGE_AMOUNT: 0.00
    },
    invoiceNumber: invoiceNumber,
    subtotal: 1450.00,
    totalProfit: 200.00,
    totalAmount: 1450.00,
    isEmpty: false
  };

  return mockData;
};

// Helper function to generate print HTML
const generatePrintHTML = (invoiceData) => {
  const formatCurrency = (value) => {
    if (!value) return '0.00';
    return parseFloat(value).toFixed(2);
  };

  // Calculate totals
  const subtotal = invoiceData.items.reduce((sum, item) => 
    sum + (parseFloat(item.SALESVALUE) || 0), 0);
  const total = subtotal;

  return `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2>DCSICN CLUB</h2>
      <p>070 - 731 4445</p>
      <p>No. 316/7, Thalangama North, Battaramulla.</p>
      <h3>INVOICE COPY</h3>
      <hr style="margin: 10px 0;">
    </div>
    
    <div style="margin-bottom: 15px;">
      <p><strong>Invoice No:</strong> ${invoiceData.invoiceNumber}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
      <p><strong>Customer:</strong> ${invoiceData.header.CUSNAME || 'Walk-in Customer'}</p>
      <p><strong>Cashier:</strong> ${invoiceData.header.CAHIERNAME || 'Admin'}</p>
    </div>
    
    <hr style="margin: 15px 0;">
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
      <thead>
        <tr style="border-bottom: 2px solid #000;">
          <th style="padding: 5px; text-align: left; width: 40%;">Item</th>
          <th style="padding: 5px; text-align: center;">Qty</th>
          <th style="padding: 5px; text-align: right;">Price</th>
          <th style="padding: 5px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${invoiceData.items.map(item => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 5px;">${item.PRDESC}</td>
            <td style="padding: 5px; text-align: center;">${item.SOLDQTY}</td>
            <td style="padding: 5px; text-align: right;">${formatCurrency(item.UNITPRICE)}</td>
            <td style="padding: 5px; text-align: right;">${formatCurrency(item.SALESVALUE)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <hr style="margin: 15px 0;">
    
    <div style="text-align: right;">
      <p><strong>Subtotal:</strong> $${formatCurrency(subtotal)}</p>
      <p style="font-size: 16px; font-weight: bold; margin-top: 10px;">
        <strong>TOTAL:</strong> $${formatCurrency(total)}
      </p>
    </div>
    
    <hr style="margin: 20px 0;">
    
    <div style="text-align: center; font-size: 11px; color: #666; margin-top: 30px;">
      <p>Thank you for your business!</p>
      <p>For returns, present this invoice within 7 days</p>
      <p>Invoice ID: ${invoiceData.invoiceNumber} | Printed on: ${new Date().toLocaleString()}</p>
    </div>
  `;
};