import axios from "axios";
import { addInventoryProduct } from "../../actions/Inventory/inventoryProductActions";
import { data } from "autoprefixer";
import { API_URL } from '../../config'

// Helper to get fresh token on each call
const getAuthKey = () => localStorage.getItem("token");

const InventoryProductService = {

  async addInventoryProduct(inventoryProducts, file) {
    try {
      const formData = new FormData();

      Object.keys(inventoryProducts).forEach(key => {
        if (inventoryProducts[key] !== undefined && inventoryProducts[key] !== null) {
          formData.append(key, inventoryProducts[key]);
        }
      });

      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post(
        `${API_URL}/ProductItem/ProductAddWithImage`,
        formData,
        {
          headers: {
            "auth-key": getAuthKey(),
            "Content-Type": "multipart/form-data",
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
      const response = await axios.get(`${API_URL}/Product/GetProductCat`, {
        headers: {
          "auth-key": getAuthKey(),
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },



  async getProductCatById(productCode) {
    try {
      const response = await axios.get(
        `${API_URL}/Product/GetProductCatByID?P_CODE=${productCode}`,
        {
          headers: {
            "auth-key": getAuthKey(),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {

      throw error;
    }
  },


  async getByStatus(P_STATUS) {
    try {
      const response = await axios.get(
        `${API_URL}/Product/GetProductCat?P_STATUS=${P_STATUS}`,
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

  async getActiveStatus() {
    try {
      const response = await axios.get(
        `${API_URL}/Product/GetProductCat?P_STATUS=A`,
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

  async getInactiveStatus() {
    try {
      const response = await axios.get(
        `${API_URL}/Product/GetProductCat?P_STATUS=I`,
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

  async updateStatus(PC_Code, newStatus) {
    try {
      const url = `${API_URL}/Product/ProductCatStatusUpdate?P_CODE=${encodeURIComponent(PC_Code)}&P_STATUS=${encodeURIComponent(newStatus)}`;
      const response = await axios.get(url, { headers: { "auth-key": getAuthKey() } });
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async updateProductCatalogue(productData, file) {
    try {
      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        if (productData[key] !== undefined && productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      });

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        `${API_URL}/ProductItem/UpdateProductCatalgue`,
        formData,
        {
          headers: {
            "auth-key": getAuthKey(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }



};

export default InventoryProductService;

