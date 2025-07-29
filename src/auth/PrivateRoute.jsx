import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token'); // validar token

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
