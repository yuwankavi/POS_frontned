
import axios from "axios";
import { API_URL } from "../config";

const dailySummaryervice = {
  async getDailySummaryByDate(startDate,endDate) {
    try {
      const token = localStorage.getItem("token");
      
      const url = `${API_URL}/SRD/GetInvoice?p_start_date=${startDate}&p_end_date=${endDate}`;
      console.log(url)
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
};

export default dailySummaryervice;