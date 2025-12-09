import React, { useState, useEffect } from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaPowerOff } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import "../../pages/home/HomePage.css";
import "./Header.css";

const Header = ({ user, logout, handleUserIconClick }) => {
  const location = useLocation();
  const { totalTypes } = useCart();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isPowerDropdownOpen, setPowerDropdownOpen] = useState(false);

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

  // Lấy categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/categories");
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/products");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      const results = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, products]);

  return (
    <header>
      <div className="main-header">
        <div className="logo">
          <Link to={isCustomer ? "/customer/home" : "/"}>
            <span className="logo-luna">Luna</span>
            <span className="logo-music">Music</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />

          {searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((p) => (
                <Link
                  key={p.id}
                  to={`${prefix}/products/${p.id}`}
                  className="search-item"
                  onClick={() => setSearchTerm("")}
                >
                  <img
                    src={`http://localhost:8081${p.productImages.find((img) => img.default)?.imageUrl || ""}`}
                    alt={p.name}
                    className="search-item-img"
                  />
                  <div className="search-item-info">
                    <span className="search-item-name">{p.name}</span>
                    <span className="search-item-price">${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="user-actions">
          <div className="action-item login-btn" onClick={handleUserIconClick}>
            {user ? `Hi, ${user.username}` : <FaUser />}
          </div>

          <div className="action-item">
            <FaHeart className="header-icon" />
          </div>

          <div className="action-item cart-wrapper">
            <Link to={isCustomer ? "/customer/cart" : "/cart"}>
              <FaShoppingCart className="header-icon" />
              {totalTypes > 0 && <span className="badge">{totalTypes}</span>}
            </Link>
          </div>

          {user && (
            <div
              className="dropdown power-dropdown"
              onMouseEnter={() => setPowerDropdownOpen(true)}
              onMouseLeave={() => setPowerDropdownOpen(false)}
            >
              <FaPowerOff className="header-icon clickable" />
              {isPowerDropdownOpen && (
                <div className="dropdown-menu power-menu">
                  <Link to={`${prefix}/profile`} className="dropdown-item" onClick={(e) => e.preventDefault()}>Profile</Link>
                  <Link to={`${prefix}/settings`} className="dropdown-item" onClick={(e) => e.preventDefault()}>Settings</Link>
                  {isAdmin && <Link to="/admin/dashboard" className="dropdown-item">Dashboard</Link>}
                  <div className="dropdown-item" onClick={handleUserIconClick}>Logout</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Nav */}
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
