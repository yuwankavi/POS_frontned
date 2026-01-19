import axios from "axios";

import {API_URL} from '../../config'

// Helper to get fresh token on each call
const getAuthKey = () => localStorage.getItem("token");

const ProductDetailsService = {
  async addProductDetails(productDetails) {
    try {
      const {
        PWHCODE,
        PPROCODE,
        PBINLOCATION,
        PREOLEVEL,
        PMINSTOCK,
        PTYPE,
        PBALQTY,
        PBALVALUE,
        PSELPRICE,
      } = productDetails;

      
      const url = `${API_URL}/ProductItem/ProductDetailsAdd?P_WHCODE=${encodeURIComponent(
        PWHCODE
      )}&P_PROCODE=${encodeURIComponent(
        PPROCODE
      )}&P_BINLOCATION=${encodeURIComponent(
        PBINLOCATION
      )}&P_REOLEVEL=${encodeURIComponent(
        PREOLEVEL
      )}&P_MINSTOCK=${encodeURIComponent(
        PMINSTOCK
      )}&P_TYPE=${encodeURIComponent(
        PTYPE
      )}`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "auth-key": getAuthKey(), 
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async getAll() {
    try {
      const response = await axios.get(
        `${API_URL}/ProductItem/GetAllActiveProduct`,
        {
          headers: {
            "auth-key": getAuthKey(), 
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async getActivePD(PPROCODE) {
    try {
      const response = await axios.get(
        `${API_URL}/ProductItem/GetAllActiveProduct?P_PROCODE=${PPROCODE}`,
        {
          headers: {
            "auth-key": getAuthKey(),
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },
  async getProductById(PPROCODE) {
    try {
      const response = await axios.get(
        `${API_URL}/ProductItem/GetProductById?P_PROCODE=${PPROCODE}`,
        {
          headers: {
            "auth-key": getAuthKey(),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ProductDetailsService;
