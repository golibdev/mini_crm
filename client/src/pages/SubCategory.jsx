import React, { useState, useEffect} from 'react'
import { toast } from 'react-toastify'
import { categoryApi } from '../api/categoryApi'
import { subcategoryApi } from '../api/subcategoryApi'
import { Loader } from '../components/Loader/Loader'
import { PageTitle } from '../components/PageTitle/PageTitle'
import { Pagination } from '../components/Paginate/Pagination'

export const SubCategory = () => {
   const [loading, setLoading] = useState(false)
   const [search, setSearch] = useState('')
   const [data, setData] = useState([])
   const [categories, setCategories] = useState([])
   const [currentPage, setCurrentPage] = useState(1)
   const [perPage] = useState(10)

   const getAll = async () => {
      try {
         const res = await subcategoryApi.getAll()
         const resCategory = await categoryApi.getAll()
         setData(res.data.subcategories.reverse())
         setCategories(resCategory.data.categories.reverse())
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
            const res = await subcategoryApi.delete(id)
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
                  <PageTitle title={'Ichki kategoriya'} />
                  <button className='btn btn-primary' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                     <i className='fas fa-plus-circle'></i>
                  </button>
                  <CreateSubCategory getAll={getAll} categories={categories} />
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
                                          <SubCategoryList categories={categories} currentData={currentData} deleteCategory={deleteCategory} />
                                          <Pagination totalData={data.length} perPage={perPage} paginate={paginate} />
                                       </>
                                    ):(
                                       filter.length > 0 ? (
                                          <>
                                             <SubCategoryList categories={categories} currentData={filter} deleteCategory={deleteCategory} />
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

const SubCategoryList = ({ currentData, deleteCategory, categories }) => {
   return (
      <table className='table table-hover text-center'>
          <tbody>
            <tr className='text-primary'>
               <th>#</th>
               <th>Nomi</th>
               <th>Kategoriya</th>
               <th>Action</th>
            </tr>
            {currentData.map((item, index) => (
               <tr key={index} className="fw-bold">
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.category.name}</td>
                  <td>
                     <div className='d-flex align-items-center justify-content-center'>
                        <button className='btn btn-primary text-white me-2' data-bs-toggle="offcanvas" data-bs-target={`#offcanvasRight${item._id}`} aria-controls="offcanvasRight">
                           <i className='fas fa-pen'></i>
                        </button>
                        <UpdateSubCategory categories={categories} subcategory={item} id={item._id}/>
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

const CreateSubCategory = ({ getAll, categories }) => {
   const [name, setName] = useState('')
   const [category, setCategory] = useState('')

   const create = async (e) => {
      e.preventDefault()
      const check = {
         name: name.trim().length === 0,
         category: category.trim().length === 0
      }

      if (check.name || check.category) {
         toast.error('Barcha maydonlar to\'ldirilishi shart')
         return
      }

      const params = {
         name,
         category
      }
      try {
         const res = await subcategoryApi.create(params)
         toast.success(res.data.message)
         getAll()
         setName('')
         setCategory('')
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
            <form autoComplete='off' onSubmit={create}>
               <div className='mb-3'>
                  <label htmlFor="name" className='card-title mb-0 d-block text-start'>Kategoriya nomi</label>
                  <input type="text" className="form-control" id="name" placeholder='Masalan: Yangi' value={name} onChange={e => setName(e.target.value)} />
               </div>
               <div className='mb-3'>
                  <label htmlFor="category" className='card-title mb-0 d-block text-start'>Kategoriya</label>
                  <select className="form-control" id="category" value={category} onChange={e => setCategory(e.target.value)}>
                     <option value=''>--Kategoriya tanlang--</option>
                     {categories.map((item, index) => (
                        <option key={index} value={item._id}>{item.name}</option>
                     ))}
                  </select>
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

const UpdateSubCategory = ({ id, categories, subcategory }) => {
   const [name, setName] = useState(subcategory.name)
   const [category, setCategory] = useState(subcategory.category._id)

   const update = async (e) => {
      e.preventDefault()

      const check = {
         name: name.trim().length === 0,
         category: category.trim().length === 0
      }

      if (check.name || check.category) {
         toast.error('Barcha maydonlar to\'ldirilishi shart')
         return
      }

      const params = {
         name,
         category
      }

      try {
         const res = await subcategoryApi.update(id, params)
         toast.success(res.data.message)
         setName('')
         setCategory('')

         setTimeout(() => {
            window.location.reload()
         }, 1500);
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
            <form autoComplete='off' onSubmit={update}>
               <div className='mb-3'>
                  <label htmlFor="name" className='card-title mb-0 d-block text-start'>Kategoriya nomi</label>
                  <input type="text" className="form-control" id="name" placeholder='Masalan: Yangi' value={name} onChange={e => setName(e.target.value)} />
               </div>
               <div className='mb-3'>
                  <label htmlFor="category" className='card-title mb-0 d-block text-start'>Kategoriya</label>
                  <select className="form-control" id="category" value={category} onChange={e => setCategory(e.target.value)}>
                     <option value=''>--Kategoriya tanlang--</option>
                     {categories.map((item, index) => (
                        <option key={index} value={item._id}>{item.name}</option>
                     ))}
                  </select>
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