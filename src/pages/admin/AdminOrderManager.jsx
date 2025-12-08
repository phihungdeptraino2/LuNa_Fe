import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, ArrowLeft, X, RefreshCw } from "lucide-react"; // Thêm icon Refresh

const AdminOrderManager = () => {
  const [orders, setOrders] = useState([]); 
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // State lưu trạng thái đang chọn trong Modal để chuẩn bị cập nhật
  const [updatingStatus, setUpdatingStatus] = useState(""); 

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentStatus = searchParams.get("status") || "ALL";

  // API Đơn hàng cơ bản
  const API_BASE = "http://localhost:8081/api/admin/orders";
  // API Cập nhật trạng thái (Dựa trên OrderController bạn đã gửi trước đó)
  const API_UPDATE_STATUS = "http://localhost:8081/api/orders/admin/update-status";

  // --- 1. LẤY DỮ LIỆU ---
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LỌC DỮ LIỆU ---
  useEffect(() => {
    if (currentStatus === "ALL") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === currentStatus));
    }
  }, [currentStatus, orders]);

  const handleTabChange = (status) => {
    setSearchParams(status === "ALL" ? {} : { status });
  };

  // --- 3. XEM CHI TIẾT ---
  const handleViewDetail = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      if(res.data && res.data.data) {
          setSelectedOrder(res.data.data);
          // Set trạng thái hiện tại vào state cập nhật để hiển thị đúng trong select
          setUpdatingStatus(res.data.data.status); 
      }
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      alert("Không tìm thấy chi tiết đơn hàng");
    }
  };

  // --- 4. CHỨC NĂNG CẬP NHẬT TRẠNG THÁI (MỚI) ---
  const handleUpdateStatus = async () => {
      if (!selectedOrder) return;
      if (updatingStatus === selectedOrder.status) return alert("Vui lòng chọn trạng thái khác!");

      const confirmUpdate = window.confirm(`Bạn có chắc chắn muốn chuyển đơn hàng sang trạng thái: ${updatingStatus}?`);
      if (!confirmUpdate) return;

      try {
          const token = localStorage.getItem("token");
          
          // Gọi API cập nhật trạng thái
          // Lưu ý: Backend dùng @RequestParam nên phải truyền params
          await axios.put(API_UPDATE_STATUS, null, {
              params: { 
                  orderId: selectedOrder.id, 
                  status: updatingStatus 
              },
              headers: { Authorization: `Bearer ${token}` }
          });

          alert("Cập nhật trạng thái thành công!");
          
          // Tắt Modal
          setSelectedOrder(null);
          // Load lại danh sách để thấy sự thay đổi
          fetchOrders();

      } catch (error) {
          console.error("Lỗi cập nhật trạng thái:", error);
          alert(error.response?.data?.message || "Lỗi khi cập nhật trạng thái");
      }
  };

  // --- HELPER FUNCTIONS ---
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  const formatDate = (date) => date ? (new Date(date).toLocaleDateString('vi-VN') + " " + new Date(date).toLocaleTimeString('vi-VN')) : "";

  const getUserInfo = (order) => {
    if (!order) return { name: "...", email: "", phone: "" };
    const name = order.userName || order.user?.fullname || order.userResponseDTO?.fullname || "Khách lẻ";
    const email = order.email || order.user?.email || ""; 
    const phone = order.phone || order.user?.phone || "";
    return { name, email, phone };
  };

  const getAddressString = (order) => {
      if (!order) return "Tại cửa hàng";
      if (order.addressStreet || order.addressCity) {
          return [order.addressStreet, order.addressDistrict, order.addressCity, order.addressProvince].filter(Boolean).join(", ");
      }
      const addr = order.address;
      if (addr && typeof addr === 'object') {
          return `${addr.street || ''}, ${addr.district || ''}, ${addr.city || ''}`;
      }
      return "Tại cửa hàng";
  };

  // --- RENDER ---
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <button onClick={() => navigate("/admin/dashboard")} style={styles.iconBtn}><ArrowLeft size={20}/></button>
            <h2 style={styles.title}>Quản Lý Đơn Hàng</h2>
        </div>
        <div style={styles.stats}>Tổng: {filteredOrders.length} đơn</div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map(status => (
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

      {/* Table */}
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
                    {filteredOrders.map(order => {
                        const userInfo = getUserInfo(order);
                        return (
                            <tr key={order.id} style={styles.tr}>
                                <td style={styles.td}>#{order.id}</td>
                                <td style={styles.td}>
                                    <b>{userInfo.name}</b><br/>
                                    <span style={{fontSize: 12, color: '#666'}}>{userInfo.email}</span>
                                </td>
                                <td style={styles.td}>{formatDate(order.orderDate)}</td>
                                <td style={{...styles.td, color: '#10b981', fontWeight: 'bold'}}>
                                    {formatCurrency(order.total || order.totalAmount)}
                                </td>
                                <td style={styles.td}><StatusBadge status={order.status} /></td>
                                <td style={styles.td}>
                                    <button style={styles.actionBtn} onClick={() => handleViewDetail(order.id)}>
                                        <Eye size={16} style={{marginRight: 5}}/> Chi tiết
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )}
      </div>

      {/* MODAL CHI TIẾT & CẬP NHẬT TRẠNG THÁI */}
      {selectedOrder && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                    <h3>Đơn hàng #{selectedOrder.id}</h3>
                    <button onClick={() => setSelectedOrder(null)} style={styles.closeBtn}><X size={24}/></button>
                </div>
                
                <div style={styles.modalBody}>
                    {/* Phần 1: Điều khiển Trạng Thái (MỚI THÊM) */}
                    <div style={styles.statusControlPanel}>
                        <label style={{fontWeight: 'bold', marginBottom: 5, display: 'block'}}>Cập nhật trạng thái:</label>
                        <div style={{display: 'flex', gap: 10}}>
                            <select 
                                value={updatingStatus} 
                                onChange={(e) => setUpdatingStatus(e.target.value)}
                                style={styles.statusSelect}
                            >
                                <option value="PENDING">PENDING (Chờ xử lý)</option>
                                <option value="CONFIRMED">CONFIRMED (Đã xác nhận)</option>
                                <option value="SHIPPED">SHIPPED (Đang giao)</option>
                                <option value="DELIVERED">DELIVERED (Đã giao)</option>
                                <option value="CANCELLED">CANCELLED (Đã hủy)</option>
                            </select>
                            
                            <button onClick={handleUpdateStatus} style={styles.updateStatusBtn}>
                                <RefreshCw size={16} style={{marginRight: 5}}/> Cập nhật
                            </button>
                        </div>
                    </div>

                    <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}}/>

                    {/* Phần 2: Thông tin chi tiết */}
                    <div style={styles.infoGrid}>
                        <p><b>Tài khoản:</b> {getUserInfo(selectedOrder).name}</p>
                        <p><b>Địa chỉ:</b> {getAddressString(selectedOrder)}</p>
                        <p><b>Ngày đặt:</b> {formatDate(selectedOrder.orderDate)}</p>
                        <p><b>Trạng thái hiện tại:</b> <StatusBadge status={selectedOrder.status}/></p>
                    </div>

                    <h4 style={{marginTop: 20}}>Danh sách sản phẩm</h4>
                    <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 10}}>
                        <thead>
                            <tr style={{borderBottom: '1px solid #ddd', textAlign: 'left'}}>
                                <th style={{padding: 8}}>Sản phẩm</th>
                                <th style={{padding: 8}}>Giá</th>
                                <th style={{padding: 8, textAlign: 'center'}}>Số lượng</th>
                                <th style={{padding: 8, textAlign: 'right'}}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(selectedOrder.items || selectedOrder.orderDetails || []).map((item, index) => {
                                const pId = item.productId || item.product_id;
                                return (
                                    <tr key={index} style={{borderBottom: '1px solid #eee'}}>
                                        <td style={{padding: 8}}>
                                            {item.productName || `Sản phẩm ID: ${pId}`}
                                        </td>
                                        <td style={{padding: 8}}>{formatCurrency(item.price)}</td>
                                        <td style={{padding: 8, textAlign: 'center', fontWeight: 'bold'}}>{item.quantity}</td>
                                        <td style={{padding: 8, textAlign: 'right'}}>
                                            {formatCurrency(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <div style={styles.totalSection}>
                        Tổng cộng: <span style={{fontSize: 20, color: '#d32f2f'}}>
                            {formatCurrency(selectedOrder.total || selectedOrder.totalAmount)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Component Badge
const StatusBadge = ({ status }) => {
    const map = {
        PENDING: { color: '#f59e0b', bg: '#fffbeb', label: 'Chờ xử lý' },
        SHIPPED: { color: '#3b82f6', bg: '#eff6ff', label: 'Đang giao' },
        DELIVERED: { color: '#10b981', bg: '#ecfdf5', label: 'Hoàn thành' },
        CANCELLED: { color: '#ef4444', bg: '#fef2f2', label: 'Đã hủy' },
        CONFIRMED: { color: '#0ea5e9', bg: '#e0f2fe', label: 'Đã xác nhận' }
    };
    const s = map[status] || { color: '#333', bg: '#eee', label: status };
    return (
        <span style={{backgroundColor: s.bg, color: s.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold'}}>
            {s.label}
        </span>
    )
};

// Styles
const styles = {
  container: { padding: "20px", background: "#f3f4f6", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { margin: 0, color: "#1f2937" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", marginRight: 10 },
  tabsContainer: { display: "flex", gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  tab: { padding: "10px 20px", borderRadius: 8, border: "none", background: "white", cursor: "pointer", fontWeight: 500, color: "#6b7280" },
  activeTab: { background: "#2563eb", color: "white", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" },
  tableCard: { background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 600 },
  thRow: { background: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  th: { padding: "15px", textAlign: "left", fontSize: 13, color: "#6b7280", fontWeight: 600 },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "15px", fontSize: 14, color: "#374151" },
  actionBtn: { display: "flex", alignItems: "center", padding: "6px 12px", background: "#e0e7ff", color: "#3730a3", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { background: "white", width: "90%", maxWidth: "800px", borderRadius: 12, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  modalHeader: { padding: "20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#666" },
  modalBody: { padding: "20px" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: "#f9fafb", padding: 15, borderRadius: 8 },
  totalSection: { marginTop: 20, textAlign: "right", fontSize: 18, fontWeight: "bold" },
  
  // Style mới cho phần cập nhật trạng thái
  statusControlPanel: { background: "#e0f2fe", padding: 15, borderRadius: 8, marginBottom: 15 },
  statusSelect: { padding: "8px", borderRadius: 4, border: "1px solid #ccc", flex: 1 },
  updateStatusBtn: { background: "#0ea5e9", color: "white", border: "none", padding: "8px 16px", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", fontWeight: "bold" }
};

export default AdminOrderManager;