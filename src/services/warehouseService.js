import axios from "axios";
import { API_URL} from "../config";

const token = localStorage.getItem("token");


const warehouseService = {
  async addWarehouse(warehouse) {
    try {
      const { pwd_wh_code, pwd_wh_name, pwd_start_date, pwd_end_date } = warehouse;

      
      const url = `${API_URL}/Warehouse/WHAdd?P_WHCODE=${encodeURIComponent(
        pwd_wh_code
      )}&P_WHNAME=${encodeURIComponent(
        pwd_wh_name
      )}&P_SDATE=${encodeURIComponent(pwd_start_date)}&P_EDATE=${
        pwd_end_date ? encodeURIComponent(pwd_end_date) : ""
      }`;

    const response = await axios.get(url, {
        headers: {
          "auth-key": token,  
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async getAllActive() {
    try {
        const response = await axios.get(`${API_URL}/Warehouse/GetWHList?P_STATUS=A`, {
        headers: {
          "auth-key": token, 
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllInactive() {
    try {
        const response = await axios.get(`${API_URL}/Warehouse/GetWHList?P_STATUS=I`, {
        headers: {
          "auth-key": token,  
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async updateStatus(WH_Code, status) {
    try {
      const response = await axios.get(
        `${API_URL}/Warehouse/WHStatusUpdate/?P_WHCODE=${WH_Code}&P_STATUS=${status}`,
        {
          headers: { "auth-key": token },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  
  
async monthEndProcess(P_SDATE, P_EDATE, P_WHCODE) {
  try {
    const url = `${API_URL}/Warehouse/WHEDateUpdate?P_SDATE=${encodeURIComponent(P_SDATE)}&P_EDATE=${encodeURIComponent(P_EDATE)}&P_WHCODE=${encodeURIComponent(P_WHCODE)}`;

    const response = await axios.get(url, {
      headers: { "auth-key": token },
    });

    return response.data;
  } catch (error) {

    throw error.response?.data || error;
  }
}


};





export default warehouseService;