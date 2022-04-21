const token = localStorage.getItem('token');
import axios from 'axios';

const baseUrl = 'http://localhost:4000/api/admin/';

export const adminApi = {
   login: (params) => axios.post(
      baseUrl + 'login',
      params
   ),
   summary: () => axios.get(
      baseUrl + 'summary',
      { headers: { Authorization: `Bearer ${token}` } }
   )
}