import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaKey, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import "./ProfilePage.css"; // Nhớ tạo file CSS này

const API_URL = "http://localhost:8081/api/auth/me";

export default function ProfilePage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    // State chứa dữ liệu người dùng
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!user || !token) {
            // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                // Thêm Authorization Header vào request
                const res = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfileData(res.data.data);
                setEditData(res.data.data); // Đặt dữ liệu chỉnh sửa ban đầu

            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Không thể tải thông tin người dùng. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, token, navigate]);

    // Giả định hàm xử lý cập nhật (chỉ là placeholder)
    const handleSave = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError("");

        // Trong thực tế, bạn sẽ gửi editData đến một API PUT/PATCH
        // Ví dụ: await axios.put("http://localhost:8081/api/users/profile", editData, { headers: { Authorization: `Bearer ${token}` } });

        setProfileData(editData);
        setIsEditing(false);
        setSuccessMessage("Thông tin đã được cập nhật thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };


    if (!user || loading) {
        return (
            <div className="profile-page-container">
                <p className="loading-message">Đang tải thông tin cá nhân...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="profile-page-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="profile-page-container">
            <h1 className="profile-header">Thông tin Cá nhân</h1>

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

                <div className="profile-actions">
                    <button className="edit-toggle-btn" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? <><FaTimes /> Hủy bỏ</> : <><FaEdit /> Chỉnh sửa</>}
                    </button>
                </div>

                <form onSubmit={handleSave}>
                    {/* Tên đăng nhập */}
                    <div className="info-group">
                        <label><FaUser /> Tên đăng nhập (Username):</label>
                        <p className="info-value static-value">{profileData.username}</p>
                    </div>

                    {/* Họ tên */}
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

                    {/* Email */}
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

                    {/* Điện thoại */}
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

                    {/* Vai trò */}
                    <div className="info-group">
                        <label><FaKey /> Vai trò:</label>
                        <p className="info-value static-value">{profileData.roles.join(', ')}</p>
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
            </div>
        </div>
    );
}