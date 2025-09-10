import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useSelector, useDispatch} from "react-redux";
import { loginUser } from '../redux/features/authSlice'



function Login() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const dispatch = useDispatch()
    const { loading} = useSelector((state)=> state.auth);


    const handleSubmit = (e) => {
         e.preventDefault(); 
         console.log({username, password});
         
        dispatch(loginUser({username, password}))
    }



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Logo */}
      <img
        src={logo}
        alt="School Logo"
        className="w-32 h-auto md:w-40 lg:w-48 mb-6"
      />

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-6">
        Login
      </h1>

      
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md space-y-4">
        
        <input
          type="text"
          placeholder="Enter phone number or email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=> setUsername(e.target.value)}
        />

        
        <input
          type="password"
          placeholder="Enter password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        
        <button
          type="submit"
          className="w-full bg-[#284ea1] text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        
        <p className="text-center text-sm text-gray-600">
          Go back to{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link> |   Get login details{" "}
          <Link to="/contact" className="text-blue-600 hover:underline">
            Details
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
