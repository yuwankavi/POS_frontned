import axios from "axios";
import {API_URL} from '../../config'


const token = localStorage.getItem("token");

const salesReturnService = {
  
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/SRD/GetAllSRD`, {
        headers: {
          "auth-key": token,
        },
      });

      
      return Array.isArray(response.data.ResultSet) ? response.data.ResultSet : [];
    } catch (error) {

      throw error;
    }
  },

  };

export default salesReturnService;