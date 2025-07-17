import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './auth/PrivateRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<Dashboard />}
              allowedRoles={['admin', 'editor']}
            />
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
        {/* Ruta no encontrada */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
