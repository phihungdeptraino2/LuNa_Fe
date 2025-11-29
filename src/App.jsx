import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/home/HomePage";
import ProductDetailPage from "./pages/ProductDetail/ProductDetailPage";

import AboutSection from "./components/menuSections/AboutSection";
import CategorySection from "./components/menuSections/CategorySection";
import ProductSection from "./components/menuSections/ProductSection";
import ServiceSection from "./components/menuSections/ServiceSection";
import ContactSection from "./components/menuSections/ContactSection";


// Import Admin Components (Giờ đã có file rồi nên không lỗi nữa)
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductManager from "./pages/admin/AdminProductManager";

// --- COMPONENT BẢO VỆ ROUTE ADMIN ---
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Đợi load user xong

  // Logic kiểm tra: Phải có user VÀ user phải có quyền ADMIN
  if (!user || !user.roles || !user.roles.includes("ADMIN")) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* --- MENU ROUTES TRONG HOMEPAGE --- */}
          <Route path="/about" element={<AboutSection />} />
          <Route path="/category" element={<CategorySection />} />
          <Route path="/products" element={<ProductSection />} />
          <Route path="/services" element={<ServiceSection />} />
          <Route path="/contact" element={<ContactSection />} />

          {/* --- ADMIN ROUTES (ĐƯỢC BẢO VỆ) --- */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductManager />} />
            {/* Nếu vào /admin khơi khơi thì nhảy về dashboard */}
            <Route index element={<Navigate to="dashboard" />} />
          </Route>

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
