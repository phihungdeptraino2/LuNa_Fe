import React from "react";

const AdminProductManager = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Quản lý sản phẩm</h1>
        <button
          style={{
            padding: "10px 20px",
            background: "#5a02c2",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          + Thêm sản phẩm mới
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
            <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
              Tên sản phẩm
            </th>
            <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>Giá</th>
            <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
              Tồn kho
            </th>
            <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>1</td>
            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
              Fender Stratocaster
            </td>
            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
              $849.00
            </td>
            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>20</td>
            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
              <button style={{ marginRight: 5 }}>Sửa</button>
              <button style={{ color: "red" }}>Xóa</button>
            </td>
          </tr>
          {/* Các dòng khác... */}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductManager;
