import { Route, Routes } from "react-router-dom";
// import Header from "./layouts/header";
import routes from "./routes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Route, Routes } from 'react-router-dom'
import routes from './routes/index.jsx'
import Home from './pages/Home/Home.jsx'
import { navigation } from './config/shared/site.js'
import "./main.css";
import RecordHolder from './pages/RecordHolder/RecordHolder.jsx'
import { navigation, siteLinks } from './config/shared/site.js'

function App() {
  return (
    <div className="booking-shell min-h-screen">
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