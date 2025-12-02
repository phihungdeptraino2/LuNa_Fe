import React from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import "../../pages/home/HomePage.css";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext"

const Header = ({ user, handleUserIconClick }) => {
  const location = useLocation();
  const { totalTypes } = useCart();

  // Kiểm tra role customer
  const isCustomer = user?.roles?.includes("CUSTOMER");

  const prefix = user && user.roles.includes("CUSTOMER") ? "/customer" : "";
  const menus = [
    { name: "Trang Chủ", path: `${prefix}/home` },
    { name: "Giới Thiệu", path: `${prefix}/about` },
    { name: "Danh mục sản phẩm", path: `${prefix}/category` },
    { name: "Sản phẩm", path: `${prefix}/products` },
    { name: "Dịch vụ", path: `${prefix}/services` },
    { name: "Liên hệ", path: `${prefix}/contact` },
  ];

  return (
    <header>
      <div className="main-header">
        <div className="logo">
          <Link to={isCustomer ? "/customer/home" : "/"}>Luna<span>•</span>Music</Link>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <FaSearch className="search-icon" />
        </div>
        <div className="user-actions">
          <div className="action-item login-btn" onClick={handleUserIconClick}>
            {user ? `Hi, ${user.username}` : <FaUser />}
          </div>

          <FaHeart className="header-icon" />

          {/* Giỏ hàng với link dynamic */}
          <div className="action-item">
            <Link to={isCustomer ? "/customer/cart" : "/cart"}>
              <FaShoppingCart className="header-icon" />
              {totalTypes > 0 && <span className="badge">{totalTypes}</span>}
            </Link>
          </div>
        </div>
      </div>

      <nav className="category-bar">
        {menus.map(menu => (
          <Link
            key={menu.name}
            to={menu.path}
            className={location.pathname === menu.path ? "active-link" : ""}
          >
            {menu.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};


export default Header;
