import { Route, Routes } from "react-router-dom";
import routes from "./routes";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

function App() {
  return (
    <div className="booking-shell min-h-screen flex flex-col">
      <Header />
      <Routes>
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;