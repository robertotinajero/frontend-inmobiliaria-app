import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Contract from './pages/contract/Contracts';
import PrivateRoute from './auth/PrivateRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />

        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida */}
        <Route path="/home" element={
          // <PrivateRoute allowedRoles={['admin', 'editor']}>
          <Dashboard />
          // {/* </PrivateRoute> */}
        }
        >
          <Route index element={<Home />} />
          {/* /dashboard */}
          {/* Ejemplo de más subrutas */}
          <Route path="contratos" element={<Contract />} />
          {/* <Route path="usuarios" element={<Usuarios />} /> */}
        </Route>


        {/* Ruta no encontrada */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter >
  );
};

export default AppRoutes;
