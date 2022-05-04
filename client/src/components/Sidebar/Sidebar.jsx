import React, {  } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

export const Sidebar = ({ toggle, clickToggle }) => {
   const isMobile = useMediaQuery({ maxWidth: 1199 })
   const role = localStorage.getItem('role')
   const location = useLocation().pathname
   const navLinkInfos = role === 'undefined' ? [
      {
         title: 'Bosh sahifa',
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
      },
      {
         title: "Lavozimlar",
         link: '/admin/positions',
         icon: 'fas fa-briefcase'
      }
   ] : [
      {
         title: 'Ma\'lumot qo\'shish',
         link: '/admin/employee/add',
         icon: 'fas fa-plus'
      },
      {
         title: 'Vazifalar',
         link: '/admin/employee/task',
         icon: 'fas fa-tasks'
      }
   ]
   return (
      <div className={toggle ? 'toggle-sidebar' : ''}>
         <aside id="sidebar" className="sidebar">

            <ul className="sidebar-nav" id="sidebar-nav">

               {navLinkInfos.map(item => (
                  <li className={'nav-item'} key={item.link}>
                     <Link className={location === item.link ? `nav-link pb-0 bg-primary` : 'nav-link pb-0'} to={item.link} onClick={isMobile && clickToggle}>
                        <span className={'card-title pb-0 pt-0'}>
                           <i className={location === item.link ? `${item.icon} text-white` : `${item.icon}`}></i>
                        </span>
                        <span className={location === item.link ? 'text-white card-title pb-0 pt-0': 'card-title pb-0 pt-0'}>{item.title}</span>
                     </Link>
                  </li>
               ))}
            </ul>

         </aside>
      </div>
   )
}