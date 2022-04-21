import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { categoryApi } from '../api/categoryApi'
import { Loader } from '../components/Loader/Loader'
import { PageTitle } from '../components/PageTitle/PageTitle'
import { Pagination } from '../components/Paginate/Pagination'

export const Category = () => {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])
   const [currentPage, setCurrentPage] = useState(1)
   const [perPage] = useState(10)
   const [search, setSearch] = useState('')
   
   const getAll = async () => {
      try {
         const res = await categoryApi.getAll()
         setData(res.data.categories.reverse())
         setLoading(true)
      } catch (err) {}
   }

   useEffect(() => {
      getAll()
   }, [])

   const indexOfLastData = currentPage * perPage;
   const indexOfFirstData = indexOfLastData - perPage;
   const currentData = data.slice(indexOfFirstData, indexOfLastData);
   const paginate = (pageNumber) => setCurrentPage(pageNumber)

   const filter = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))

   const deleteCategory = async (e, id) => {
      try {
         let confirm = window.confirm('Rostan o\'chirmoqchimisz')

         if (confirm) {
            const res = await categoryApi.delete(id)
            toast.success(res.data.message)
            getAll()
         }
      } catch (err) {}
   }
   return (
      <div>
         {loading ? (
            <>
               <div className='d-flex align-items-center justify-content-between'>
                  <PageTitle title={'Kategoriya'} />
                  <button className='btn btn-primary' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                     <i className='fas fa-plus-circle'></i>
                  </button>
                  <CreateCategory getAll={getAll} />
               </div>
               <div className="row">
                  <div className="col-12">
                     <div className="card">
                        <div className="card-header">
                           <input type="text" placeholder='Qidirish...' className='form-control' value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="card-body">
                           <div className="table-reponsive">
                              {data.length > 0 ? (
                                 <>
                                    {search.length === 0 ? (
                                       <>
                                          <CategoryList currentData={currentData} deleteCategory={deleteCategory} />
                                          <Pagination totalData={data.length} perPage={perPage} paginate={paginate} />
                                       </>
                                    ):(
                                       filter.length > 0 ? (
                                          <>
                                             <CategoryList currentData={filter} deleteCategory={deleteCategory} />
                                          </>
                                       ):(
                                          <div className='text-center'>
                                             <h3 className='card-title'>
                                                <i className='fas fa-exclamation-circle me-2'></i>
                                                Qidiruv natijasida ma'lumot topilmadi
                                             </h3>
                                          </div>
                                       )
                                    )}
                                 </>
                              ): (
                                 <div className='text-center'>
                                    <h3 className='card-title'>
                                       <i className='fas fa-exclamation-circle me-2'></i>
                                       Kategoriyalar mavjud emas
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

const CategoryList = ({ currentData, deleteCategory }) => {
   return (
      <table className="table text-center table-hover">
         <tbody>
            <tr className='text-primary'>
               <th>#</th>
               <th>Nomi</th>
               <th>Ichki kategoriyalar soni</th>
               <th>Action</th>
            </tr>
            {currentData.map((item, index) => (
               <tr key={index} className="fw-bold">
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.subcategories.length}</td>
                  <td>
                     <div className='d-flex align-items-center justify-content-center'>
                        <button className='btn btn-primary text-white me-2' data-bs-toggle="offcanvas" data-bs-target={`#offcanvasRight${item._id}`} aria-controls="offcanvasRight">
                           <i className='fas fa-pen'></i>
                        </button>
                        <UpdateCategory id={item._id} category={item} />
                        <button className='btn btn-danger text-white' onClick={e => {
                           deleteCategory(e, item._id)
                        }}>
                           <i className='fas fa-trash-alt'></i>
                        </button>
                     </div>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   )
}

const CreateCategory = ({ getAll }) => {
   const [name, setName] = useState('')

   const createCategory = async (e) => {
      e.preventDefault()

      const check = {
         name: name.trim().length === 0
      }

      if (check.name) {
         toast.error('Kategoriya nomini kiriting')
         return
      }

      const params = {
         name
      }
      try {
         const res = await categoryApi.create(params)
         toast.success(res.data.message)
         setName('')
         getAll()
      } catch (err) {
         toast.error(err.response.data.message)   
      }
   }
   return (
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
         <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel" className='card-title'>
               Kategoriya qo'shish
            </h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
         </div>
         <div className="offcanvas-body">
            <form autoComplete='off' onSubmit={createCategory}>
               <div className='mb-3'>
                  <label htmlFor="name" className='card-title mb-0'>Kategoriya nomi</label>
                  <input type="text" className="form-control" id="name" placeholder='Masalan: Yangiliklar' value={name} onChange={e => setName(e.target.value)} />
               </div>
               <button className='btn btn-primary d-block'>
                  <i className='fas fa-plus-circle me-2'></i>
                  Qo'shish
               </button>
            </form>
         </div>
      </div>
   )
}

const UpdateCategory = ({ id, category }) => {
   const [name, setName] = useState(category.name)

   const updateCategory = async (e) => {
      e.preventDefault()

      const check = {
         name: name.trim().length === 0
      }

      if (check.name) {
         toast.error('Kategoriya nomini kiriting')
         return
      }

      const params = {
         name
      }
      try {
         const res = await categoryApi.update(id, params)
         toast.success(res.data.message)
         setName('')

         setTimeout(() => {
            window.location.reload()
         }, 1000);
      } catch (err) {
         toast.error(err.response.data.message)   
      }
   }
   return (
      <div className="offcanvas offcanvas-end" tabIndex="-1" id={`offcanvasRight${id}`} aria-labelledby="offcanvasRightLabel">
         <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel" className='card-title'>
               Kategoriya qo'shish
            </h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
         </div>
         <div className="offcanvas-body">
            <form autoComplete='off' onSubmit={updateCategory}>
               <div className='mb-3'>
                  <label htmlFor="name" className='card-title d-block text-start mb-0'>Kategoriya nomi</label>
                  <input type="text" className="form-control" id="name" placeholder='Masalan: Yangiliklar' value={name} onChange={e => setName(e.target.value)} />
               </div>
               <button className='btn btn-success d-block'>
                  <i className='fas fa-save me-2'></i>
                  Saqlash
               </button>
            </form>
         </div>
      </div>
   )
}