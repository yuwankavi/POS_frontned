import axios from "axios";

import {API_URL} from '../../config'

const token = localStorage.getItem("token");

const purchaseService = {
  
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/ADJ/GetADJDetails`, {
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


};

export default purchaseService;