import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../../components/LoginModal";
import Header from "../../components/common/Header";
import HeroBanner from "../../components/common/HeroBanner";
import TrustBar from "../../components/common/TrustBar";
import CyberWeekCarousel from "../../components/common/CyberWeekCarousel";
import CategoriesList from "../../components/common/CategoriesList";
import Footer from "../../components/common/Footer";
import AboutSection from "../../components/menuSections/AboutSection";
import CategorySection from "../../components/menuSections/CategorySection";
import ProductSection from "../../components/menuSections/ProductSection";
import ServiceSection from "../../components/menuSections/ServiceSection";
import ContactSection from "../../components/menuSections/ContactSection";
import ProductDetailPage from "../../pages/ProductDetail/ProductDetailPage";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Trang Chủ");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Tạo danh sách category từ products
  const categoryListFromDB = [...new Set(products.map(p => p.category.name))].map(name => ({
    name,
    img: "", // tạm thời No Image
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.length > 0 ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserIconClick = () => {
    if (user) {
      if (window.confirm("Bạn muốn đăng xuất?")) logout();
    } else setIsLoginModalOpen(true);
  };

  const handleMenuChange = (menu) => {
  setActiveMenu(menu);
  setSelectedProduct(null); // reset khi đổi menu
};


  return (
    <div className="homepage-wrapper">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <div className="super-top-bar">CYBERWEEK - Save up to 70% 🔥 Shop Now!</div>
      <Header 
        user={user} 
        logout={logout} 
        handleUserIconClick={handleUserIconClick} 
        activeMenu={activeMenu} 
        setActiveMenu={handleMenuChange} 
      />

      <div className="menu-content-area">
        {activeMenu === "Trang Chủ" && (
          <>
            <HeroBanner />
            <TrustBar />
            <CyberWeekCarousel products={products} loading={loading} />
            <CategoriesList CATEGORY_LIST={categoryListFromDB} />
          </>
        )}

        {activeMenu === "Giới Thiệu" && <AboutSection />}
        {activeMenu === "Danh mục sản phẩm" && <CategorySection />}
        
        {activeMenu === "Sản phẩm" && (
          <>
            {!selectedProduct && <ProductSection onSelectProduct={setSelectedProduct} />}
            {selectedProduct && <ProductDetailPage product={selectedProduct} onBack={() => setSelectedProduct(null)} />}
          </>
        )}


        {activeMenu === "Dịch vụ" && <ServiceSection />}
        {activeMenu === "Liên hệ" && <ContactSection />}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
