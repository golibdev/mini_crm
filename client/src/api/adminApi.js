const token = localStorage.getItem('token');
import axios from 'axios';

const baseUrl = 'https://effectapi.serius.uz/api/admin/';

export const adminApi = {
   login: (params) => axios.post(
      baseUrl + 'login',
      params
   ),
   summary: () => axios.get(
      baseUrl + 'summary',
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   dailySummary: () => axios.get(
      baseUrl + 'summary?daily=true',
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   ratingSummary: () => axios.get(
      baseUrl + 'summary?rating=true',
      { headers: { Authorization: `Bearer ${token}` } }
   )
}