import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ProductsPage } from "@/pages/products/ProductsPage";
import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage";
import { BusinessPage } from "@/pages/business/BusinessPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Navigate to="/productos" replace />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analiticas"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalyticsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/negocio"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BusinessPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;