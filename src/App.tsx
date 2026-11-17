import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ModuleRoute, ModuleView, HomeRedirect } from "@/routes/ModuleRoute";
import { ThemeSync } from "@/components/ThemeSync";
import { AppLayout } from "@/layouts/AppLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ProductsPage } from "@/pages/products/ProductsPage";
import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage";
import { BusinessPage } from "@/pages/business/BusinessPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { OrdersPage } from "@/pages/orders/OrdersPage";
import { OrderHistoryPage } from "@/pages/orders/OrderHistoryPage";
import { OrderDetailPage } from "@/pages/orders/OrderDetailPage";
import { VentasPage } from "@/pages/ventas/VentasPage";
import { AdministracionPage } from "@/pages/administracion/AdministracionPage";
import { BakeryAnalyticsPage } from "@/pages/analytics/BakeryAnalyticsPage";
import { ComingSoonPage } from "@/pages/common/ComingSoonPage";

// Cada página privada: sesión + organización cargada + layout.
function PrivatePage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeSync />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivatePage>
                <HomeRedirect />
              </PrivatePage>
            }
          />

          {/* Control de stock */}
          <Route
            path="/productos"
            element={
              <PrivatePage>
                <ModuleRoute kind="stock">
                  <ProductsPage />
                </ModuleRoute>
              </PrivatePage>
            }
          />
          <Route
            path="/pedidos"
            element={
              <PrivatePage>
                <ModuleRoute kind="stock">
                  <OrdersPage />
                </ModuleRoute>
              </PrivatePage>
            }
          />
          <Route
            path="/pedidos/historial"
            element={
              <PrivatePage>
                <ModuleRoute kind="stock">
                  <OrderHistoryPage />
                </ModuleRoute>
              </PrivatePage>
            }
          />
          <Route
            path="/pedidos/:orderId"
            element={
              <PrivatePage>
                <ModuleRoute kind="stock">
                  <OrderDetailPage />
                </ModuleRoute>
              </PrivatePage>
            }
          />

          {/* Panadería */}
          <Route
            path="/ventas"
            element={
              <PrivatePage>
                <ModuleRoute kind="bakery">
                  <VentasPage />
                </ModuleRoute>
              </PrivatePage>
            }
          />
          <Route
            path="/administracion"
            element={
              <PrivatePage>
                <ModuleRoute kind="bakery">
                  <AdministracionPage />
                </ModuleRoute>
              </PrivatePage>
            }
          />

          {/* Compartidas: cada tipo de organización ve su versión */}
          <Route
            path="/analiticas"
            element={
              <PrivatePage>
                <ModuleView
                  views={{
                    stock: <AnalyticsPage />,
                    bakery: <BakeryAnalyticsPage />,
                  }}
                />
              </PrivatePage>
            }
          />
          <Route
            path="/negocio"
            element={
              <PrivatePage>
                <ModuleView
                  views={{
                    stock: <BusinessPage />,
                    bakery: <ComingSoonPage title="Gestión del negocio" />,
                  }}
                />
              </PrivatePage>
            }
          />
          <Route
            path="/configuracion"
            element={
              <PrivatePage>
                <SettingsPage />
              </PrivatePage>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
