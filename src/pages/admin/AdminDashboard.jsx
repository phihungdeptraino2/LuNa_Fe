import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Dashboard Thống Kê</h1>
      <p>Chào mừng quay trở lại trang quản trị.</p>

      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
        <div
          style={{
            background: "#e3f2fd",
            padding: 20,
            borderRadius: 8,
            flex: 1,
          }}
        >
          <h3>Tổng doanh thu</h3>
          <p style={{ fontSize: 24, fontWeight: "bold", color: "#1976d2" }}>
            150,000,000 ₫
          </p>
        </div>
        <div
          style={{
            background: "#e8f5e9",
            padding: 20,
            borderRadius: 8,
            flex: 1,
          }}
        >
          <h3>Đơn hàng mới</h3>
          <p style={{ fontSize: 24, fontWeight: "bold", color: "#388e3c" }}>
            12
          </p>
        </div>
        <div
          style={{
            background: "#fff3e0",
            padding: 20,
            borderRadius: 8,
            flex: 1,
          }}
        >
          <h3>Sản phẩm</h3>
          <p style={{ fontSize: 24, fontWeight: "bold", color: "#f57c00" }}>
            105
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
