import React from "react";
import { Outlet, Link } from "react-router-dom";
// Import thêm FaHome
import {
  FaBox,
  FaUser,
  FaChartBar,
  FaShoppingCart,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: "250px",
          background: "#1a1a1a",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: 40, textAlign: "center", color: "#5a02c2" }}>
          Luna Admin
        </h2>

        <ul style={{ listStyle: "none", padding: 0, flex: 1 }}>
          <li style={{ marginBottom: 20 }}>
            <Link
              to="/admin/dashboard"
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 16,
              }}
            >
              <FaChartBar /> Thống kê
            </Link>
          </li>
          <li style={{ marginBottom: 20 }}>
            <Link
              to="/admin/products"
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 16,
              }}
            >
              <FaBox /> Sản phẩm
            </Link>
          </li>
          <li style={{ marginBottom: 20 }}>
            <Link
              to="/admin/orders"
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 16,
              }}
            >
              <FaShoppingCart /> Đơn hàng
            </Link>
          </li>
          <li style={{ marginBottom: 20 }}>
            <Link
              to="/admin/users"
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 16,
              }}
            >
              <FaUser /> Người dùng
            </Link>
          </li>
        </ul>

        {/* --- MỚI: NÚT VỀ TRANG CHỦ (SHOP) --- */}
        <div style={{ borderTop: "1px solid #333", paddingTop: 20 }}>
          <Link
            to="/"
            style={{
              color: "#aaa",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 15,
              paddingLeft: 10,
              fontSize: 14,
            }}
          >
            <FaHome /> Xem trang web
          </Link>

          <button
            onClick={logout}
            style={{
              background: "#e91e63", // Màu hồng cho nút thoát nổi bật
              border: "none",
              color: "white",
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
              width: "100%",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "30px", background: "#f4f6f8" }}>
        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            minHeight: "100%",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
