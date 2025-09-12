import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useSelector, useDispatch} from "react-redux";
import { loginUser } from '../redux/features/authSlice'



function Login() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, token, user} = useSelector((state)=> state.auth);

    
    const handleSubmit = (e) => {
         e.preventDefault(); 
        dispatch(loginUser({username, password})); 
    }

    useEffect(()=>{ 
      if(user || token){
        navigate("/dashboard")
      } 
    }, [user, token, navigate])

    



  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      {/* Logo */}
      <img
        src={logo}
        alt="School Logo"
        className="w-32 h-auto mb-6 md:w-40 lg:w-48"
      />

      {/* Heading */}
      <h1 className="mb-6 text-2xl font-bold text-gray-500 md:text-3xl">
        Login
      </h1>

      
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 space-y-4 bg-white shadow-md rounded-2xl">
        
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

        
        <p className="text-sm text-center text-gray-600">
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
