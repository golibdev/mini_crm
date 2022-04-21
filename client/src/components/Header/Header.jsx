import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../handlers/auth'

export const Header = ({ clickToggle }) => {
   const navigate = useNavigate()
   const fullName = localStorage.getItem('fullName') || 'Super Admin'
   return (
      <header id="header" className="header fixed-top d-flex align-items-center">

         <div className="d-flex align-items-center justify-content-between">
            <Link to="/admin" className="logo d-flex align-items-center">
               {/* <img src="/assets/img/logo.png" alt="" /> */}
               <span className="d-block d-lg-block">Effect.Uz</span>
            </Link>
            <i className="fas fa-bars toggle-sidebar-btn text-primary" style={{ fontSize: '25px' }} onClick={clickToggle} ></i>
         </div>
         <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
               <li className="nav-item dropdown pe-3">
                  <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                     <i className="fas fa-user-circle fs-2"></i>
                     <span className="d-none d-md-block dropdown-toggle ps-2">{fullName}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                     <li>
                        <a className="dropdown-item d-flex align-items-center" onClick={() => {
                           logout(navigate)
                        }}>
                           <i className="fas fa-arrow-left"></i>
                           <span>Chiqish</span>
                        </a>
                     </li>
                  </ul>
               </li>
            </ul>
         </nav>
      </header>
   )
}