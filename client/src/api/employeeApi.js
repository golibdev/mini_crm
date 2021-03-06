const token = localStorage.getItem('token');
import axios from 'axios';

const baseUrl = 'http://localhost:4000/api/employee/';

export const employeeApi = {
   getAll: () => axios.get(
      baseUrl,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   getTasks: (id) => axios.get(
      `${baseUrl}${id}/tasks`,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   getById: (id) => axios.get(
      baseUrl + id,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   getByDate: (id, start, end) => axios.get(
      `${baseUrl}date/${id}?start=${start}&end=${end}`,
      { headers: { Authorization: `Bearer ${token}` } }
   ),
   create: (params) => axios.post(
      baseUrl+'register', 
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