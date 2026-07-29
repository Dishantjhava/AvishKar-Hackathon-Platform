import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { isAuth, role } = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  const roleRoutes = {
    admin: "/dashboard/admin",
    organizer: "/dashboard/organizer",
    participant: "/dashboard/participant",
    judge: "/dashboard/judge",
  };

  const target = roleRoutes[role] || "/dashboard/participant";

  return <Navigate to={target} replace />;
};

export default Dashboard;
