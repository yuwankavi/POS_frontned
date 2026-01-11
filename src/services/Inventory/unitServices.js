 
import { API_URL } from "../../config";
import axios from "axios";


const STATUS = { ACTIVE: "A", INACTIVE: "I" };


const getAuthHeaders = () => ({
  headers: {
    "auth-key": localStorage.getItem("token") || "",
  },
});

const unitService = {
  
  async addUnit(unit) {
    const { P_UNCODE, P_UNDESC } = unit;
    const url = `${API_URL}/Unit/UnitAdd?P_UNCODE=${encodeURIComponent(
      P_UNCODE
    )}&P_UNDESC=${encodeURIComponent(P_UNDESC)}`;

    try {
      const response = await axios.get(url, getAuthHeaders());
      return response.data;
    } catch (error) {

      throw error.response?.data || error;
    }
  },

  
  async getAllActive() {
    const url = `${API_URL}/Unit/GetAllUnit?P_STATUS=${STATUS.ACTIVE}`;

    try {
      const response = await axios.get(url, getAuthHeaders());
      return response.data;
    } catch (error) {

      throw error.response?.data || error;
    }
  },

  
  async getAllInactive() {
    try {
      const url = `${API_URL}/Unit/GetAllUnit?P_STATUS=${STATUS.INACTIVE}`;
      const response = await axios.get(url, getAuthHeaders());
      return response.data;
    } catch (error) {

      throw error.response?.data || error;
    }
  },

  
  async updateStatus(P_UNCODE, status) {
    const url = `${API_URL}/Unit/UpdateUnitStatus?P_Status=${status}&P_UNCODE=${encodeURIComponent(
      P_UNCODE
    )}`;

    try {
      const response = await axios.get(url, getAuthHeaders());
      return response.data;
    } catch (error) {

      throw error.response?.data || error;
    }
  },

  
  async getById(P_UNCODE) {
    const url = `${API_URL}/Unit/GetUnitById?P_UNCODE=${encodeURIComponent(
      P_UNCODE
    )}`;

    try {
      const response = await axios.get(url, getAuthHeaders());
      return response.data;
    } catch (error) {

      throw error.response?.data || error;
    }
  },
};

export default unitService;
