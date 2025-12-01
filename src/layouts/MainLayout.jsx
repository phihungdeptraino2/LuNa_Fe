import React, { useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleUserIconClick = () => {
    if (user) {
      if (window.confirm("Bạn muốn đăng xuất?")) logout();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      {/* Header bây giờ nhận props user + handler */}
      <Header user={user} handleUserIconClick={handleUserIconClick} />

      {/* Login modal cũng đặt ở đây */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <main style={{ minHeight: "80vh" }}>
        <Outlet /> {/* Render trang con */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
