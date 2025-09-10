import { Link } from "react-router-dom"
import logo from "../assets/logo.png"

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Logo */}
      <img
        src={logo}
        alt="School Logo"
        className="w-32 h-auto md:w-40 lg:w-48 mb-6"
      />

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Login
      </h1>

      {/* Form */}
      <form className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md space-y-4">
        {/* Email/Phone */}
        <input
          type="text"
          placeholder="Enter phone number or email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#284ea1] text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Register link */}
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
