import React, { useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'
import { categoryApi } from '../api/categoryApi'
import { subcategoryApi } from '../api/subcategoryApi'
import { employeeApi } from '../api/employeeApi'
import { CardSatistics } from '../components/DashboardCardStatistics/CardSatistics'
import { Loader } from '../components/Loader/Loader'
import { PageTitle } from '../components/PageTitle/PageTitle'

export const Dashboard = () => {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])
   const [categories, setCategories] = useState([])
   const [subcategories, setSubcategories] = useState([])
   const [employees, setEmployees] = useState([])

   const getData = async () => {
      try {
         const res = await adminApi.summary()
         const resCategory = await categoryApi.getAll()
         const resSubcategory = await subcategoryApi.getAll()
         const resEmployee = await employeeApi.getAll()
         setData(res.data)
         setCategories(resCategory.data.categories)
         setSubcategories(resSubcategory.data.subcategories)
         setEmployees(resEmployee.data.employees)
         setLoading(true)
      } catch (error) {}
   }

   useEffect(() => {
      getData()
   }, [])
   return (
      <div>
         {loading ? (
            <>
               <div className='d-flex align-items-center justify-content-between'>
                  <PageTitle title={'Dashboard'} />
               </div>
               <div className='row'>
                  <CardSatistics title={`Hodimlar soni`} data={data.countEmployees} />
                  <CardSatistics title={`Lavozimlar soni`} data={data.countPositions} />
                  <CardSatistics title={`Kategoriyalar soni`} data={data.countCategories} />
                  <CardSatistics title={`Ichki kategoriyalar soni`} data={data.countSubCategories} />
               </div>

               <div className="row">
                  <div className="col-12">
                     <div className="card">
                        <div className="card-header">
                           <h3 className='card-title mb-0'>Umumiy statistika</h3>
                        </div>
                        <div className="card-body">
                           <div className="table-responsive mt-3">
                              <table className='table table-bordered text-center'>
                                 <tbody>
                                    <tr>
                                       <td rowSpan="2">
                                          <p className='fw-bold mb-0'>Hodimlar</p>
                                       </td>
                                       {categories.map((category, index) => (
                                          <td key={index} colSpan={category.subcategories.length}>
                                             <p className='fw-bold mb-0'>{category.name}</p>
                                          </td>
                                       ))}
                                    </tr>
                                    <tr>
                                       {subcategories.map((subcategory, index) => (
                                          <td key={index}>
                                             <p className='fw-bold mb-0'>{subcategory.name}</p>
                                          </td>
                                       ))}
                                    </tr>
                                    {employees.map((employee, index) => (
                                       <tr key={index}>
                                          <td>
                                             <p className='fw-bold mb-0'>{employee.fullName}</p>
                                          </td>
                                          {subcategories.map((item, index) => (
                                             <td key={index}>  
                                                <p className='mb-0 fw-bold'>
                                                   {item.newsCounts.map((newsCount, index) => (
                                                      <span key={index}>
                                                         {newsCount.employeeId === employee._id ? newsCount.newsCount : null}
                                                      </span>
                                                   ))}
                                                </p>
                                             </td>
                                          ))}
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
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
