import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Category } from './pages/Category'
import { Dashboard } from './pages/Dashboard'
import { Employee } from './pages/Employee'
import { EmployeeItem } from './pages/EmployeeItem'
import { EmployeeTask } from './pages/EmployeeTask'
import { Login } from './pages/Login'
import { Position } from './pages/Position'
import { SubCategory } from './pages/SubCategory'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/admin' element={<AppLayout/>}>
          <Route index element={<Dashboard/>} />
          <Route path='/admin/employees' element={<Employee/>} />
          <Route path='/admin/categories' element={<Category/>} />
          <Route path='/admin/subcategories' element={<SubCategory/>} />
          <Route path='/admin/positions' element={<Position/>} />
          <Route path='/admin/employee/:id' element={<EmployeeItem/>} />
          <Route path='/admin/task/employee/:id' element={<EmployeeTask/>} />
          <Route path='/admin/employee/add' element={<EmployeeItem/>} />
          <Route path='/admin/employee/task' element={<EmployeeTask/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
