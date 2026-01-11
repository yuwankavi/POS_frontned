// import axios from "axios";
// import { API_URL } from "../../config";

// export const invoiceService = {
//   addInvoice: async () => {
//     const token = localStorage.getItem("token");
//     const saleId = localStorage.getItem("saleId"); 
//     const userData = JSON.parse(localStorage.getItem("user"));
//     const sessionId = userData?.LogId; 

//     try {
//       const url = `${API_URL}/ADDINV/ADDINV?P_SESSIONID=${sessionId}&P_SALEID=${saleId}`;


//       const response = await axios.post(
//         url,
//         {},
//         {
//           headers: {
//             "auth-key": token,  
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getInvoiceDetails: async () => {
//     const token = localStorage.getItem("token");
    
//     try {
//       const url = `${API_URL}/Invoice/GetInvoiceDetails`;


//       const response = await axios.get(url, {
//         headers: {
//           "auth-key": token,
//         },
//       });

//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   updateInvoiceDetails: async (formData) => {
//     const token = localStorage.getItem("token");
    
//     try {
//       const url = `${API_URL}/Invoice/UpdateInvoiceDetails`;


//       const response = await axios.post(url, formData, {
//         headers: {
//           "auth-key": token,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getInvoiceImage: async () => {
//     const token = localStorage.getItem("token");
    
//     try {
//       const url = `${API_URL}/Invoice/INPhotoPrivew`; 

//       const response = await axios.get(url, {
//         headers: {
//           "auth-key": token,
//         },
//         responseType: 'blob', 
//       });

       
//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result);
//         reader.readAsDataURL(response.data);
//       });
//     } catch (error) {

//       throw error.response?.data || error.message;
//     }
//   },

  
//   getInvoiceImageBlob: async () => {
//     const token = localStorage.getItem("token");
    
//     try {
//       const url = `${API_URL}/Invoice/INPhotoPrivew`;
//       const response = await axios.get(url, {
//         headers: {
//           "auth-key": token,
//         },
//         responseType: 'blob',
//       });

//       return URL.createObjectURL(response.data);
//     } catch (error) {

//       throw error.response?.data || error.message;
//     }
//   }
// };


import axios from "axios";
import { API_URL } from "../../config";

// export const invoiceService = {
//   addInvoice: async (invoiceData) => {
//     const token = localStorage.getItem("token");
//     const saleId = localStorage.getItem("saleId"); 
//     const userData = JSON.parse(localStorage.getItem("user"));
//     const sessionId = userData?.LogId;

//     // Extract parameters from invoiceData
//     const {
    
//       items = [],
//       subtotal = 0,
//       discount = 0,
//       tax = 0,
//       total = 0,
//       splitPayment = false,
//       method,
//       amount,
//       methods = [],
//       tabId
//     } = invoiceData;

//     try {
//       // Determine payment method, amount, and paid amount
//       let paymentMethod = 'C'; // Default to cash
//       let paidAmount = total;
//       let invoiceTotal = total; // P_INVTOTAL should be the final amount to pay

//       if (splitPayment) {
//         // For split payment, use 'S' as payment type
//         paymentMethod = 'S';
//         paidAmount = methods.reduce((sum, m) => sum + m.amount, 0);
//         invoiceTotal = total;
//       } else {
//         paymentMethod = getPaymentMethodCode(method);
//         paidAmount = amount || total;
//         invoiceTotal = total;
//       }

//       // Build URL with parameters
//       let url = `${API_URL}/ADDINV/ADDINV?P_SESSIONID=${sessionId}&P_SALEID=${saleId}`;
      
 
//       // Add other parameters - CORRECTED MAPPING:
//       url += `&P_DISTOTAL=${discount}`; // Cart discount amount
//       url += `&P_PAYTYPE=${paymentMethod}`; // Payment method code
//       url += `&P_INVTOTAL=${invoiceTotal}`; // Final amount to be paid (after discount)
//       url += `&P_PAIDAMOUNT=${paidAmount}`; // Amount actually paid

//       console.log('API URL:', url); // For debugging

//       const response = await axios.post(
//         url,
//         {},
//         {
//           headers: {
//             "auth-key": token,  
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // ... keep other methods the same
//   getInvoiceDetails: async () => {
//     const token = localStorage.getItem("token");
    
//     try {
//       const url = `${API_URL}/Invoice/GetInvoiceDetails`;

//       const response = await axios.get(url, {
//         headers: {
//           "auth-key": token,
//         },
//       });

//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   updateInvoiceDetails: async (formData) => {
//     const token = localStorage.getItem("token");
    
//     try {
//       const url = `${API_URL}/Invoice/UpdateInvoiceDetails`;

//       const response = await axios.post(url, formData, {
//         headers: {
//           "auth-key": token,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getInvoiceImage: async () => {
//     const token = localStorage.getItem("token");
    
//     try {
//       const url = `${API_URL}/Invoice/INPhotoPrivew`;

//       const response = await axios.get(url, {
//         headers: {
//           "auth-key": token,
//         },
//         responseType: 'blob', 
//       });

//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result);
//         reader.readAsDataURL(response.data);
//       });
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getInvoiceImageBlob: async () => {
//     const token = localStorage.getItem("token");
    
//     try {
//       const url = `${API_URL}/Invoice/INPhotoPrivew`;
//       const response = await axios.get(url, {
//         headers: {
//           "auth-key": token,
//         },
//         responseType: 'blob',
//       });

//       return URL.createObjectURL(response.data);
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   }
// };


export const invoiceService = {
  addInvoice: async (invoiceData) => {
    const token = localStorage.getItem("token");
    const saleId = localStorage.getItem("saleId"); 
    const userData = JSON.parse(localStorage.getItem("user"));
    const sessionId = userData?.LogId;

    
    const {
      items = [],
      subtotal = 0,
      discount = 0,
      tax = 0,
      total = 0,
      splitPayment = false,
      method,
      amount, 
      methods = [],
      tabId,
      cashAmount 
    } = invoiceData;

    try {

      let paymentMethod = 'C'; 
      let paidAmount = total;
      let invoiceTotal = total;

      if (splitPayment) {
        
        paymentMethod = 'S';
        paidAmount = methods.reduce((sum, m) => sum + m.amount, 0);
        invoiceTotal = total;
      } else {
        paymentMethod = getPaymentMethodCode(method);

        paidAmount = cashAmount || amount || total;
        invoiceTotal = total;
      }

      let url = `${API_URL}/ADDINV/ADDINV?P_SESSIONID=${sessionId}&P_SALEID=${saleId}`;
      

      url += `&P_DISTOTAL=${discount}`;
      url += `&P_PAYTYPE=${paymentMethod}`;
      url += `&P_INVTOTAL=${invoiceTotal}`;
      url += `&P_PAIDAMOUNT=${paidAmount}`;  
      console.log('API URL:', url);
      console.log('Payment Details:', {
        method: paymentMethod,
        paidAmount,
        invoiceTotal,
        cashAmount,
        splitPayment
      });

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "auth-key": token,  
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getInvoiceDetails: async () => {
      const token = localStorage.getItem("token");
      try {
        const url = `${API_URL}/Invoice/GetInvoiceDetails`;
  
  
        const response = await axios.get(url, {
          headers: {
            "auth-key": token,
          },
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    updateInvoiceDetails: async (formData) => {
      const token = localStorage.getItem("token");
      
      try {
        const url = `${API_URL}/Invoice/UpdateInvoiceDetails`;
  
  
        const response = await axios.post(url, formData, {
          headers: {
            "auth-key": token,
            "Content-Type": "multipart/form-data",
          },
        });
  
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  
    getInvoiceImage: async () => {
      const token = localStorage.getItem("token");
      
      try {
        const url = `${API_URL}/Invoice/INPhotoPrivew`; 
  
        const response = await axios.get(url, {
          headers: {
            "auth-key": token,
          },
          responseType: 'blob', 
        });
  
         
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(response.data);
        });
      } catch (error) {
  
        throw error.response?.data || error.message;
      }
    },
  
    
    getInvoiceImageBlob: async () => {
      const token = localStorage.getItem("token");
      
      try {
        const url = `${API_URL}/Invoice/INPhotoPrivew`;
        const response = await axios.get(url, {
          headers: {
            "auth-key": token,
          },
          responseType: 'blob',
        });
  
        return URL.createObjectURL(response.data);
      } catch (error) {
  
        throw error.response?.data || error.message;
      }
    }
};
 
const getPaymentMethodCode = (method) => {
  const methodMap = {
    'cash': 'C',     
    'card': 'D',
    'lankaqr': 'L',
    'gift': 'G',
    'paypal': 'P',  
    'mobile': 'M'    
  };
  
  return methodMap[method] || 'C';  
};


