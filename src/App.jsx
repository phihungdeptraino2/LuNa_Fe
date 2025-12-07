"use client";

import { Routes, Route, Navigate } from "react-router-dom";
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
import AdminOrderManager from "./pages/admin/AdminOrderManager";

import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderReviewPage from "./pages/order/OrderReviewPage";
import OrderSuccessPage from "./pages/order/OrderSuccessPage";
import ReviewPage from "./pages/review/ReviewPage";

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
      <Routes>
        {/* ----- PUBLIC + CUSTOMER ROUTES ----- */}
        <Route path="/" element={<MainLayout />}>
          {/* Public pages */}
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutSection />} />
          <Route path="category" element={<CategorySection />} />
          <Route path="products" element={<ProductSection />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="services" element={<ServiceSection />} />
          <Route path="contact" element={<ContactSection />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-review" element={<OrderReviewPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="products/:id/reviews" element={<ReviewPage />} />

          {/* Customer pages */}
          <Route path="customer/home" element={<HomePage />} />
          <Route path="customer/about" element={<AboutSection />} />
          <Route path="customer/category" element={<CategorySection />} />
          <Route path="customer/products" element={<ProductSection />} />
          <Route path="customer/products/:id" element={<ProductDetailPage />} />
          <Route path="customer/services" element={<ServiceSection />} />
          <Route path="customer/contact" element={<ContactSection />} />
          <Route path="customer/cart" element={<CartPage />} />
          <Route path="customer/checkout" element={<CheckoutPage />} />
          <Route
            path="customer"
            element={<Navigate to="customer/home" replace />}
          />
          <Route
            path="customer/products/:id/reviews"
            element={<ReviewPage />}
          />
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
          <Route path="orders" element={<AdminOrderManager />} />

          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
