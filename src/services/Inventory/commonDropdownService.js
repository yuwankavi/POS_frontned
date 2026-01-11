
import { API_URL } from '../../config';
import axios from 'axios';

export const inventoryService = {
  
  getWarehouses: async () => {
    try {
      
      const response = await axios.get(`${API_URL}/DropDown/GetWHDetails`);
      return response;
    } catch (error) {

      throw error;
    }
  },

  getProductsByWarehouse: (warehouseCode) => {
    return axios.get(`${API_URL}/DropDown/GetProductDetails?P_whcode=${warehouseCode}`);
  },

  getBatchesByProduct: (productCode, warehouseCode) => {
    return axios.get(`${API_URL}/DropDown/GetBatchDetails?P_Procode=${productCode}&P_whcode=${warehouseCode}`);
  },
};