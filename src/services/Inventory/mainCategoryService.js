import axios from "axios";
import { API_URL } from "../../config";

const token = localStorage.getItem("token");

export const mainCategoryService = {
  
  async getAllActive() {
    try {
      const response = await axios.get(`${API_URL}/MainCatargory/GetMainCatDetails?P_MStatus=A`, {
        headers: {
          "auth-key": token,
        },
      });

      
      return Array.isArray(response.data.ResultSet) ? response.data.ResultSet : [];
    } catch (error) {

      throw error;
    }
  },

    async getAllInactive() {
    try {
      const response = await axios.get(`${API_URL}/MainCatargory/GetMainCatDetails?P_MStatus=I`, {
        headers: {
          "auth-key": token,
        },
      });

      
      return Array.isArray(response.data.ResultSet) ? response.data.ResultSet : [];
    } catch (error) {

      throw error;
    }
  },

  async updateStatus(Main_CatID, status) {
    try {
      const response = await axios.get(`${API_URL}/MainCatargory/MCategoryStatusUpdate?P_MID=${Main_CatID}&P_MStatus=${status}`, {
        headers: {
          "auth-key": token,
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },
}

export const createCategory = async (Category) => {
  try {
    const { P_MCNAME, P_MCDES } = Category;

    const url = `${API_URL}/MainCatargory/MainCatAdd`;

    const response = await axios.post(
      url,
      { P_MCNAME, P_MCDES,  },
      { headers: { "auth-key": token } }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};



























































