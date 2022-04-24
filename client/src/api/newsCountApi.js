const token = localStorage.getItem('token');
import axios from 'axios';

const baseUrl = 'https://effectapi.serius.uz/api/newsCount/';

export const newsCountApi = {
   create: (params) => axios.post(
      baseUrl,
      params,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   delete: (id) => axios.delete(
      baseUrl + id,
      { headers: { Authorization: `Bearer ${token}` } }
   )
}