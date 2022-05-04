const token = localStorage.getItem('token');
import axios from 'axios';

const baseUrl = 'http://localhost:4000/api/task/';

export const taskApi = {
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
   delete: (id) => axios.delete(
      baseUrl + id,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   changeStatus: (id) => axios.put(
      baseUrl + 'change-status/' + id,
      { headers: { Authorization: `Bearer ${token}` } }
   )
}