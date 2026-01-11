import axios from "axios";
import {API_URL} from '../../config'


const token = localStorage.getItem("token");

const purchaseReturnService = {
  
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/PRNN/GetPrnDetails`, {
        headers: {
          "auth-key": token,
        },
      });



      
      return Array.isArray(response.data.ResultSet) ? response.data.ResultSet : [];
    } catch (error) {

      throw error;
    }
  },






async addPrn(prnData) {
  try {
    const url = `${API_URL}/ADDPRN/AddPrn`;

    
    const payload = Array.isArray(prnData) ? prnData : [prnData];



    const response = await axios.post(url, payload, {
      headers: {
        "auth-key": token,
        "Content-Type": "application/json",
      },
    });


    return response.data;
  } catch (error) {

    throw error;
  }
},

async getBalanceQty({ P_WHCODE, P_PRCODE }) {
  try {
    const url = `${API_URL}/GRN/GetBlQty?P_WHCODE=${encodeURIComponent(
      P_WHCODE
    )}&P_PRCODE=${encodeURIComponent(P_PRCODE)}`;

    const response = await axios.get(url, {
      headers: { "auth-key": token },
    });


    if (response.data?.ResultSet?.length > 0) {
      const qty = response.data.ResultSet[0].PBALQTY;
      return Number(qty) || 0;
    }

    return 0;
  } catch (error) {

    return 0;
  }
},

getSumQty: async (productCode, refCode) => {
  try {
    const response = await axios.get(
      `${API_URL}/DropDown/GetSumqty?P_Procode=${productCode}&P_Refcod=${refCode}`
    );
    return response.data;
  } catch (error) {

    throw error;
  }
},


};



export default purchaseReturnService;