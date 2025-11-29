import React from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import "../../pages/home/HomePage.css"

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
        {["Trang Chủ","Giới Thiệu","Danh mục sản phẩm","Sản phẩm","Dịch vụ","Liên hệ"].map(menu => (
          <span 
            key={menu} 
            className={activeMenu === menu ? "active-link" : ""} 
            onClick={() => setActiveMenu(menu)}
          >
            {menu}
          </span>
        ))}
      </nav>
    </header>
  );
};

export default Header;
