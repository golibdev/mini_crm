import React, {  } from 'react'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

export const Sidebar = ({ toggle, clickToggle }) => {
   const isMobile = useMediaQuery({ maxWidth: 1199 })
   const navLinkInfos = [
      {
         title: 'Dashboard',
         link: '/admin',
         icon: 'fas fa-home'
      },
      {
         title: 'Hodimlar',
         link: '/admin/employees',
         icon: 'fas fa-users'
      },
      {
         title: "Kategoriyalar",
         link: '/admin/categories',
         icon: 'fas fa-list'
      },
      {
         title: "Sub kategoriyalar",
         link: '/admin/subcategories',
         icon: 'fas fa-list-alt'
      }
   ]
   return (
      <div className={toggle ? 'toggle-sidebar' : ''}>
         <aside id="sidebar" className="sidebar">

            <ul className="sidebar-nav" id="sidebar-nav">

               {navLinkInfos.map(item => (
                  <li className="nav-item" key={item.link}>
                     <Link className="nav-link " to={item.link} onClick={isMobile && clickToggle}>
                        <i className={item.icon}></i>
                        <span>{item.title}</span>
                     </Link>
                  </li>
               ))}
            </ul>

         </aside>
      </div>
   )
}