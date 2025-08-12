import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "../src/components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/contract/Contracts";
import Properties from "./pages/property/Properties";
import Tenants from "./pages/tenant/Tenants";
import Landlords from "./pages/landlord/Landlords";
import PrivateRoute from "./auth/PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pública */}
        <Route path="/login" element={<Login />} />

        {/* Privadas con layout independiente */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contracts"
          element={
            <PrivateRoute>
              <Layout>
                <Contracts />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <Layout>
                <Properties />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <PrivateRoute>
              <Layout>
                <Tenants />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/landlords"
          element={
            <PrivateRoute>
              <Layout>
                <Landlords />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
