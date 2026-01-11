import axios from "axios";

import { API_URL } from "../../config";

const AUTH_KEY = localStorage.getItem("token");
const token = localStorage.getItem("token");

const adjustmentService = {
  // ✅ Get all Adjustments
  async getAdjustments() {
    try {
      const { data } = await axios.get(`${API_URL}/ADJ/GetADJDetails`, {
        headers: {
          "Content-Type": "application/json",
          "auth-key": token,
        },
      });
      return data?.ResultSet || [];
    } catch (error) {

      throw error;
    }
  },

  // ✅ Add Adjustment
  async addAdjustment(payload) {
    try {
      const { data } = await axios.post(`${API_URL}/AddADJ/AddADJ`, payload, {
        headers: {
          "Content-Type": "application/json",
          "auth-key": token,
        },
      });
      return data;
    } catch (error) {

      throw error;
    }
  },
};

export default adjustmentService;
