import React, { useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'
import { CardSatistics } from '../components/DashboardCardStatistics/CardSatistics'
import { Loader } from '../components/Loader/Loader'
import { PageTitle } from '../components/PageTitle/PageTitle'

export const Dashboard = () => {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])

   const getData = async () => {
      try {
         const res = await adminApi.summary()
         setData(res.data)
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
            </>
         ): (
            <Loader/>
         )}
      </div>
   )
}
