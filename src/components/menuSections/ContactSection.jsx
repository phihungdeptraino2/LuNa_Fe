import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tại đây bạn sẽ gọi API gửi mail sau này
    alert(`Cảm ơn ${formData.name}! Chúng tôi đã nhận được tin nhắn của bạn.`);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <h2 style={styles.title}>Liên Hệ Với Chúng Tôi</h2>
        <p style={styles.subtitle}>
          Chúng tôi luôn sẵn sàng lắng nghe bạn. Hãy gửi thắc mắc hoặc ghé thăm
          cửa hàng của Luna Music!
        </p>
      </div>

      <div style={styles.contentWrapper}>
        {/* CỘT TRÁI: THÔNG TIN & BẢN ĐỒ */}
        <div style={styles.infoColumn}>
          {/* Info Cards */}
          <div style={styles.infoGrid}>
            <InfoCard
              icon={<FaMapMarkerAlt />}
              title="Địa chỉ cửa hàng"
              content="12 Nguyễn Văn Bảo, P.4, Q.Gò Vấp, TP.HCM"
            />
            <InfoCard
              icon={<FaPhoneAlt />}
              title="Hotline hỗ trợ"
              content="0123 456 789"
            />
            <InfoCard
              icon={<FaEnvelope />}
              title="Email"
              content="support@lunamusic.com"
            />
            <InfoCard
              icon={<FaClock />}
              title="Giờ mở cửa"
              content="Thứ 2 - Chủ Nhật: 08:00 - 22:00"
            />
          </div>

          {/* Google Map Embed */}
          <div style={styles.mapContainer}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.858169091027!2d106.68427047480556!3d10.822164158352613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e54969507f%3A0xfa60665c56437e52!2zMTIgTmd1eeG7hW4gVMSDbiBC4bqjbywgUGjGsOG7nW5nIDQsIEfDsiBW4bqlcCwgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1709485721405!5m2!1sen!2s"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* CỘT PHẢI: FORM LIÊN HỆ */}
        <div style={styles.formColumn}>
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Gửi Tin Nhắn</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên của bạn"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Chủ đề</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ví dụ: Hỗ trợ bảo hành, Tư vấn mua hàng..."
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nội dung tin nhắn</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Bạn cần hỗ trợ gì?"
                  style={{
                    ...styles.input,
                    height: "120px",
                    resize: "vertical",
                  }}
                  required
                ></textarea>
              </div>

              <button type="submit" style={styles.submitBtn}>
                <FaPaperPlane style={{ marginRight: 8 }} /> Gửi Ngay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con hiển thị từng dòng thông tin
const InfoCard = ({ icon, title, content }) => (
  <div style={styles.infoCard}>
    <div style={styles.iconBox}>{icon}</div>
    <div>
      <h4 style={styles.infoTitle}>{title}</h4>
      <p style={styles.infoContent}>{content}</p>
    </div>
  </div>
);

// --- CSS STYLES ---
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1e1e2d", // Màu tối giống Admin layout
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    maxWidth: "600px",
    margin: "0 auto",
  },
  contentWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
  },
  // CỘT TRÁI
  infoColumn: {
    flex: "1 1 400px", // Co giãn, tối thiểu 400px
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Tự động chia cột
    gap: "20px",
    marginBottom: "30px",
  },
  infoCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
  },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#f3e8ff", // Tím nhạt
    color: "#5a02c2", // Tím đậm thương hiệu
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },
  infoTitle: {
    margin: "0 0 5px 0",
    fontSize: "16px",
    fontWeight: "600",
  },
  infoContent: {
    margin: 0,
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
  },
  mapContainer: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
  },

  // CỘT PHẢI
  formColumn: {
    flex: "1 1 400px",
  },
  formCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(90, 2, 194, 0.1)", // Bóng đổ màu tím nhẹ
    borderTop: "5px solid #5a02c2", // Điểm nhấn màu tím trên đầu form
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.3s",
    boxSizing: "border-box", // Quan trọng để không bị vỡ layout
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#5a02c2", // Tím thương hiệu
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s",
  },
};

export default ContactSection;
