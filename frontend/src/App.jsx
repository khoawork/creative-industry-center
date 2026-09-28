import { Route, Routes } from 'react-router-dom'
import routes from './routes/index.jsx'
import Home from './pages/Home/Home.jsx'
import { navigation } from './config/shared/site.js'

function App() {
  return (
    <div className="booking-shell min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Các đường dẫn chưa có trang riêng tạm giữ giao diện Home. */}
        {navigation.map((item) => <Route key={item.href} path={item.href} element={<Home />} />)}
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
    </div>
  );
}

export default App;
