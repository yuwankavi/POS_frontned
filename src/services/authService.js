import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (P_UNAME, P_PWORD) => {
    try {
      const response = await api.post('/Login/UserLogin', {
        P_UNAME,
        P_PWORD,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const logId = user?.LogId;
    const userId = user?.userId;

    if (!logId || !userId) {
      throw new Error("Missing LogId or UserId for logout");
    }

    const response = await api.get(
      `/Login/UserLogout?P_LOGID=${logId}&P_ID=${userId}`
    );

    return response.data;
  } catch (error) {

    throw error.response?.data || { message: "Logout failed" };
  }
},

  verifyToken: async (token) => {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token verification failed' };
    }
  }
};

export default authService;