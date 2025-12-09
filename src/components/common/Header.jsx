import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import "../../pages/home/HomePage.css";

const Header = ({ user, logout, handleUserIconClick }) => {
  const location = useLocation();
  const { totalTypes } = useCart();

  // State
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);

  const isCustomer = user?.roles?.includes("CUSTOMER");
  const isAdmin = user?.roles?.includes("ADMIN");
  const prefix = isCustomer ? "/customer" : "";

  const menus = [
    { name: "Trang Chủ", path: `${prefix}/home` },
    { name: "Giới Thiệu", path: `${prefix}/about` },
    { name: "Danh mục sản phẩm", path: `${prefix}/category` },
    { name: "Sản phẩm", path: `${prefix}/products` },
    { name: "Dịch vụ", path: `${prefix}/services` },
    { name: "Liên hệ", path: `${prefix}/contact` },
  ];

  // Lấy categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header>
      {/* HEADER TOP */}
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

      {/* CATEGORY MENU */}
      <nav className="category-bar">
        {menus.map((menu) => {
          if (menu.name === "Danh mục sản phẩm") {
            return (
              <div
                key={menu.name}
                className="dropdown"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <Link
                  to={menu.path}
                  className={location.pathname === menu.path ? "active-link" : ""}
                >
                  {menu.name}
                </Link>

                {isCategoryDropdownOpen && (
                  <div className="dropdown-menu">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`${prefix}/category?categoryId=${cat.id}`}
                        className="dropdown-item"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={menu.name}
              to={menu.path}
              className={location.pathname === menu.path ? "active-link" : ""}
            >
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
