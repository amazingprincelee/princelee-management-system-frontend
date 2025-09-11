import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './redux/store'
import LandingPage from './page/LandingPage';
import Login from './page/Login';
import Register from './page/Register';
import Contact from './page/Contact';
import NavComponent from './component/Nav';
import Features from './page/Features';
import Dashboard from './page/admin/Dashboard';
import AddTeacher from './page/admin/add-teacher';
import ManageStudents from './page/admin/manage-students';
import ManageTeachers from './page/admin/manage-teachers';
import Reports from './page/admin/reports';
import ApprovePayment from './page/admin/approve-payment';

import './App.css';

function App() {
 

  return (
    <>
    <Provider store={store}>
    <NavComponent />
    <Routes>
       <Route path='/' element={<LandingPage />} />
       <Route path='/login' element={<Login />} />
       <Route path='/register' element={<Register />} />
       <Route path='/contact' element={<Contact />} />
       <Route path='/features' element={<Features />} />
       <Route path='/dashboard' element={<Dashboard />} />
       <Route path='/add-teachers' element={<AddTeacher />} />
       <Route path='/manage-teachers' element={<ManageStudents />} />
       <Route path='/manage-students' element={<ManageTeachers />} />
       <Route path='/reports' element={<Reports />} />
       <Route path='/approve-payment' element={<ApprovePayment />} />

    </Routes>
    </Provider>
      
    </>
  )
}

export default App
