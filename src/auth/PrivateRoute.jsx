import { Navigate, Outlet  } from 'react-router-dom';

export default function PrivateRoute() {
  const token = localStorage.getItem('token'); // validar token

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
