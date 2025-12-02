import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Nhớ import useNavigate
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate(); // Hook chuyển trang

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userData = await login(username, password);

      if (userData && userData.roles) {
        if (userData.roles.includes("ADMIN")) {
          // Nếu là admin → vào trang quản trị
          navigate("/admin/dashboard");
        } else if (userData.roles.includes("CUSTOMER")) {
          // Nếu là customer → thêm /customer vào URL
          navigate(`/customer${window.location.pathname}`);
        }
        onClose(); // đóng modal sau khi redirect
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (err) {
      setError("Lỗi kết nối server.");
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2 className="modal-title">Customer Centre login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username *</label>
            <input
              type="text"
              className="modal-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password *</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="modal-actions">
            <label className="remember-me">
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#" className="forgot-pass">
              Forgot your password?
            </a>
          </div>

          <button type="submit" className="modal-login-btn">
            Log In
          </button>
        </form>

        <div className="modal-footer">
          <Link to="/register" className="register-link" onClick={onClose}>
            Register now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
