import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const AdminDiscountManager = () => {
  // Dữ liệu giả lập (Sau này gọi API)
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: "WELCOME2025",
      percent: 10,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "Active",
    },
    {
      id: 2,
      code: "SUMMER_SALE",
      percent: 20,
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      status: "Inactive",
    },
    {
      id: 3,
      code: "BLACK_FRIDAY",
      percent: 50,
      startDate: "2025-11-20",
      endDate: "2025-11-30",
      status: "Scheduled",
    },
  ]);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header Trang */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 24, color: "#333" }}>
            Discount Management
          </h2>
          <p style={{ color: "#888", fontSize: 14, marginTop: 5 }}>
            Create and manage coupon codes
          </p>
        </div>
        <button
          style={{
            padding: "12px 24px",
            background: "#5a02c2",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 10px rgba(90, 2, 194, 0.3)",
          }}
        >
          <FaPlus /> Add New Coupon
        </button>
      </div>

      {/* Thanh Tìm kiếm & Lọc */}
      <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="Search coupon code..."
            style={{
              width: "100%",
              padding: "12px 40px 12px 15px",
              borderRadius: 8,
              border: "1px solid #eee",
              background: "#f9f9f9",
              outline: "none",
            }}
          />
          <FaSearch
            style={{ position: "absolute", right: 15, top: 14, color: "#aaa" }}
          />
        </div>
        <select
          style={{
            padding: "0 15px",
            borderRadius: 8,
            border: "1px solid #eee",
            color: "#555",
            cursor: "pointer",
          }}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Bảng Dữ liệu */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
      >
        <thead>
          <tr
            style={{
              background: "#f4f6f8",
              color: "#555",
              textAlign: "left",
              fontWeight: "600",
            }}
          >
            <th style={{ padding: "15px" }}>ID</th>
            <th style={{ padding: "15px" }}>Code</th>
            <th style={{ padding: "15px" }}>Discount</th>
            <th style={{ padding: "15px" }}>Start Date</th>
            <th style={{ padding: "15px" }}>End Date</th>
            <th style={{ padding: "15px" }}>Status</th>
            <th style={{ padding: "15px", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((item) => (
            <tr
              key={item.id}
              style={{
                borderBottom: "1px solid #eee",
                transition: "background 0.2s",
              }}
              className="hover:bg-gray-50"
            >
              <td
                style={{ padding: "15px", fontWeight: "bold", color: "#888" }}
              >
                #{item.id}
              </td>
              <td style={{ padding: "15px" }}>
                <span
                  style={{
                    background: "#f3e5f5",
                    color: "#5a02c2",
                    padding: "5px 10px",
                    borderRadius: 4,
                    fontWeight: "bold",
                    border: "1px dashed #5a02c2",
                  }}
                >
                  {item.code}
                </span>
              </td>
              <td
                style={{
                  padding: "15px",
                  fontWeight: "bold",
                  color: "#e91e63",
                }}
              >
                {item.percent}%
              </td>
              <td style={{ padding: "15px", color: "#555" }}>
                {item.startDate}
              </td>
              <td style={{ padding: "15px", color: "#555" }}>{item.endDate}</td>
              <td style={{ padding: "15px" }}>
                <span
                  style={{
                    padding: "5px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: "bold",
                    background:
                      item.status === "Active"
                        ? "#e8f5e9"
                        : item.status === "Inactive"
                        ? "#ffebee"
                        : "#fff3e0",
                    color:
                      item.status === "Active"
                        ? "#2e7d32"
                        : item.status === "Inactive"
                        ? "#c62828"
                        : "#ef6c00",
                  }}
                >
                  {item.status}
                </span>
              </td>
              <td style={{ padding: "15px", textAlign: "right" }}>
                <button
                  style={{
                    marginRight: 10,
                    border: "none",
                    background: "none",
                    color: "#5a02c2",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    color: "#ff5252",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDiscountManager;
