import { Outlet, Route, Routes } from "react-router-dom";
import routes, { adminRoute } from "./routes";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import { AuthProvider } from "./context/AuthContext";
import AdminLogin from "./pages/Admin/AdminLogin";

function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <Routes>
          {/* Giao diện website chính cho khách truy cập */}
          <Route
            element={
              <div className="booking-shell min-h-screen flex flex-col">
                <Header />
                <Outlet />
                <Footer />
              </div>
            }
          >
            {routes.map((route, index) => {
              const Page = route.page;
              return (
                <Route
                  key={route.path || index}
                  path={route.path}
                  element={<Page />}
                />
              );
            })}
          </Route>

          {/* Route Đăng nhập Admin riêng biệt */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Route Khu vực Quản trị Admin (Được bảo vệ bởi ProtectedRoute) */}
          <Route path={adminRoute.path} element={adminRoute.element}>
            {adminRoute.children.map((childLayout, idx) => (
              <Route key={`admin-layout-${idx}`} element={childLayout.element}>
                {childLayout.children?.map((route) =>
                  route.index ? (
                    <Route key="admin-index" index element={route.element} />
                  ) : (
                    <Route key={route.path} path={route.path} element={route.element} />
                  )
                )}
              </Route>
            ))}
          </Route>
        </Routes>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;
