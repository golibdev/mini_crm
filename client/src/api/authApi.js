const token = localStorage.getItem('token');
import axios from 'axios';

const baseUrl = 'http://localhost:4000/api/admin/';

export const authApi = {
   login: (params) => axios.post(
      baseUrl + 'login',
      params
   )
}