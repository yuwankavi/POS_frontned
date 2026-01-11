

import { API_URL } from '../../config';
import axios from 'axios';
 const AUTH_KEY = localStorage.getItem("token");
const API_BASE_URL = API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'auth-key': AUTH_KEY,
  }
});
export const promotionService = {

  createPromotion: async (promotionData) => {
    try {

      const response = await api.post('/AddPromotions/AddPromotions', promotionData);
 
      return response.data;
    } catch (error) {
      
      throw error.response?.data || error.message;
    }
  },
  
  getPromotions: async () => {
    try {
      const response = await api.get('/PromotionDetails/GetPromoHeaderDetails');
      
      return response.data;
    } catch (error) {
      
      throw error.response?.data || error.message;
    }
  },
  
  getPromotionDetails: async (promotionId) => {
    try {
      const response = await api.get(`/PromotionDetails/GetPromoDetails?P_PROMOID=${promotionId}`);
      
      return response.data;
    } catch (error) {
     
      throw error.response?.data || error.message;
    }
  },
  
  updatePromotionStatus: async (promotionId, status) => {
    try {
      const response = await api.post(`/PromotionDetails/InactivePromo?P_PROMOID=${promotionId}`);
      
      return response.data;
    } catch (error) {
      
      throw error.response?.data || error.message;
    }
  },
  
  updatePromotion: async (promotionId, promotionData) => {
    try {
      const response = await api.put(`/Promotions/UpdatePromotion/${promotionId}`, promotionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  deletePromotion: async (promotionId) => {
    try {
      const response = await api.delete(`/Promotions/DeletePromotion/${promotionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
export const productService = {
  
  getProductsForPromotion: async () => {
    try {
      const response = await api.get('/Product/GetProductCat?P_STATUS=A');
      
      return response.data;
    } catch (error) {
      
      throw error.response?.data || error.message;
    }
  }
};