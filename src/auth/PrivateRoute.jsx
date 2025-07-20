import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  //const user = JSON.parse(localStorage.getItem('user'));
  const { user, roles, isAuthenticated } = useAuth();

  if (!token || !user) return <Navigate to="/login" />;

  const hasPermission = allowedRoles.includes(user.role);
  return hasPermission ? children : <Navigate to="/login" />;


  // // 1. Si no está autenticado, redirigir al login
  // if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  // // 2. Si no se requieren roles específicos, permitir el acceso solo por estar autenticado
  // if (allowedRoles.length === 0) return element;

  // // 3. Verificar si el usuario tiene algún rol permitido
  // const hasAccess = roles?.some(role => allowedRoles.includes(role.nm_role));

  // // 4. Si tiene acceso, mostrar el componente; si no, redirigir a "no autorizado"
  // return hasAccess ? element : <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
