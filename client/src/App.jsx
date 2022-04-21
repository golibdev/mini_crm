import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Category } from './pages/Category'
import { Dashboard } from './pages/Dashboard'
import { Employee } from './pages/Employee'
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
