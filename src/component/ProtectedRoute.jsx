import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { token } = useSelector((state) => state.auth);
 

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;
