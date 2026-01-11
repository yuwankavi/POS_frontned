import axios from "axios";
import { API_URL } from "../../config";

export const productService = {
  getAllProducts: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/POS/GetAllProducts`, {
      headers: {
        "auth-key": token,
      },
    });
    return response.data.ResultSet || [];
  },

  getAllCategories: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/POS/GetAllCat`, {
      headers: {
        "auth-key": token,
      },
    });
    return response.data.ResultSet || [];
  },

  getSubcategoriesByMainId: async (mainId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/POS/GetSubByMainId?P_MID=${mainId}`,
      {
        headers: {
          "auth-key": token,
        },
      }
    );
    return response.data.ResultSet || [];
  },

  getProductsBySubId: async (subId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/POS/GetProductBySubId?P_SID=${subId}`,
      {
        headers: {
          "auth-key": token,
        },
      }
    );
    return response.data.ResultSet || [];
  },
  getProductImage: async (imageUrl) => {
    if (!imageUrl) return null;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(imageUrl, {
        headers: { "auth-key": token },
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (err) {

      return null;
    }
  },
 
};



