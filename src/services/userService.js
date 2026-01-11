import axios from 'axios';
import { API_URL } from '../config';

const token = localStorage.getItem('token');
export const getUsersList = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/Login/GetUsersList`, {
    headers: { 'Content-Type': 'application/json', 'auth-key': token },
  });
  return res.data;
};
export const getUserTypes = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}/Login/GetUserType`, {
    headers: { 'Content-Type': 'application/json', 'auth-key': token },
  });
  return res.data.ResultSet || [];
};
export const addUser = async (name, password, type) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${API_URL}/Login/UserAdd`, null, {
    params: { P_UNAME: name, P_PWORD: password, P_TYPE: type },
    headers: { 'Content-Type': 'application/json', 'auth-key': token },
  });
  return res.data;
};
export const updateUserStatus = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${API_URL}/Login/UserStatusUpdate`,
    null,
    {
      params: { P_ID: id },
      headers: { 'Content-Type': 'application/json', 'auth-key': token },
    }
  );
  return res.data;
};











































