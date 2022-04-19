import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Login } from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/admin' element={<AppLayout/>}>
          <Route index element={<div>Dashboard</div>} />
          <Route path='/admin/employees' element={<div>Employee</div>} />
          <Route path='/admin/categories' element={<div>Categories</div>} />
          <Route path='/admin/subcategories' element={<div>SubCategories</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
