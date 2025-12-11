import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaKey, FaEdit, FaSave, FaTimes, FaCheck, FaShoppingBag, FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import "./ProfilePage.css";
import { BE_HOST } from "../../utils/constants";


const PROFILE_API_URL = `${BE_HOST}/api/auth/me`;
const ORDERS_API_URL = `${BE_HOST}/api/orders/my-orders`;


export default function ProfilePage() {
    const { user } = useAuth();

    const isAdmin = user?.roles?.includes("ADMIN");
    const isCustomer = user?.roles?.includes("CUSTOMER");

    const [profileData, setProfileData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("info"); // "info" hoặc "orders"

    useEffect(() => {
        const token = user?.token || localStorage.getItem("token");

        if (!user || !token) {
            console.error("❌ No user or token found!");
            setError("Bạn cần đăng nhập để xem trang này.");
            setLoading(false);
            setOrdersLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get(PROFILE_API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfileData(res.data.data);
                setEditData(res.data.data);

            } catch (err) {
                console.error("❌ Error fetching profile:", err);
                setError("Không thể tải thông tin người dùng. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        const fetchOrders = async () => {
            // Thay đổi logic: Admin cũng có thể xem đơn hàng của mình
            // Giả định API ORDERS_API_URL luôn trả về đơn hàng của user dựa trên token

            try {
                const res = await axios.get(ORDERS_API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(res.data.data || []);
            } catch (err) {
                console.error("❌ Error fetching orders:", err);
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchProfile();

        // GỌI fetchOrders cho TẤT CẢ user đã đăng nhập, bao gồm Admin.
        fetchOrders();

    }, [user]); // Bỏ isAdmin/isCustomer ra khỏi dependency array vì đã có user

    const handleSave = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError("");

        // LOGIC GỌI API CẬP NHẬT Ở ĐÂY 

        try {
            setProfileData(editData);
            setIsEditing(false);
            setSuccessMessage("Thông tin đã được cập nhật thành công!");
            setTimeout(() => setSuccessMessage(""), 3000);

        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING": return <FaBox />;
            case "PROCESSING": return <FaTruck />;
            case "SHIPPED": return <FaTruck />;
            case "DELIVERED": return <FaCheckCircle />;
            default: return <FaBox />;
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            "PENDING": "Chờ xử lý",
            "PROCESSING": "Đang xử lý",
            "SHIPPED": "Đang giao",
            "DELIVERED": "Đã giao",
            "CANCELLED": "Đã hủy"
        };
        return statusMap[status] || status;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="profile-page-container" style={{
                minHeight: '100vh',
                paddingTop: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p className="loading-message" style={{ color: 'white', fontSize: '1.5rem' }}>
                    Đang tải thông tin cá nhân...
                </p>
            </div>
        );
    }

    if (!user || error && !profileData) {
        return (
            <div className="profile-page-container" style={{
                minHeight: '100vh',
                paddingTop: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p className="error-message" style={{ color: 'white', fontSize: '1.5rem' }}>
                    {error || "Bạn cần đăng nhập để xem trang này."}
                </p>
            </div>
        );
    }

    if (!profileData) {
        return null;
    }

    return (
        <div className="profile-page-container">
            <h1 className="profile-header">Thông tin Cá nhân ({isAdmin ? "Admin" : (isCustomer ? "Customer" : "User")})</h1>

            {/* Tabs */}
            <div className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
                    onClick={() => setActiveTab("info")}
                >
                    <FaUser /> Thông tin
                </button>

                {/* SỬA: BỎ ĐIỀU KIỆN isCustomer để Admin cũng thấy tab Orders */}
                <button
                    className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                >
                    <FaShoppingBag /> Đơn hàng ({orders.length})
                </button>
            </div>

            <div className="profile-card">
                {successMessage && (
                    <div className="success-banner">
                        <FaCheck /> {successMessage}
                    </div>
                )}
                {error && (
                    <div className="error-banner">
                        <FaTimes /> {error}
                    </div>
                )}

                {/* TAB THÔNG TIN */}
                {activeTab === "info" && (
                    <>
                        <div className="profile-actions">
                            <button className="edit-toggle-btn" onClick={() => {
                                setIsEditing(!isEditing);
                                if (isEditing) setEditData(profileData);
                                setError(null);
                                setSuccessMessage("");
                            }}>
                                {isEditing ? <><FaTimes /> Hủy bỏ</> : <><FaEdit /> Chỉnh sửa</>}
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="info-group">
                                <label><FaUser /> Tên đăng nhập (Username):</label>
                                <p className="info-value static-value">{profileData.username}</p>
                            </div>

                            <div className="info-group">
                                <label htmlFor="fullName"><FaUser /> Họ và Tên:</label>
                                {isEditing ? (
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        className="info-input"
                                        value={editData.fullName || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                ) : (
                                    <p className="info-value">{profileData.fullName || 'Chưa cập nhật'}</p>
                                )}
                            </div>

                            <div className="info-group">
                                <label htmlFor="email"><FaEnvelope /> Email:</label>
                                {isEditing ? (
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="info-input"
                                        value={editData.email || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                ) : (
                                    <p className="info-value">{profileData.email}</p>
                                )}
                            </div>

                            <div className="info-group">
                                <label htmlFor="phone"><FaPhone /> Số điện thoại:</label>
                                {isEditing ? (
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        className="info-input"
                                        value={editData.phone || ''}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p className="info-value">{profileData.phone || 'Chưa cập nhật'}</p>
                                )}
                            </div>

                            <div className="info-group">
                                <label><FaKey /> Vai trò:</label>
                                <p className="info-value static-value">{profileData.roles ? profileData.roles.join(', ') : 'N/A'}</p>
                            </div>

                            {isEditing && (
                                <div className="save-action">
                                    <button type="submit" className="save-btn">
                                        <FaSave /> Lưu thay đổi
                                    </button>
                                    <span className="note">Lưu ý: Mật khẩu phải được thay đổi riêng.</span>
                                </div>
                            )}
                        </form>
                    </>
                )}

                {/* TAB ĐƠN HÀNG */}
                {/* Đã bỏ điều kiện isCustomer */}
                {activeTab === "orders" && (
                    <div className="orders-section">
                        {ordersLoading ? (
                            <p className="loading-text">Đang tải đơn hàng...</p>
                        ) : orders.length === 0 ? (
                            <div className="no-orders">
                                <FaShoppingBag size={60} />
                                <p>Bạn chưa có đơn hàng nào</p>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div className="order-id">
                                                <strong>Mã đơn:</strong> #{order.id}
                                            </div>
                                            <div className={`order-status status-${order.status.toLowerCase()}`}>
                                                {getStatusIcon(order.status)}
                                                <span>{getStatusText(order.status)}</span>
                                            </div>
                                        </div>

                                        <div className="order-date">
                                            <strong>Ngày đặt:</strong> {formatDate(order.orderDate)}
                                        </div>

                                        <div className="order-items">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="order-item">
                                                    <div className="item-info">
                                                        <span className="item-name">{item.productName}</span>
                                                        <span className="item-quantity">x{item.quantity}</span>
                                                    </div>
                                                    <div className="item-price">{formatPrice(item.subtotal)}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="order-address">
                                            <strong>Địa chỉ:</strong> {order.address.street}, {order.address.district}, {order.address.city}
                                        </div>

                                        <div className="order-footer">
                                            <div className="order-total">
                                                <strong>Tổng tiền:</strong>
                                                <span className="total-amount">{formatPrice(order.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}