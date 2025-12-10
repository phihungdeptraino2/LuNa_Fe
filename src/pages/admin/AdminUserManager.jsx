import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, Shield } from "lucide-react";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const API_BASE = "http://localhost:8081/api/admin/users";

  // --- FETCH USERS ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Users API Response:", res.data);

      if (res.data && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách users:", error);
      alert("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // --- FILTER USERS ---
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.fullname?.toLowerCase().includes(searchLower)
    );
  });

  // --- HELPER FUNCTIONS ---
  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";
    return (
      new Date(date).toLocaleDateString("vi-VN") +
      " " +
      new Date(date).toLocaleTimeString("vi-VN")
    );
  };

  const getRoleBadge = (roles) => {
    // Nếu không có role, mặc định là NGƯỜI DÙNG
    if (!roles || roles.length === 0)
      return <span style={styles.badge}>NGƯỜI DÙNG</span>;

    return roles.map((role, index) => {
      const roleName = role.name || role;
      const isAdmin = roleName.includes("ADMIN");

      // Chuyển đổi tên role sang tiếng Việt hiển thị
      let displayName = roleName.replace("ROLE_", "");
      if (displayName === "ADMIN") displayName = "QUẢN TRỊ VIÊN";
      if (displayName === "USER") displayName = "NGƯỜI DÙNG";

      return (
        <span
          key={index}
          style={{
            ...styles.badge,
            background: isAdmin ? "#fee2e2" : "#dbeafe",
            color: isAdmin ? "#dc2626" : "#2563eb",
          }}
        >
          {displayName}
        </span>
      );
    });
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={styles.iconBtn}
            title="Quay lại Dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={styles.title}>Quản Lý Người Dùng</h2>
            <p style={styles.subtitle}>
              Quản lý danh sách người dùng đã đăng ký
            </p>
          </div>
        </div>
        <div style={styles.stats}>
          <User size={18} style={{ marginRight: 5 }} />
          Tổng số: {filteredUsers.length} người dùng
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên đăng nhập, email hoặc họ tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* TABLE */}
      <div style={styles.tableCard}>
        {loading ? (
          <p style={{ padding: 30, textAlign: "center" }}>
            Đang tải dữ liệu...
          </p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ padding: 30, textAlign: "center" }}>
            Không tìm thấy người dùng nào
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Tên đăng nhập</th>
                <th style={styles.th}>Họ và tên</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Số điện thoại</th>
                <th style={styles.th}>Vai trò</th>
                <th style={styles.th}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>#{user.id}</td>
                  <td style={styles.td}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div style={styles.avatar}>
                        <User size={18} />
                      </div>
                      <strong>{user.username}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {user.fullname || (
                      <span style={{ color: "#999" }}>Chưa cập nhật</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <Mail size={14} color="#6b7280" />
                      {user.email || (
                        <span style={{ color: "#999" }}>Chưa cập nhật</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <Phone size={14} color="#6b7280" />
                      {user.phone || (
                        <span style={{ color: "#999" }}>Chưa cập nhật</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {getRoleBadge(user.roles)}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 13,
                        color: "#6b7280",
                      }}
                    >
                      <Calendar size={14} />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// STYLES
const styles = {
  container: {
    padding: "20px",
    background: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    margin: 0,
    color: "#1f2937",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    margin: "5px 0 0 0",
    color: "#6b7280",
    fontSize: 14,
  },
  stats: {
    display: "flex",
    alignItems: "center",
    background: "#dbeafe",
    color: "#1e40af",
    padding: "10px 20px",
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 14,
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "white",
    fontSize: 14,
    outline: "none",
  },
  tableCard: {
    background: "white",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 900,
  },
  thRow: {
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    padding: "15px",
    textAlign: "left",
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 600,
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
    transition: "background 0.2s",
  },
  td: {
    padding: "15px",
    fontSize: 14,
    color: "#374151",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#e0e7ff",
    color: "#3730a3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "bold",
    display: "inline-block",
  },
};

export default AdminUserManager;
