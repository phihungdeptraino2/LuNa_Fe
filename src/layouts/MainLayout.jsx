import React, { useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal"; // ✅ IMPORT

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const handleUserIconClick = () => {
    if (user) {
      if (window.confirm("Bạn muốn đăng xuất?")) logout();
    } else {
      setIsLoginModalOpen(true);
    }
  };
  console.log("User object:", user);


  return (
    <>
      <Header user={user} handleUserIconClick={handleUserIconClick} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenRegister={() => {
          setIsLoginModalOpen(false);
          setRegisterOpen(true);
        }}
        
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onBackToLogin={() => setIsLoginModalOpen(true)}
      />

      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
