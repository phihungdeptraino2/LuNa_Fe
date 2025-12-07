import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, ArrowLeft, X, Save, Search } from "lucide-react";

const AdminOrderManager = () => {
  const [orders, setOrders] = useState([]); // Dữ liệu gốc
  const [filteredOrders, setFilteredOrders] = useState([]); // Dữ liệu hiển thị
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đang xem chi tiết
  const [loading, setLoading] = useState(true);
  
  // Hook xử lý URL query (?status=PENDING)
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentStatus = searchParams.get("status") || "ALL";

  // Cấu hình API
  const API_BASE = "http://localhost:8081/api/admin/orders";

  // --- 1. LẤY DỮ LIỆU TỪ SERVER ---
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Map dữ liệu từ API response
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LỌC DỮ LIỆU KHI TAB THAY ĐỔI ---
  useEffect(() => {
    if (currentStatus === "ALL") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === currentStatus));
    }
  }, [currentStatus, orders]);

  // --- 3. CÁC HÀM XỬ LÝ ---
  const handleTabChange = (status) => {
    setSearchParams(status === "ALL" ? {} : { status });
  };

  const handleViewDetail = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      if(res.data && res.data.data) {
          setSelectedOrder(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      alert("Không tìm thấy chi tiết đơn hàng");
    }
  };

  const handleUpdateQuantity = async (orderId, productId, newQuantity) => {
    if(newQuantity <= 0) return alert("Số lượng phải > 0");
    try {
        const token = localStorage.getItem("token");
        await axios.put(`${API_BASE}/${orderId}/items`, null, {
            params: { productId, newQuantity },
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Cập nhật thành công!");
        // Load lại chi tiết đơn hàng để thấy số mới
        handleViewDetail(orderId);
        // Load lại danh sách tổng để cập nhật tổng tiền (nếu backend có tính lại)
        fetchOrders();
    } catch (error) {
        console.error(error);
        alert("Lỗi cập nhật số lượng");
    }
  };

  // --- HELPER FORMAT ---
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN') + " " + new Date(date).toLocaleTimeString('vi-VN');

  // --- RENDER ---
  return (
    <div style={styles.container}>
      {/* HEADER & BACK BUTTON */}
      <div style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <button onClick={() => navigate("/admin/dashboard")} style={styles.iconBtn}><ArrowLeft size={20}/></button>
            <h2 style={styles.title}>Quản Lý Đơn Hàng</h2>
        </div>
        <div style={styles.stats}>Tổng: {filteredOrders.length} đơn</div>
      </div>

      {/* TABS TRẠNG THÁI */}
      <div style={styles.tabsContainer}>
        {["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"].map(status => (
            <button 
                key={status}
                onClick={() => handleTabChange(status)}
                style={{
                    ...styles.tab,
                    ...(currentStatus === status ? styles.activeTab : {})
                }}
            >
                {status === "ALL" ? "Tất cả" : status}
            </button>
        ))}
      </div>

      {/* BẢNG DANH SÁCH */}
      <div style={styles.tableCard}>
        {loading ? <p style={{padding: 20}}>Đang tải...</p> : (
            <table style={styles.table}>
                <thead>
                    <tr style={styles.thRow}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Khách hàng</th>
                        <th style={styles.th}>Ngày đặt</th>
                        <th style={styles.th}>Tổng tiền</th>
                        <th style={styles.th}>Trạng thái</th>
                        <th style={styles.th}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id} style={styles.tr}>
                            <td style={styles.td}>#{order.id}</td>
                            <td style={styles.td}>
                                <b>{order.userResponseDTO?.fullname}</b><br/>
                                <span style={{fontSize: 12, color: '#666'}}>{order.userResponseDTO?.email}</span>
                            </td>
                            <td style={styles.td}>{formatDate(order.orderDate)}</td>
                            <td style={{...styles.td, color: '#10b981', fontWeight: 'bold'}}>{formatCurrency(order.totalAmount)}</td>
                            <td style={styles.td}><StatusBadge status={order.status} /></td>
                            <td style={styles.td}>
                                <button style={styles.actionBtn} onClick={() => handleViewDetail(order.id)}>
                                    <Eye size={16} style={{marginRight: 5}}/> Chi tiết
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr><td colSpan={6} style={{textAlign: 'center', padding: 20}}>Không có đơn hàng nào</td></tr>
                    )}
                </tbody>
            </table>
        )}
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                    <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
                    <button onClick={() => setSelectedOrder(null)} style={styles.closeBtn}><X size={24}/></button>
                </div>
                
                <div style={styles.modalBody}>
                    <div style={styles.infoGrid}>
                        <p><b>Khách hàng:</b> {selectedOrder.userResponseDTO?.fullname}</p>
                        <p><b>SĐT:</b> {selectedOrder.userResponseDTO?.phone}</p>
                        <p><b>Địa chỉ:</b> {selectedOrder.address || "Tại cửa hàng"}</p>
                        <p><b>Ngày đặt:</b> {formatDate(selectedOrder.orderDate)}</p>
                    </div>

                    <h4 style={{marginTop: 20}}>Danh sách sản phẩm</h4>
                    <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 10}}>
                        <thead>
                            <tr style={{borderBottom: '1px solid #ddd', textAlign: 'left'}}>
                                <th style={{padding: 8}}>Sản phẩm</th>
                                <th style={{padding: 8}}>Giá</th>
                                <th style={{padding: 8}}>Số lượng</th>
                                <th style={{padding: 8}}>Thành tiền</th>
                                <th style={{padding: 8}}>Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.orderDetails?.map((item, index) => (
                                <tr key={index} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding: 8}}>{item.productName || `Sản phẩm ID: ${item.product_id}`}</td>
                                    <td style={{padding: 8}}>{formatCurrency(item.price)}</td>
                                    <td style={{padding: 8}}>
                                        {/* Input sửa số lượng */}
                                        <input 
                                            type="number" 
                                            defaultValue={item.quantity} 
                                            min="1"
                                            id={`qty-${selectedOrder.id}-${item.product_id}`}
                                            style={styles.qtyInput}
                                        />
                                    </td>
                                    <td style={{padding: 8}}>{formatCurrency(item.price * item.quantity)}</td>
                                    <td style={{padding: 8}}>
                                        <button 
                                            style={styles.saveBtn}
                                            onClick={() => {
                                                const newQty = document.getElementById(`qty-${selectedOrder.id}-${item.product_id}`).value;
                                                handleUpdateQuantity(selectedOrder.id, item.product_id, newQty);
                                            }}
                                        >
                                            <Save size={14}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={styles.totalSection}>
                        Tổng cộng: <span style={{fontSize: 20, color: '#d32f2f'}}>{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Component con hiển thị Badge trạng thái
const StatusBadge = ({ status }) => {
    const map = {
        PENDING: { color: '#f59e0b', bg: '#fffbeb', label: 'Chờ xử lý' },
        SHIPPED: { color: '#3b82f6', bg: '#eff6ff', label: 'Đang giao' },
        DELIVERED: { color: '#10b981', bg: '#ecfdf5', label: 'Hoàn thành' },
        CANCELLED: { color: '#ef4444', bg: '#fef2f2', label: 'Đã hủy' }
    };
    const s = map[status] || { color: '#333', bg: '#eee', label: status };
    return (
        <span style={{backgroundColor: s.bg, color: s.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold'}}>
            {s.label}
        </span>
    )
};

// CSS Styles
const styles = {
  container: { padding: "20px", background: "#f3f4f6", minHeight: "100vh", fontFamily: "Segoe UI" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { margin: 0, color: "#1f2937" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", marginRight: 10 },
  tabsContainer: { display: "flex", gap: 10, marginBottom: 20 },
  tab: { padding: "10px 20px", borderRadius: 8, border: "none", background: "white", cursor: "pointer", fontWeight: 500, color: "#6b7280" },
  activeTab: { background: "#2563eb", color: "white", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" },
  tableCard: { background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { background: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  th: { padding: "15px", textAlign: "left", fontSize: 13, color: "#6b7280", fontWeight: 600 },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "15px", fontSize: 14, color: "#374151" },
  actionBtn: { display: "flex", alignItems: "center", padding: "6px 12px", background: "#e0e7ff", color: "#3730a3", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  
  // Modal Styles
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { background: "white", width: "90%", maxWidth: "800px", borderRadius: 12, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  modalHeader: { padding: "20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#666" },
  modalBody: { padding: "20px" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "#f9fafb", padding: 15, borderRadius: 8 },
  qtyInput: { width: 60, padding: 5, borderRadius: 4, border: "1px solid #ccc", textAlign: "center" },
  saveBtn: { background: "#2563eb", color: "white", border: "none", padding: 6, borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center" },
  totalSection: { marginTop: 20, textAlign: "right", fontSize: 18, fontWeight: "bold" }
};

export default AdminOrderManager;