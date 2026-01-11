import axios from "axios";
import { API_URL } from "../../config";

export const cartService = {
  getSessionId: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.LogId; 
  },

  getSaleId: () => {
    return localStorage.getItem('saleId');
  },

  setSaleId: (saleId) => {
    localStorage.setItem('saleId', saleId);
  },

  clearSaleId: () => {
    localStorage.removeItem('saleId');
  },

  addToCart: async (cartData) => {
    const token = localStorage.getItem("token");
    const { sessionId, warehouseCode, productCode, quantity ,batchId} = cartData;
    
    const saleId = cartService.getSaleId();
    
    let url = `${API_URL}/AddCart/ADDCart?P_SESSIONID=${sessionId}&P_WHCODE=${warehouseCode}&P_PRODUCTCODE=${productCode}&P_BATCHID=${batchId}&P_QUANTITY=${quantity}`;
    
    if (saleId) {
      url += `&P_SALEID=${saleId}`;
    }
 

    const response = await axios.get(url, {
      headers: {
        "auth-key": token,
      },
    });
    
    if (response.data.ResultSet && response.data.ResultSet.Sale_ID && !saleId) {
      cartService.setSaleId(response.data.ResultSet.Sale_ID); 
    }
    
    return response.data;
  },

  removeFromCart: async (removeData) => {
    const token = localStorage.getItem("token");
    const { sessionId, productCode, saleId, batchId } = removeData;
    
    const url = `${API_URL}/RemoveCart/RemoveCart?P_SESSIONID=${sessionId}&P_PRODUCTCODE=${productCode}&P_SALEID=${saleId}&P_BATCHID=${batchId}`;
 
    const response = await axios.get(url, {
      headers: {
        "auth-key": token,
      },
    });
    
    return response.data;
  },

  holdSale: async (sessionId, saleId) => {
    const token = localStorage.getItem("token");
    const url = `${API_URL}/HoldResume/HOLD?P_SESSIONID=${sessionId}&P_SALEID=${saleId}`;


    const response = await axios.get(url, {
      headers: {
        "auth-key": token,
      },
    });

    return response.data;
  },

  resumeSale: async (sessionId, saleId) => {
    const token = localStorage.getItem("token");
    const url = `${API_URL}/HoldResume/RESUME?P_SESSIONID=${sessionId}&P_SALEID=${saleId}`;
 

    const response = await axios.get(url, {
      headers: {
        "auth-key": token,
      },
    });
    
    return response.data;
  },
 
  getHoldList: async (sessionId, saleId) => {
    const token = localStorage.getItem("token");
    const url = `${API_URL}/HoldResume/GetHoldList?P_SESSIONID=${sessionId}&P_SALEID=${saleId}`;
 

    const response = await axios.get(url, {
      headers: {
        "auth-key": token,
      },
    });
    
    return response.data;
  },

  getHeldSales: () => {
    const heldSales = localStorage.getItem('heldSales');
    return heldSales ? JSON.parse(heldSales) : [];
  },

  addToHeldSales: (saleId, items, tabName = 'Held Sale') => {
    const heldSales = cartService.getHeldSales();
    const newHeldSale = {
      saleId,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        discountedPrice: item.discountedPrice,
        quantity: item.quantity,
        stock: item.stock,
        image: item.image,
        discountType: item.discountType,
        discountValue: item.discountValue
      })),
      tabName,
      heldAt: new Date().toISOString()
    };
    
    heldSales.push(newHeldSale);
    localStorage.setItem('heldSales', JSON.stringify(heldSales));
    return newHeldSale;
  },

  removeFromHeldSales: (saleId) => {
    const heldSales = cartService.getHeldSales();
    const updatedHeldSales = heldSales.filter(sale => sale.saleId !== saleId);
    localStorage.setItem('heldSales', JSON.stringify(updatedHeldSales));
    return updatedHeldSales;
  },
};