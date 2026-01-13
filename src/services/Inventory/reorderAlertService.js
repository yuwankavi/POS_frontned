import axios from 'axios';
import { API_URL } from '../../config';

const AUTH_KEY = localStorage.getItem('token');

const reorderAlertService = {
  async getReorderLevel() {
    try {
      const response = await axios.get(`${API_URL}/ProductBatches/GetReorderlevel`, {
        headers: { 'auth-key': AUTH_KEY }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reorderAlertService;
