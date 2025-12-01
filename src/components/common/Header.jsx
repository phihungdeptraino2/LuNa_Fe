import React from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import "../../pages/home/HomePage.css"
import { Link, useLocation } from "react-router-dom";


  const menus = [
    { name: "Trang Chủ", path: "/" },
    { name: "Giới Thiệu", path: "/about" },
    { name: "Danh mục sản phẩm", path: "/category" },
    { name: "Sản phẩm", path: "/products" },
    { name: "Dịch vụ", path: "/services" },
    { name: "Liên hệ", path: "/contact" },
  ];
const Header = ({ user, handleUserIconClick, activeMenu, setActiveMenu }) => {
  return (
    <header>
      <div className="main-header">
        <div className="logo">Luna<span>•</span>Music</div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <FaSearch className="search-icon" />
        </div>
        <div className="user-actions">
          <div className="action-item" onClick={handleUserIconClick}>
            {user ? `Hi, ${user.username}` : <FaUser />}
          </div>
          <FaHeart className="header-icon" />
          <div className="action-item">
            <FaShoppingCart className="header-icon" />
            <span className="badge">0</span>
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
