import React, { useEffect, useState } from "react";
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

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Trang Chủ");
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

      const CATEGORY_LIST = [
    {
      name: "Guitars and Basses",
      img: "https://cdn-icons-png.flaticon.com/512/4430/4430537.png",
    },
    {
      name: "Drums and Percussion",
      img: "https://cdn-icons-png.flaticon.com/512/1255/1255799.png",
    },
    {
      name: "Keys",
      img: "https://cdn-icons-png.flaticon.com/512/2895/2895537.png",
    },
    {
      name: "Studio and Recording",
      img: "https://cdn-icons-png.flaticon.com/512/9385/9385244.png",
    },
    {
      name: "Software",
      img: "https://cdn-icons-png.flaticon.com/512/2285/2285564.png",
    },
    {
      name: "PA Equipment",
      img: "https://cdn-icons-png.flaticon.com/512/3233/3233499.png",
    },
    {
      name: "Lighting and Stage",
      img: "https://cdn-icons-png.flaticon.com/512/3159/3159313.png",
    },
    {
      name: "DJ Equipment",
      img: "https://cdn-icons-png.flaticon.com/512/3067/3067272.png",
    },
    {
      name: "Broadcast & Video",
      img: "https://cdn-icons-png.flaticon.com/512/3660/3660412.png",
    },
    {
      name: "Microphones",
      img: "https://cdn-icons-png.flaticon.com/512/3065/3065873.png",
    },
    {
      name: "Effect & Signal Proc.",
      img: "https://cdn-icons-png.flaticon.com/512/5900/5900350.png",
    },
    {
      name: "Wind Instruments",
      img: "https://cdn-icons-png.flaticon.com/512/860/860264.png",
    },
    {
      name: "Traditional Instruments",
      img: "https://cdn-icons-png.flaticon.com/512/886/886915.png",
    },
    {
      name: "Sheet Music",
      img: "https://cdn-icons-png.flaticon.com/512/3028/3028564.png",
    },
    {
      name: "Cases, Racks and Bags",
      img: "https://cdn-icons-png.flaticon.com/512/2855/2855904.png",
    },
    {
      name: "Cables and Connectors",
      img: "https://cdn-icons-png.flaticon.com/512/3659/3659911.png",
    },
    {
      name: "Accessories",
      img: "https://cdn-icons-png.flaticon.com/512/1066/1066367.png",
    },
    {
      name: "Stompenberg FX",
      img: "https://cdn-icons-png.flaticon.com/512/3131/3131924.png",
    },
  ];

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

  return (
    <div className="homepage-wrapper">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <div className="super-top-bar">CYBERWEEK - Save up to 70% 🔥 Shop Now!</div>
      <Header 
        user={user} 
        logout={logout} 
        handleUserIconClick={handleUserIconClick} 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
      />

      <div className="menu-content-area">
        {activeMenu === "Trang Chủ" && (
          <>
            <HeroBanner />
            <TrustBar />
            <CyberWeekCarousel products={products} loading={loading} />
            <CategoriesList CATEGORY_LIST={CATEGORY_LIST} />
          </>
        )}
        {activeMenu === "Giới Thiệu" && <AboutSection />}
        {activeMenu === "Danh mục sản phẩm" && <CategorySection />}
        {activeMenu === "Sản phẩm" && <ProductSection />}
        {activeMenu === "Dịch vụ" && <ServiceSection />}
        {activeMenu === "Liên hệ" && <ContactSection />}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
