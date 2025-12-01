import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PUBLIC PAGES
import HomePage from "./pages/home/HomePage";
import ProductDetailPage from "./pages/ProductDetail/ProductDetailPage";
import AboutSection from "./components/menuSections/AboutSection";
import CategorySection from "./components/menuSections/CategorySection";
import ProductSection from "./components/menuSections/ProductSection";
import ServiceSection from "./components/menuSections/ServiceSection";
import ContactSection from "./components/menuSections/ContactSection";

// LAYOUTS
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductManager from "./pages/admin/AdminProductManager";
import AdminDiscountManager from "./pages/admin/AdminDiscountManager";


// --- ROUTE BẢO VỆ ADMIN ---
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

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

          {/* ----- PUBLIC ROUTES DÙNG MAIN LAYOUT ----- */}
            <Route path="/" element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="about" element={<AboutSection />} />
            <Route path="category" element={<CategorySection />} />
            <Route path="products" element={<ProductSection />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="services" element={<ServiceSection />} />
            <Route path="contact" element={<ContactSection />} />

            {/* Product Detail cũng nằm trong Layout để giữ Header + Footer */}
            <Route path="products/:id" element={<ProductDetailPage />} />
          </Route>


          {/* ----- ADMIN ROUTES ----- */}
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
            <Route path="discounts" element={<AdminDiscountManager />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>


          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
