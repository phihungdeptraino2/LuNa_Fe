import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Users,
  AlertTriangle,
} from "lucide-react";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cấu hình URL backend của bạn
  const API_URL = "http://localhost:8081/api/admin/dashboard";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy token từ localStorage (Giả sử bạn lưu token khi login là 'accessToken')
        const token = localStorage.getItem("token");

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`, // Header xác thực JWT
          },
        });

        // Dựa vào cấu trúc ApiResponse builder trong Java: response.data.data
        if (response.data && response.data.data) {
          setDashboardData(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi tải dashboard:", err);
        setError(
          "Không thể tải dữ liệu dashboard. Vui lòng kiểm tra quyền Admin."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm format tiền tệ VNĐ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading)
    return <div style={styles.loading}>Đang tải dữ liệu thống kê...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!dashboardData) return null;

  const {
    summary,
    revenueByDay,
    revenueByMonth,
    topSellingProducts,
    lowStockProducts,
  } = dashboardData;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard Quản Trị</h1>

      {/* --- PHẦN 1: THẺ THỐNG KÊ (CARDS) --- */}
      <div style={styles.gridCards}>
        <StatCard
          title="Đang chờ xử lý"
          value={summary.pending}
          icon={<Package size={24} color="#f59e0b" />}
          bgColor="#fffbeb"
        />
        <StatCard
          title="Đang giao hàng"
          value={summary.shipping}
          icon={<Truck size={24} color="#3b82f6" />}
          bgColor="#eff6ff"
        />
        <StatCard
          title="Đã giao thành công"
          value={summary.delivered}
          icon={<CheckCircle size={24} color="#10b981" />}
          bgColor="#ecfdf5"
        />
        <StatCard
          title="Đã hủy"
          value={summary.cancelled}
          icon={<XCircle size={24} color="#ef4444" />}
          bgColor="#fef2f2"
        />
        <StatCard
          title="Tổng người dùng"
          value={summary.totalUsers}
          icon={<Users size={24} color="#6366f1" />}
          bgColor="#eef2ff"
        />
      </div>

      {/* --- PHẦN 2: BIỂU ĐỒ (CHARTS) --- */}
      <div style={styles.chartsSection}>
        {/* Biểu đồ doanh thu 7 ngày qua */}
        <div style={styles.chartContainer}>
          <h3 style={styles.sectionTitle}>Doanh thu 7 ngày gần nhất</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Doanh thu"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ doanh thu theo tháng */}
        <div style={styles.chartContainer}>
          <h3 style={styles.sectionTitle}>Doanh thu theo tháng (Năm nay)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="value" name="Doanh thu" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- PHẦN 3: BẢNG DỮ LIỆU --- */}
      <div style={styles.tablesGrid}>
        {/* Top sản phẩm bán chạy */}
        <div style={styles.tableCard}>
          <h3 style={styles.sectionTitle}>🔥 Top 5 Sản Phẩm Bán Chạy</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Hình ảnh</th>
                <th style={styles.th}>Tên sản phẩm</th>
                <th style={styles.th}>Đã bán</th>
                <th style={styles.th}>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product) => (
                <tr key={product.id} style={styles.tr}>
                  <td style={styles.td}>
                    <img
                      src={product.image || "https://via.placeholder.com/50"}
                      alt={product.name}
                      style={styles.productImg}
                    />
                  </td>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td} align="center">
                    {product.totalSold}
                  </td>
                  <td style={styles.td}>
                    {formatCurrency(product.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sản phẩm sắp hết hàng */}
        <div style={styles.tableCard}>
          <h3
            style={{
              ...styles.sectionTitle,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <AlertTriangle color="#ef4444" size={20} /> Cảnh báo tồn kho (dưới
            10)
          </h3>
          <ul style={styles.stockList}>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => (
                <li key={p.id} style={styles.stockItem}>
                  <span style={styles.stockName}>{p.name}</span>
                  <span style={styles.stockBadge}>
                    Còn lại: {p.stockQuantity}
                  </span>
                </li>
              ))
            ) : (
              <p style={{ padding: 20, color: "#888" }}>
                Không có sản phẩm nào sắp hết hàng.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Component con để hiển thị Card thống kê
const StatCard = ({ title, value, icon, bgColor }) => (
  <div style={{ ...styles.card, backgroundColor: bgColor }}>
    <div style={styles.cardHeader}>
      <span style={styles.cardTitle}>{title}</span>
      {icon}
    </div>
    <div style={styles.cardValue}>{value}</div>
  </div>
);

// CSS Styles (Inline Object)
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "30px",
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "600",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "18px",
  },
  error: {
    color: "red",
    padding: "20px",
    textAlign: "center",
  },
  gridCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
  },
  chartsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  chartContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  },
  sectionTitle: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#374151",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  tablesGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr", // Cột bên trái rộng gấp đôi
    gap: "20px",
  },
  tableCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thRow: {
    backgroundColor: "#f9fafb",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    fontSize: "13px",
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#374151",
  },
  productImg: {
    width: "40px",
    height: "40px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  stockList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  stockItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  stockName: {
    fontWeight: "500",
    color: "#374151",
  },
  stockBadge: {
    backgroundColor: "#fee2e2",
    color: "#ef4444",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default AdminDashboard;
