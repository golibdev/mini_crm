import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../api/adminApi'
import { isAuthenticated } from '../handlers/auth'
import { toast, ToastContainer } from 'react-toastify'

export const Login = () => {
   const navigate = useNavigate()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   useEffect(() => {
      const redirectAdminPanel = () => {
         const token = localStorage.getItem('token');
         const isAuth = isAuthenticated(token)
         if (isAuth) return navigate('/admin')
      }
      redirectAdminPanel()
   }, [])

   const loginHandler = async (e) => {
      e.preventDefault()
      
      const check = {
         username: username.trim().length === 0,
         password: password.trim().length === 0
      }

      if(check.username || check.password) {
         toast.warning("Barcha maydonlar to'ldirilishi shart")
         return
      }

      const params = {
         username,
         password
      }

      try {
         const res = await adminApi.login(params)
         if(res.status === 200) {
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('fullName', res.data.admin.fullName)
            localStorage.setItem('role', res.data.role)
            localStorage.setItem('id', res.data.admin._id)
            toast.success("Biroz kuting")
            setTimeout(() => {
               window.location.reload()
            }, 2000)
         }
      } catch (err) {
         if(err.response === undefined) {
            toast.error('Internetga ulanmagan')
            return
         } else if(err.response.status === 401) {
            toast.error(err.response.data.message)
            return
         }
      }
   }
   return (
      <div className='d-flex align-items-center justify-content-center' id='login-container'>
         <div className="container">
            <div className="row">
               <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-12">
                  <form onSubmit={loginHandler} className="card border-top border-5 border-primary">
                     <div className="card-header text-center">
                        <h1 className='fw-bold text-dark'>Effect.Uz</h1>
                     </div>
                     <div className="card-body">
                        <div className='mb-3'>
                           <label htmlFor="username" className='mb-2 fw-bold'>Username</label>
                           <input type="text" className='form-control' id='username' placeholder='Username' autoComplete='off' value={username} onChange={e => setUsername(e.target.value)} />
                        </div>
                        <div className='mb-3'>
                           <label htmlFor="password" className='mb-2 fw-bold'>Password</label>
                           <input type="password" className='form-control' id='password' placeholder='Username' autoComplete='off' value={password} onChange={e => setPassword(e.target.value)}/>
                        </div>
                     </div>
                     <div className="card-footer">
                        <button className='btn btn-primary btn-block'>
                           Kirish
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
         <ToastContainer/>
      </div>
   )
}