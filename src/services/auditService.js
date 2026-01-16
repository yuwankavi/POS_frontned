import axios from 'axios';
import { API_URL } from '../config';

export const getUsersLog = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/Login/GetUsersLog`, {
      headers: { 'Content-Type': 'application/json', 'auth-key': token },
    });
    return res.data.ResultSet || [];
  } catch (error) {
    console.error('Error fetching user logs:', error);
    throw error;
  }
};

export default {
  getUsersLog,
};
