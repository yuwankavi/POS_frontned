import axios from "axios";

import {API_URL} from '../../config'

const token = localStorage.getItem("token");



const purchaseService = {
  
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/GRN/GetGrnList`, {
        headers: {
          "auth-key": token,
        },
      });


      return Array.isArray(response.data.ResultSet) ? response.data.ResultSet : [];
    } catch (error) {

      throw error;
    }
  },


async addGrn(grnData) {
  try {
    const url = `${API_URL}/AddGRN/AddGrn`;


    const payload = Array.isArray(grnData) ? grnData : [grnData];



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


async updateGrnSupplier({ P_SUPCODE, P_DOCNO }) {
    try {
      const url =
        `${API_URL}/GRN/UpdateGrnSup?` +
        `P_SUPCODE=${encodeURIComponent(P_SUPCODE)}` +
        `&P_DOCNO=${encodeURIComponent(P_DOCNO)}`;

      const response = await axios.get(url, {
        headers: { "auth-key": token },
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
}





};

export default purchaseService;