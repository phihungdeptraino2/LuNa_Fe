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

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Tạo danh sách category từ API
  const categoryListFromDB = [...new Set(products.map(p => p.category.name))].map(name => ({
    name,
    img: "",
  }));

  // Load products
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

  // User avatar click
  const handleUserIconClick = () => {
    if (user) {
      if (window.confirm("Bạn muốn đăng xuất?")) logout();
    } else setIsLoginModalOpen(true);
  };

  return (
    <div className="homepage-wrapper">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      {/* <div className="super-top-bar">CYBERWEEK - Save up to 70% 🔥 Shop Now!</div> */}

      {/* <Header 
        user={user} 
        logout={logout} 
        handleUserIconClick={handleUserIconClick}
      /> */}

      {/* 🟩 HomePage chỉ hiển thị TRANG CHỦ */}
      <div className="menu-content-area">
        <HeroBanner />
        <TrustBar />
        <CyberWeekCarousel products={products} loading={loading} />
        <CategoriesList CATEGORY_LIST={categoryListFromDB} />
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
