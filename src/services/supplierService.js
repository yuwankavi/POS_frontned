import axios from "axios";

import { API_URL } from "../config";

const AUTH_KEY = localStorage.getItem("token");
 
const supplierService = {
  async addSupplier(supplier) {
    try {
      const {
        P_SUPNAME,
        P_CONPERSON,
        P_EMAIL,
        P_PHONENO,
        P_ADDRESS,
        P_CITY,
        P_COUNTRY,
        P_REMARKS,
      } = supplier;

      const url = `${API_URL}/Supplier/AddSupplier?P_SUPNAME=${encodeURIComponent(
        P_SUPNAME
      )}&P_CONPERSON=${encodeURIComponent(
        P_CONPERSON
      )}&P_EMAIL=${encodeURIComponent(
        P_EMAIL
      )}&P_PHONENO=${encodeURIComponent(
        P_PHONENO
      )}&P_ADDRESS=${encodeURIComponent(
        P_ADDRESS
      )}&P_CITY=${encodeURIComponent(
        P_CITY
      )}&P_COUNTRY=${encodeURIComponent(
        P_COUNTRY
      )}&P_REMARKS=${encodeURIComponent(P_REMARKS)}`;

      const response = await axios.get(url, {
        headers: {
          "auth-key": AUTH_KEY,
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  
  
  
  
  
  
  

  
  
  
  
  
  

  async getSupplierById(id) {
    try {
      const response = await axios.get(
        `${API_URL}/Supplier/GetSupplierByCode?P_SUPCODE=${id}`,
        {
          headers: {
            "auth-key": AUTH_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async updateSupplierStatus(id, status) {
    try {
      const response = await axios.get(
        `${API_URL}/Supplier/SupplierStatusUpdate?P_STATUS=${status}&P_SUPCODE=${id}`,
        {
          headers: {
            "auth-key": AUTH_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSupplierByStatus(status) {
    try {
      const response = await axios.get(
        `${API_URL}/Supplier/GetAllSuppliers?P_STATUS=${status}`,
        {
          headers: {
            "auth-key": AUTH_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },

   async getSupplier(status) {
    try {
      const response = await axios.get(
        `${API_URL}/Supplier/GetAllSuppliers?P_STATUS=${status}`,
        {
          headers: {
            "auth-key": AUTH_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },
async getSupplierByStatus(status) {
  try {
    const response = await axios.get(
      `${API_URL}/Supplier/GetAllSuppliers?P_STATUS=${status}`,
      {
        headers: {
          "auth-key": AUTH_KEY,
        },
      }
    );
    
    
    return response.data?.ResultSet || [];
  } catch (error) {

    throw error;
  }
},

async getActive() {
  return this.getSupplierByStatus("A");
},

async getInactive() {
  return this.getSupplierByStatus("I");
},

async getAll() {
  const [active, inactive] = await Promise.all([
    this.getActive(),
    this.getInactive(),
  ]);
  
  
  
  return [...active, ...inactive];
}

};

export default supplierService;