// services/Inventory/bincardService.js
import axios from "axios";
import { API_URL } from "../../config";

const token = localStorage.getItem("token");

const binCardService = {
  // Fetch all bin cards
  async getAll() {
    try {
      const responseAll = await axios.get(`${API_URL}/BINCard/GetBinCardDetails`, {
        headers: { "auth-key": token },
      });
      return Array.isArray(responseAll.data.ResultSet) ? responseAll.data.ResultSet : [];
    } catch (error) {

      throw error;
    }
  },

  // Fetch max line
  async getMaxLine() {
    try {
      const responseMaxLine = await axios.get(`${API_URL}/BINCard/GetMaxLine`, {
        headers: { "auth-key": token },
      });
      return responseMaxLine.data;
    } catch (error) {

      throw error;
    }
  },

  // Fetch by line
  async getByLine(BIN_WHCode, BIN_ProCode, DOCNo,BIN_DOCType) {
    try { 
      const responseByLine = await axios.get(
        `${API_URL}/BINCard/GetByLine?P_whcode=${BIN_WHCode}&P_Procode=${BIN_ProCode}&P_DocType=${BIN_DOCType}&P_DocNo=${DOCNo}`,
        { headers: { "auth-key": token } }
      );
      return responseByLine.data;
    } catch (error) {
      console.error(
        `Error fetching bin card by line (WHCode: ${BIN_WHCode}, ProCode: ${BIN_ProCode}, Line: ${BIN_Line}):`,
        error
      );
      throw error;
    }
  },

  // Fetch transactions
  async getTransaction(BIN_WHCode, BIN_ProCode) {
    try {
      const responseTransaction = await axios.get(
        `${API_URL}/BINCard/GetTrancation?P_whcode=${BIN_WHCode}&P_Procode=${BIN_ProCode}`,
        { headers: { "auth-key": token } }
      );
      return responseTransaction.data;
    } catch (error) {
      console.error(
        `Error fetching transactions (WHCode: ${BIN_WHCode}, ProCode: ${BIN_ProCode}):`,
        error
      );
      throw error;
    }
  },
};

export default binCardService;
