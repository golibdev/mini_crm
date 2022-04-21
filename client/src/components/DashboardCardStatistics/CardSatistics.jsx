import React from 'react'

export const CardSatistics = ({ data, title }) => {
   return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-12">
         <div className="card card-statistic-1">
            <div className="card-wrap">
               <div className="card-header">
                  <h5 className='fw-bold text-primary mb-0'>{title}</h5>
               </div>
               <div className="card-body">
                  <h4 className='mb-0 mt-3 fw-bold'>{data}</h4>
               </div>
            </div>
         </div>
      </div>
   )
}
