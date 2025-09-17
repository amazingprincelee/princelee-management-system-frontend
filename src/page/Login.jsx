import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoFallback from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchSchoolInfo } from "../redux/features/schoolSlice";
import { loginUser } from "../redux/features/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, token, message } = useSelector((state) => state.auth);
  const { school, loading: schoolLoading } = useSelector((state) => state.school);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    if (!school) {
      dispatch(fetchSchoolInfo());
    }
  }, [dispatch, school]);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [message, token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      {/* Logo */}
      {schoolLoading ? (
        <div className="w-32 h-32 mb-6 bg-gray-300 rounded-full animate-pulse"></div>
      ) : (
        <img
          src={school?.schoolLogo || logoFallback}
          alt="School Logo"
          className="object-contain w-32 h-auto mb-6 md:w-40 lg:w-48"
        />
      )}

      {/* Heading */}
      <h1 className="mb-6 text-2xl font-bold text-gray-500 md:text-3xl">
        Login
      </h1>

      <p className="text-red-500">{message}</p>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 space-y-4 bg-white shadow-md rounded-2xl"
      >
        {/* Username */}
        <input
          type="text"
          placeholder="Enter phone number or email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 flex items-center text-gray-500 right-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#284ea1] text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Links */}
        <p className="text-sm text-center text-gray-600">
          Go back to{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>{" "}
          | Get login details{" "}
          <Link to="/contact" className="text-blue-600 hover:underline">
            Details
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
