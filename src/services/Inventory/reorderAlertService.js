import axios from 'axios';
import { API_URL } from '../../config';

const reorderAlertService = {
  async getReorderLevel() {
    try {
      // Get token fresh on each call (not at module load time)
      const AUTH_KEY = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/ProductItem/GetAllActiveProduct`, {
        headers: { 'auth-key': AUTH_KEY }
      });
      
      // Filter products where balance quantity is at or below reorder level
      const allProducts = response.data?.ResultSet || response.data || [];
      const reorderProducts = allProducts.filter(product => {
        const reorderLevel = parseFloat(product.PREOLEVEL) || 0;
        const balanceQty = parseFloat(product.PBALQTY) || 0;
        // Show products where balance qty is at or below reorder level
        return reorderLevel >= balanceQty;
      });
      
      return {
        ...response.data,
        ResultSet: reorderProducts,
        totalItems: allProducts.length,
        lowStockCount: reorderProducts.length
      };
    } catch (error) {
      throw error;
    }
  },

  async getAllActiveProducts() {
    try {
      const AUTH_KEY = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/ProductItem/GetAllActiveProduct`, {
        headers: { 'auth-key': AUTH_KEY }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reorderAlertService;
