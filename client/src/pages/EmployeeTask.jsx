import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '../components/Loader/Loader'
import { PageTitle } from '../components/PageTitle/PageTitle'
import { employeeApi } from '../api/employeeApi'
import { taskApi } from '../api/taskApi'
import { Pagination } from '../components/Paginate/Pagination'
import { toast } from 'react-toastify'

export const EmployeeTask = () => {
   const id = useParams().id || localStorage.getItem('id')
   const role = localStorage.getItem('role')
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])
   const [user, setUser] = useState({})
   const [currentPage, setCurrentPage] = useState(1)
   const [perPage] = useState(10)

   const getData = async () => {
      try {
         const res = await employeeApi.getTasks(id)
         const resUser = await employeeApi.getById(id)
         setData(res.data.tasks)
         setUser(resUser.data.employee)
         setLoading(true)
      } catch (err) {}
   }

   useEffect(() => {
      getData()
   }, [])

   const indexOfLastData = currentPage * perPage;
   const indexOfFirstData = indexOfLastData - perPage;
   const currentData = data.slice(indexOfFirstData, indexOfLastData);
   const paginate = (pageNumber) => setCurrentPage(pageNumber)

   const deleteTask = async (id) => {
      try {
         const confirm = window.confirm('Rostan ham o\'chirilsinmi?')

         if (confirm) {
            const res = await taskApi.delete(id)
            toast.success(res.data.message)
            getData()
         }

      } catch (err) {
         toast.error(err.response.data.message)
      }
   }

   const changeTaskStatus = async (id, status) => {
      try {
         const confirm = window.confirm('Rostan ham bajarilsinmi?')

         if (status === false && confirm) {
            const res = await taskApi.changeStatus(id)
            toast.success(res.data.message)
            getData()
         } else {
            toast.warning('Allaqachon status o\'zgartirilgan!')
         }

      } catch (err) {
         toast.error(err.response.data.message)
      }
   }
   return (
      <div>
         {loading ? (
            <>
               <div className='card'>
                  <div className="card-header pb-0">
                     <div className="d-flex align-items-center justify-content-between">
                        <PageTitle title={`${user.fullName}`} />
                     </div>
                  </div>
               </div>
               <div className="card">
                  <div className="card-body pb-0 pt-3">
                     <div className="table-responsive">
                        {data.length > 0 ? (
                           <>
                              <TaskList currentData={currentData} currentPage={currentPage} role={role} deleteTask={deleteTask} changeTaskStatus={changeTaskStatus} />
                              <Pagination totalData={data.length} perPage={perPage} paginate={paginate}  />
                           </>
                        ): (
                           <div className='text-center'>
                              <h3 className='card-title pb-2'>
                                 <i className='fas fa-exclamation-circle me-2'></i>
                                 Ma'lumotlar mavjud emas
                              </h3>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </>
         ): (
            <Loader/>
         )}
      </div>
   )
}

const TaskList = ({ currentData, currentPage, role, deleteTask, changeTaskStatus }) => {
   return (
      <table className='table table-hover text-center'>
         <tbody>
            <tr className='text-primary'>
               <th>#</th>
               <th>Vazifa</th>
               <th>Status</th>
               <th>Funksiyalar</th>
            </tr>
            {currentData.map((task, index) => (
               <tr key={index}>
                  <td>{currentPage * 10 - 9 + index}</td>
                  <td>{task.task}</td>
                  <td>{task.status === false ? (
                        <span className='text-danger'>
                           <i className='fas fa-times-circle me-2'></i>
                           Bajarilmagan
                        </span>
                     ): (
                        <span className='text-success'>
                           <i className='fas fa-check-circle me-2'></i>
                           Bajarildi
                        </span>
                     )}
                  </td>
                  <td>
                     <div>
                        {role !== 'undefined' ? (
                           <button className={task.status === false ? 'btn btn-success' : 'btn btn-danger'} disabled={task.status === true ? 'disabled' : ''} onClick={() => {
                              changeTaskStatus(task._id, task.status)
                           }}>
                              {task.status === false ? 'Bajarish' : 'Bajarildi'}
                           </button>
                        ): (
                           <button className='btn btn-danger' onClick={(e) => {
                              deleteTask(task._id)
                           }}>
                              <i className='fas fa-trash-alt'></i>
                           </button>
                        )}
                     </div>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   )
}