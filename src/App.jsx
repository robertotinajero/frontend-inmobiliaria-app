import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/contract/Contracts";
import Properties from "./pages/property/Properties";
import Tenants from "./pages/tenant/Tenants";
import Landlords from "./pages/landlord/Landlords";
import Users from "./pages/Users/Users";
import PrivateRoute from "./auth/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas con Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/tenants" element={<Tenants />} />
            <Route path="/landlords" element={<Landlords />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
