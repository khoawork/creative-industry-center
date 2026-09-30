import { Outlet, Route, Routes } from "react-router-dom";
import routes, { adminRoute } from "./routes";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

function App() {
  return (
    <Routes>
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
      <Route path={adminRoute.path} element={adminRoute.element}>
        {adminRoute.children.map((route) =>
          route.index ? (
            <Route key="admin-index" index element={route.element} />
          ) : (
            <Route key={route.path} path={route.path} element={route.element} />
          )
        )}
      </Route>
    </Routes>
  );
}

export default App;
