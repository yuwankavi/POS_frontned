import axios from "axios";
import { API_URL } from '../config';


const customerService = {
  async addCustomer(customer) {
    try {
      const {
        p_name,
        p_phone,
        p_email,
        p_address,
        p_dob,
        p_points_balance,
        p_tier_level,
      } = customer;
      const token = localStorage.getItem('token');
      const url = `${API_URL}/Customer/AddCustomer?p_name=${encodeURIComponent(p_name)}
      &p_phone=${encodeURIComponent(p_phone)}
      &p_email=${encodeURIComponent(p_email)}
      &p_address=${encodeURIComponent(p_address)}
      &p_dob=${encodeURIComponent(p_dob)}
      &p_points_balance=${encodeURIComponent(p_points_balance || 0)}
      &p_tier_level=${encodeURIComponent(p_tier_level || "")}`;

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

  async getAll() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/Customer/GetAllCustomers`, {
        headers: {
          "auth-key": token,
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async getCustomerByPhoneNumber(phoneNumber) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/Customer/GetCustomerByPhone?P_PHONE=${phoneNumber}`,
        {
          headers: {
            "auth-key": token,
          },
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  async updateCustomer(customer) {
  try {
    const token = localStorage.getItem('token');

    
    const url = new URL(`${API_URL}/Customer/UpdateCustomer`);
    url.searchParams.append("P_PHONE", customer.phoneNumber);
    url.searchParams.append("P_NAME", customer.name || "");
    url.searchParams.append("P_EMAIL", customer.email || "");
    url.searchParams.append("P_ADDRESS", customer.address || "");
    url.searchParams.append("P_DOB", customer.dob || "");
    url.searchParams.append("P_POINTS_BALANCE", customer.pointsBalance || 0);
    url.searchParams.append("P_TIER_LEVEL", customer.tierLevel || "");

    const response = await axios.get(url.toString(), {
      headers: {
        "auth-key": token,
      },
    });

    return response.data;
  } catch (error) {

    throw error;
  }
}

};


export default customerService;
