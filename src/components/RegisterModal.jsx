import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginModal.css";

const RegisterModal = ({ isOpen, onClose, onBackToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = { fullName, username, email, phone, password };
    const result = await register(formData);

    if (result.success) {
      alert("Đăng ký thành công!");
      onClose();
      onBackToLogin(); // mở login modal
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2 className="modal-title">Register Account</h2>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Full Name *</label>
            <input
              type="text"
              className="modal-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
            <label>Email *</label>
            <input
              type="email"
              className="modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone *</label>
            <input
              type="text"
              className="modal-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

          <button type="submit" className="modal-login-btn">
            Register
          </button>
        </form>

        <div className="modal-footer">
          <button
            type="button"
            className="register-link"
            onClick={() => {
              onClose();
              onBackToLogin();
            }}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
