const token = localStorage.getItem('token');
import axios from 'axios';

const baseUrl = 'https://effectapi.serius.uz/api/subcategory/';

export const subcategoryApi = {
   getAll: () => axios.get(
      baseUrl,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   getById: (id) => axios.get(
      baseUrl + id,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   create: (params) => axios.post(
      baseUrl,
      params,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   update: (id, params) => axios.put(
      baseUrl + id,
      params,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   delete: (id) => axios.delete(
      baseUrl + id,
      { headers: { Authorization: `Bearer ${token}` } }
   )
}