import React, { useEffect, useState } from 'react'
import { employeeApi } from '../api/employeeApi'
import { positionApi } from '../api/positionApi'
import { taskApi } from '../api/taskApi'
import { Loader } from '../components/Loader/Loader'
import { PageTitle } from '../components/PageTitle/PageTitle'
import { Pagination } from '../components/Paginate/Pagination'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export const Employee = () => {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])
   const [positions, setPositions] = useState([])
   const [currentPage, setCurrentPage] = useState(1)
   const [perPage] = useState(10)
   const [search, setSearch] = useState('')

   const getAll = async () => {
      try {
         const res = await employeeApi.getAll()
         const resPositions = await positionApi.getAll()
         setData(res.data.employeesData)
         setPositions(resPositions.data.positions)
         setLoading(true)
      } catch (err) {}
   }

   useEffect(() => {
      getAll()
   }, [])

   const indexOfLastData = currentPage * perPage;
   const indexOfFirstData = indexOfLastData - perPage;
   const currentData = data.slice(indexOfFirstData, indexOfLastData);

   const filter = data.filter(item => item.employee.fullName.toLowerCase().includes(search.toLowerCase()))

   const paginate = (pageNumber) => setCurrentPage(pageNumber)

   const deleteEmployee = async (e, id) => {
      e.preventDefault()
      try {
         let confirm = window.confirm('Rostan o\'chirmoqchimisz')

         if (confirm) {
            const res = await employeeApi.delete(id)
            toast.success(res.data.message)
            getAll()
         }
      } catch (err) {}
   }
   return (
      <div>
         {loading ? (
            <>
               <div className="card">
                  <div className="card-header pb-0">
                     <div className='d-flex align-items-center justify-content-between'>
                        <PageTitle  title={'Hodimlar'} />
                        <button className='btn btn-primary' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                           <i className='fas fa-plus-circle'></i>
                        </button>
                        <RegisterEmployee positions={positions} getAll={getAll} />
                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-12">
                     <div className="card">
                        <div className="card-header">
                           <input type="text" placeholder='Qidirish...' className='form-control' value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="card-body pt-3 pb-3">
                           <div className="table-responsive">
                              {data.length > 0 ? (
                                 <>
                                    {search.length === 0 ? (
                                       <>
                                          <EmployeeList currentData={currentData} deleteEmployee={deleteEmployee} positions={positions} />
                                          <Pagination totalData={data.length} perPage={perPage} paginate={paginate} />
                                       </>
                                    ): (
                                       filter.length > 0 ? (
                                          <>
                                             <EmployeeList currentData={filter} deleteEmployee={deleteEmployee} positions={positions} />
                                          </>
                                       ): (
                                          <>
                                             <div className='text-center'>
                                                <h3 className='card-title'>
                                                   <i className='fas fa-exclamation-circle me-2'></i>
                                                   Qidiruv natijasida ma'lumot topilmadi
                                                </h3>
                                             </div>
                                          </>
                                       )
                                    )}
                                 </>
                              ): (
                                 <div className='text-center'>
                                    <h3 className='card-title'>
                                       <i className='fas fa-exclamation-circle me-2'></i>
                                       Hodimlar mavjud emas
                                    </h3>
                                 </div>
                              )}
                           </div>
                        </div>
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

const EmployeeList = ({ currentData, deleteEmployee, positions }) => {
   return (
      <table className="table text-center table-hover">
         <tbody>
            <tr className='text-primary'>
               <th>#</th>
               <th>F.I.SH</th>
               <th>UserName</th>
               <th>Lavozimi</th>
               <th>Qo'shgan yangiliklar soni</th>
               <th>Action</th>
            </tr>
            {currentData.map((item, index) => (
               <tr key={index} className="fw-bold">
                  <td>{index + 1}</td>
                  <td>{item.employee.fullName}</td>
                  <td>{item.employee.username}</td>
                  <td>{item.employee.positionId.name}</td>
                  <td>{item.summa}</td>
                  <td>
                     <div className='d-flex align-items-center justify-content-center'>
                        <button className='btn btn-primary text-white me-2' data-bs-toggle="offcanvas" data-bs-target={`#offcanvasRight${item.employee._id}`} aria-controls="offcanvasRight">
                           <i className='fas fa-pen'></i>
                        </button>
                        <UpdateEmployee id={item.employee._id} position={item} positions={positions} />
                        <button className='btn btn-danger text-white me-2' onClick={e => {
                           deleteEmployee(e, item.employee._id)
                        }}>
                           <i className='fas fa-trash-alt'></i>
                        </button>
                        <Link to={`/admin/employee/${item.employee._id}`} className='btn btn-success text-white me-2'>
                           <i className='fas fa-eye'></i>
                        </Link>
                        <button className='btn btn-warning me-2 text-white' data-bs-toggle="offcanvas" data-bs-target={`#sendTask${item.employee._id}`} aria-controls="offcanvasRight">
                           <i className='fas fa-envelope'></i>
                        </button>
                        <SendTask id={item.employee._id} item={item} />
                        <Link to={`/admin/task/employee/${item.employee._id}`} className='btn btn-secondary'>
                           <i className='fas fa-tasks'></i>
                        </Link>
                     </div>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   )
}

const RegisterEmployee = ({ positions, getAll }) => {
   const [fullName, setFullName] = useState('')
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [positionId, setPositionId] = useState('')

   const handleSubmit = async (e) => {
      e.preventDefault()
      const check = {
         fullName: fullName.trim().length === 0,
         username: username.trim().length === 0,
         password: password.trim().length === 0,
         positionId: positionId.trim().length === 0
      }

      if(check.fullName || check.username || check.password || check.positionId) {
         toast.error('Barcha maydonlar to\'ldirilishi shart!')
         return
      }

      const params = {
         fullName,
         username,
         password,
         positionId
      }

      try {
         const res = await employeeApi.create(params)

         toast.success(res.data.message)
         setFullName('')
         setUsername('')
         setPassword('')
         setPositionId('')
         getAll()
      } catch (err) {
         toast.error('Xatolik!')
      }
   }
   return (
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
         <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel" className='card-title'>
               Yangi hodim ro'yxatdan o'tkazish
            </h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
         </div>
         <div className="offcanvas-body">
            <form autoComplete='off' onSubmit={handleSubmit}>
               <div>
                  <label htmlFor="fullName" className='card-title mb-0'>To'liq ism, familiya</label>
                  <input type="text" className="form-control" id="fullName" placeholder='Masalan: Eshmatov Toshmat' value={fullName} onChange={e => setFullName(e.target.value)} />
               </div>
               <div>
                  <label htmlFor="username" className='card-title mb-0'>Username</label>
                  <input type="text" className="form-control" id="username" placeholder='Masalan: eshmatjon' value={username} onChange={e => setUsername(e.target.value)} />
               </div>
               <div>
                  <label htmlFor="password" className='card-title mb-0'>Parol</label>
                  <input type="password" className="form-control" id="password" placeholder='Masalan: eshmatjon123' value={password} onChange={e => setPassword(e.target.value)} />
               </div>
               <div className='mb-4'>
                  <label htmlFor="positionId" className='card-title mb-0'>Lavozim</label>
                  <select className="form-control" id="positionId" value={positionId} onChange={e => setPositionId(e.target.value)}>
                     <option value="">Tanlang</option>
                     {positions.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                     ))}
                  </select>
               </div>
               <button className='btn btn-primary d-block'>
                  <i className='fas fa-plus-circle me-2'></i>
                  Ro'yxatdan o'tkazish
               </button>
            </form>
         </div>
      </div>
   )
}

const UpdateEmployee = ({ position, positions, id }) => {
   const [fullName, setFullName] = useState(position.employee.fullName)
   const [username, setUsername] = useState(position.employee.username)
   const [password, setPassword] = useState('')
   const [positionId, setPositionId] = useState(position.employee.positionId._id)

   const handleSubmit = async (e) => {
      e.preventDefault()
      const check = {
         fullName: fullName.trim().length === 0,
         username: username.trim().length === 0,
         positionId: positionId.trim().length === 0
      }

      if(check.fullName || check.username || check.password || check.positionId) {
         toast.error('Barcha maydonlar to\'ldirilishi shart!')
         return
      }

      const params = {
         fullName,
         username,
         password,
         positionId
      }

      try {
         const res = await employeeApi.update(id, params)

         if(res.status === 200) {
            toast.success(res.data.message)
            setFullName('')
            setUsername('')
            setPassword('')
            setPositionId('')
         }

         setTimeout(() => {
            window.location.reload()
         }, 1500);
      } catch (err) {
         toast.error('Xatolik!')
      }
   }

   return (
      <div className="offcanvas offcanvas-end" tabIndex="-1" id={`offcanvasRight${id}`} aria-labelledby="offcanvasRightLabel">
         <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel" className='card-title'>
               Hodim ma'lumotlarini tahrirlash
            </h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
         </div>
         <div className="offcanvas-body">
            <form autoComplete='off' onSubmit={handleSubmit}>
               <div>
                  <label htmlFor="fullName" className='card-title mb-0 d-block text-start'>To'liq ism, familiya</label>
                  <input type="text" className="form-control" id="fullName" placeholder='Masalan: Eshmatov Toshmat' value={fullName} onChange={e => setFullName(e.target.value)} />
               </div>
               <div>
                  <label htmlFor="username" className='card-title mb-0 d-block text-start'>Username</label>
                  <input type="text" className="form-control" id="username" placeholder='Masalan: eshmatjon' value={username} onChange={e => setUsername(e.target.value)} />
               </div>
               <div>
                  <label htmlFor="password" className='card-title mb-0 d-block text-start'>Parol</label>
                  <input type="password" className="form-control" id="password" placeholder='Masalan: eshmatjon123' value={password} onChange={e => setPassword(e.target.value)} />
               </div>
               <div className='mb-4'>
                  <label htmlFor="positionId" className='card-title mb-0 d-block text-start'>Lavozim</label>
                  <select className="form-control" id="positionId" value={positionId} onChange={e => setPositionId(e.target.value)}>
                     <option value="">Tanlang</option>
                     {positions.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                     ))}
                  </select>
               </div>
               <button className='btn btn-success d-block'>
                  <i className='fas fa-pen me-2'></i>
                  Saqlash
               </button>
            </form>
         </div>
      </div>
   )
}

const SendTask = ({ id, item }) => {
   const [task, setTask] = useState('')

   const handleSubmit = async (e) => {
      e.preventDefault()
      const check = {
         task: task.trim().length === 0
      }

      if(check.task) {
         toast.error('Maydonlarni to\'ldirish shart!')
         return
      }

      const params = {
         task,
         employee: id
      }

      try {
         const res = await taskApi.create(params)
         toast.success(res.data.message)

         setTimeout(() => {
            window.location.reload()
         }, 1500);
      } catch (err) {
         console.log(err.response);
         toast.error(err.response.data.message)
      }
   }
   return (
      <div className="offcanvas offcanvas-end" tabIndex="-1" id={`sendTask${id}`} aria-labelledby="offcanvasRightLabel">
         <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel" className='card-title pb-0 '>
               {item.employee.fullName} ga vazifa yuborish
            </h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
         </div>
         <div className="offcanvas-body">
            <form onSubmit={handleSubmit}>
               <div className='mb-3'>
                  <label htmlFor="task" className='card-title mb-0 pt-0 d-block text-start'>Vazifa</label>
                  <textarea className="form-control" id="task" rows="15" placeholder="Vazifani yozing" value={task} onChange={e => setTask(e.target.value)} />
               </div>
               <button className='btn btn-primary d-block'>
                  <i className='fas fa-pen me-2'></i>
                  Yuborish
               </button>
            </form>
         </div>
      </div>
   )
}