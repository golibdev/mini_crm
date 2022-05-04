import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { employeeApi } from '../api/employeeApi'
import { categoryApi } from '../api/categoryApi'
import { newsCountApi } from '../api/newsCountApi'
import { Loader } from '../components/Loader/Loader'
import { PageTitle } from '../components/PageTitle/PageTitle'
import { Pagination } from '../components/Paginate/Pagination'
import moment from 'moment'
import { toast } from 'react-toastify'

export const EmployeeItem = () => {
   const role = localStorage.getItem('role')
   const id = useParams().id || localStorage.getItem('id')
   const [loading, setLoading] = useState(false)
   const [user, setUser] = useState({})
   const [data, setData] = useState([])
   const [currentPage, setCurrentPage] = useState(1)
   const [perPage] = useState(10)
   const [summa, setSumma] = useState(0)
   const [start, setStart] = useState('')
   const [end, setEnd] = useState('')

   const getAll = async () => {
      try {
         const res = await employeeApi.getById(id)
         setUser(res.data.employee)
         setData(res.data.data.reverse());
         setSumma(res.data.summa)
         setLoading(true)
      } catch (err) {}
   }

   const filterDate = async (e) => {
      e.preventDefault()
      try {
         const startDate = new Date(start)
         const endDate = new Date(end)
         if(startDate.getTime() > endDate.getTime()) {
            toast.error('Bu tarzda filterlash mumkin emas')
            return
         }
         const res = await employeeApi.getByDate(id, start, end)
         setData(res.data.data.reverse());
         setSumma(res.data.summa)
      } catch (err) {}
   }

   useEffect(() => {
      getAll()
   }, [start, end])

   const indexOfLastData = currentPage * perPage;
   const indexOfFirstData = indexOfLastData - perPage;
   const currentData = data.slice(indexOfFirstData, indexOfLastData);

   const paginate = (pageNumber) => setCurrentPage(pageNumber)

   const deleteData = async (e, id) => {
      e.preventDefault()
      try {
         let confirm = window.confirm('Ushbu ma`lumotni o`chirmoqchimisiz?')
         if (confirm) {
            const res = await newsCountApi.delete(id)
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
                  <div className="card-header pb-2">
                     <div className='d-flex align-items-center justify-content-between'>
                        <PageTitle title={user.fullName} />
                        {role !== 'undefined' && (
                           <>
                              <button className='btn btn-primary' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                 <i className='fas fa-plus-circle'></i>
                              </button>
                              <AddData />
                           </>
                        )}
                     </div>
                  </div>
               </div>
               <div className="row">
                  <div className="col-12">
                     <div className="card">
                        <div className="card-header pb-2 pt-2">
                           <div className="accordion" id="accordionExample">
                              <h5 type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" className='card-title pb-0 pt-2'>
                                 <i className="fas fa-filter me-2"></i>
                                 Filter
                              </h5>
                              <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                 <div className="accordion-body">
                                    <div className='row'>
                                       <div className="col-lg-5 col-md-5 col-12 mb-3">
                                          <label htmlFor="start" className='card-title pb-0 pt-0'>Dan</label>
                                          <input type={'datetime-local'} className='form-control' value={start} onChange={e => setStart(e.target.value)} />
                                       </div>
                                       <div className="col-lg-5 col-md-5 col-12 mb-3">
                                          <label htmlFor="end" className='card-title pb-0 pt-0'>Gacha</label>
                                          <input type={"datetime-local"} className='form-control' value={end} onChange={e => setEnd(e.target.value)} />
                                       </div>
                                       <div className="col-12">
                                          <button className='btn btn-primary d-block' onClick={filterDate}>
                                             <i className='fas fa-filter'></i>
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="card-body">
                           <div className="table-responsive">
                              {data.length > 0 ? (
                                 <>
                                    <EmployeeItemList currentData={currentData} deleteData={deleteData} summa={summa} />
                                    <Pagination totalData={data.length} perPage={perPage} paginate={paginate}  />
                                 </>
                              ): (
                                 <div className='text-center'>
                                    <h3 className='card-title'>
                                       <i className='fas fa-exclamation-circle me-2'></i>
                                       Ma'lumotlar mavjud emas
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

const EmployeeItemList = ({ currentData, summa, deleteData }) => {
   return (
      <table className="table text-center table-hover">
         <tbody>
            <tr className='text-primary'>
               <th>#</th>
               <th>Kategoriya</th>
               <th>Ichki kategoriya</th>
               <th>Yangiliklar soni</th>
               <th>Vaqti</th>
               <th>Links</th>
               <th>O'chirish</th>
            </tr>
            {currentData.map((item, index) => (
               <tr key={index} className="fw-bold">
                 <td>{index+1}</td>
                 <td>{item.category.name}</td>
                 <td>{item.subcategory.name}</td>
                 <td>{item.newsCount}</td>
                 <td>{moment(item.createdAt).format('DD.MM.YYYY HH:mm:ss')}</td>
                 <td>
                     <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target={`#exampleModal${index}`}>
                        <i className='fas fa-link'></i>
                     </button>
                     <LinksModal index={index} links={item.links} />
                 </td>
                 <td>
                     <button className='btn btn-danger' onClick={(e) => {
                        deleteData(e, item._id)
                     }}>
                        <i className='fas fa-trash-alt'></i>
                     </button>
                 </td>
               </tr>
            ))}
         </tbody>
         <tfoot>
            <tr>
               <td colSpan='7'>
                  <h4 className='text-start fw-bold'>
                     Jami: {summa} ta
                  </h4>
               </td>
            </tr>
         </tfoot>
      </table>
   )
}

const AddData = () => {
   const [categories, setCategories] = useState([])
   const [subcategories, setSubcategories] = useState([])
   const [categoryId, setCategoryId] = useState('')
   const [subcategoryId, setSubcategoryId] = useState('')
   const [newsCount, setNewsCount] = useState('')
   const [links, setLinks] = useState([])

   const getAll = async () => {
      try {
         const res = await categoryApi.getAll()
         setCategories(res.data.categories)
      } catch (err) {}
   }

   const getSubcategories = async () => {
      try {
         const filterCategory = categories.filter(item => item.id === categoryId)
         setSubcategories(filterCategory[0].subcategories);
      } catch (err) {}
   }

   useEffect(() => {
      getAll()
      getSubcategories()
   }, [categoryId])

   const addData = async (e) => {
      e.preventDefault()

      const check = {
         categoryId: categoryId.trim().length === 0,
         subcategoryId: subcategoryId.trim().length === 0,
         newsCount: newsCount.trim().length === 0,
         links: links.length === 0
      }

      if (check.categoryId || check.subcategoryId || check.newsCount || check.links) {
         toast.error('Iltimos ma`lumotlarni toliq kiriting')
         return
      }

      const params = {
         category: categoryId,
         subcategory: subcategoryId,
         newsCount: newsCount,
         links: links,
         employeeId: localStorage.getItem('id')
      }

      try {
         const res = await newsCountApi.create(params)
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
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
         <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel" className='card-title'>
               Ma'lumot qo'shish
            </h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
         </div>
         <div className="offcanvas-body">
            <form autoComplete='off' onSubmit={addData}>
               <div className=''>
                  <label htmlFor="count" className='card-title d-block text-start mb-0'>Yangilik soni</label>
                  <input type="number" className="form-control" id="count" placeholder="Soni" value={newsCount} onChange={e => setNewsCount(e.target.value)} />
               </div>
               <div className=''>
                  <label htmlFor="category" className='card-title d-block text-start mb-0'>Kategoriya</label>
                  <select className='form-control' id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                     <option value=''>Tanlang</option>
                     {categories.map((item, index) => (
                        <option key={index} value={item._id}>{item.name}</option>
                     ))}
                  </select>
               </div>
               <div className=''>
                  <label htmlFor="category" className='card-title d-block text-start mb-0'>Ichki Kategoriya</label>
                  <select className='form-control' id="category" value={subcategoryId} onChange={e => setSubcategoryId(e.target.value)}>
                     <option value=''>Tanlang</option>
                     {subcategories.map((item, index) => (
                        <option key={index} value={item._id}>{item.name}</option>
                     ))}
                  </select>
               </div>
               <div className='mb-3'>
                  <label htmlFor="links" className='card-title d-block text-start mb-0'>Havolalar ruyxati</label>
                  <textarea className='form-control' id="links" rows="8" placeholder='Havolalar ruyxati' value={links} onChange={e => setLinks(e.target.value)}></textarea>
               </div>
               <button className='btn btn-primary'>
                  <i className='fas fa-plus-circle me-2'></i>
                  Qo'shish
               </button>
            </form>
         </div>
      </div>
   )
}

const LinksModal = ({ links, index }) => {
   const [linksArray, setLinksArray] = useState([])

   useEffect(() => {
      setLinksArray(links.split('\n'))
   }, [links])
   return (
      <div className="modal fade" id={`exampleModal${index}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
         <div className="modal-dialog modal-lg">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title card-title pb-0 pt-0" id="exampleModalLabel">
                     {linksArray.length} ta havolalar
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div className="modal-body">
                  <ul className='list-group'>
                     {linksArray.map((link, index) => (
                        <li key={index} className='list-group-item'>
                           <a href={link} target='_blank' rel='noopener noreferrer' className='d-block text-start card-title pb-0 pt-0' style={{ fontSize: '14px' }}> <i className='fas fa-link me-2'></i>{index+1}. {link}</a>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="modal-footer">
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Yopish</button>
               </div>
            </div>
         </div>
      </div>
   )
}