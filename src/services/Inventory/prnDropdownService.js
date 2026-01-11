 
 
import { API_URL } from '../../config';
import axios from 'axios';

const dropdownService = { 
  loadSuppliers: async () => {
    try {
      const response = await axios.get(`${API_URL}/DropDown/LoadSuplier`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },
 
  loadWarehouses: async (supplierCode) => {
    try {
      const response = await axios.get(`${API_URL}/DropDown/LoadWH?P_supcode=${supplierCode}`);
      return response.data;
    } catch (error) {

      throw error;
    }
  }, 

  loadProducts: async (supplierCode, warehouseCode) => {
    try {
      const response = await axios.get(`${API_URL}/DropDown/LoadPRODUCT?P_supcode=${supplierCode}&P_whcode=${warehouseCode}`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },
 
  loadBatches: async (supplierCode, warehouseCode, productCode) => {
    try {
      const response = await axios.get(`${API_URL}/DropDown/LoadBATCH?P_supcode=${supplierCode}&P_whcode=${warehouseCode}&P_Procode=${productCode}`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },
};

export default dropdownService;