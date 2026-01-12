import { API_URL } from '../config';

const formatDate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getInvoiceReports = async (startDate) => {
  const dateStr = startDate ? startDate : formatDate(new Date());
  const url = `${API_URL}/SRD/GetInvoiceReports?p_start_date=${encodeURIComponent(dateStr)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch reports: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data; // { StatusCode, Result, ResultSet }
};

export default {
  getInvoiceReports
};
