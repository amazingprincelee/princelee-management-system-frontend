import { Routes, Route } from 'react-router-dom'
import LandingPage from './page/LandingPage'
import Login from './page/Login'
import Register from './page/Register'
import Contact from './page/Contact'
import NavComponent from './component/Nav'
import Features from './page/Features'
import './App.css'

function App() {
 

  return (
    <>
    <NavComponent />
    <Routes>
       <Route path='/' element={<LandingPage />} />
       <Route path='/login' element={<Login />} />
       <Route path='/register' element={<Register />} />
       <Route path='/contact' element={<Contact />} />
       <Route path='/features' element={<Features />} />
    </Routes>
      
    </>
  )
}

export default App
