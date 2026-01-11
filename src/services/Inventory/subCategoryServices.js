
import axios from "axios";
import { API_URL } from "../../config";

const token = localStorage.getItem("token");

export const subCategoryService = {
  
  async getAllActive() {
    try {
      const response = await axios.get(`${API_URL}/SubCategory/GetSubCatList?P_SSTATUS=A`, {
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
      const response = await axios.get(`${API_URL}/SubCategory/GetSubCatList?P_SSTATUS=I`, {
        headers: {
          "auth-key": token,
        },
      });

      
      return Array.isArray(response.data.ResultSet) ? response.data.ResultSet : [];
    } catch (error) {

      throw error;
    }
  },

    async updateSubCategoryStatus(Sub_CatID, status) {
      
    try {
      const response = await axios.get(`${API_URL}/SubCategory/SubCatStatusUpdate?P_SID=${Sub_CatID}&P_SStatus=${status}`, {
        headers: {
          "auth-key": token,
        },
      });

      

      return response.data;
    } catch (error) {

      throw error;
    }
  },

};

export const createSubCategory = async (subCategory) => {
  try {
    const { P_SCNAME, P_SCDES, P_SMCID, P_SCSTATUS } = subCategory;

    const url = `${API_URL}/SubCategory/SubCatAdd`;

    const response = await axios.post(
      url,
      { P_SMCID, P_SCNAME, P_SCDES, P_SCSTATUS },
      { headers: { "auth-key": token } }
    );


    return response.data;
  } catch (error) {

    throw error;
  }
};

