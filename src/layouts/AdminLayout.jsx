import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaBox,
  FaUser,
  FaChartBar,
  FaShoppingCart,
  FaSignOutAlt,
  FaHome,
  FaTags,
  FaList,
  FaStore,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "bg-[#5a02c2]" : "hover:bg-[#333]";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh", // <--- ĐỔI minHeight THÀNH height: Cố định chiều cao bằng màn hình
        overflow: "hidden", // <--- QUAN TRỌNG: Ngăn trang web cuộn, giữ Sidebar đứng yên
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: "260px",
          background: "#1e1e2d",
          color: "#a2a3b7",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0, // <--- Đảm bảo Sidebar không bị co lại
          overflowY: "auto", // <--- Nếu menu quá dài, chỉ Sidebar mới cuộn
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h2
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: "800",
              letterSpacing: 1,
            }}
          >
            LUNA <span style={{ color: "#5a02c2" }}>ADMIN</span>
          </h2>
          <p style={{ fontSize: 12, color: "#555", marginTop: 5 }}>
            Management System
          </p>
        </div>

        {/* Menu List */}
        <ul style={{ listStyle: "none", padding: 0, flex: 1 }}>
          <MenuItem
            to="/admin/dashboard"
            icon={<FaChartBar />}
            label="Dashboard"
            isActive={isActive("/admin/dashboard")}
          />
          <MenuItem
            to="/admin/products"
            icon={<FaBox />}
            label="Products"
            isActive={isActive("/admin/products")}
          />
          <MenuItem
            to="/admin/categories"
            icon={<FaList />}
            label="Categories"
            isActive={isActive("/admin/categories")}
          />
          <MenuItem
            to="/admin/brands"
            icon={<FaStore />}
            label="Brands"
            isActive={isActive("/admin/brands")}
          />
          <MenuItem
            to="/admin/orders"
            icon={<FaShoppingCart />}
            label="Orders"
            isActive={isActive("/admin/orders")}
          />
          <MenuItem
            to="/admin/users"
            icon={<FaUser />}
            label="Users"
            isActive={isActive("/admin/users")}
          />
          <MenuItem
            to="/admin/discounts"
            icon={<FaTags />}
            label="Discounts"
            isActive={isActive("/admin/discounts")}
          />
        </ul>

        {/* Footer Sidebar */}
        <div style={{ borderTop: "1px solid #333", paddingTop: 20 }}>
          <Link
            to="/"
            style={{
              color: "#a2a3b7",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 15,
              padding: "10px",
              borderRadius: 5,
              transition: "0.2s",
            }}
            className="hover:text-white"
          >
            <FaHome /> Visit Website
          </Link>

          <button
            onClick={logout}
            style={{
              background: "#3699ff",
              border: "none",
              color: "white",
              padding: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
              width: "100%",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "background 0.2s",
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          background: "#f5f8fa",
          height: "100%", // <--- Chiều cao bằng cha (100vh)
          overflowY: "auto", // <--- QUAN TRỌNG: Chỉ cho phép phần này cuộn dọc
          display: "flex", // Giữ flex để bố trí Header và Content dọc
          flexDirection: "column",
        }}
      >
        <header
          style={{
            height: 60,
            background: "white",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            padding: "0 30px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
            flexShrink: 0, // <--- Giữ Header không bị co khi cuộn
            position: "sticky", // (Tùy chọn) Giữ Header dính trên cùng khi cuộn nội dung
            top: 0,
            zIndex: 10,
          }}
        >
          <span style={{ fontWeight: "bold", color: "#333" }}>Admin Panel</span>
        </header>

        <div style={{ padding: "30px" }}>
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              boxShadow: "0 0 20px rgba(0,0,0,0.03)",
              minHeight: "80vh",
            }}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

const MenuItem = ({ to, icon, label, isActive }) => (
  <li style={{ marginBottom: 5 }}>
    <Link
      to={to}
      className={isActive}
      style={{
        color: isActive.includes("bg-") ? "white" : "inherit",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 15,
        padding: "12px 15px",
        borderRadius: "8px",
        fontWeight: "500",
        transition: "all 0.2s",
      }}
    >
      {icon} {label}
    </Link>
  </li>
);

export default AdminLayout;
