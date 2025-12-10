import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaMusic, // Icon trang trí header
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
    alert(`Cảm ơn ${formData.name}! Chúng tôi đã nhận được thư của bạn.`);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={styles.container}>
      {/* --- HEADER (Đồng bộ với ServiceSection) --- */}
      <div style={styles.header}>
        <div style={styles.headerDecoration}>
          <div style={styles.decoLine}></div>
          <FaMusic style={styles.decoIcon} />
          <div style={styles.decoLine}></div>
        </div>
        <h2 style={styles.title}>LIÊN HỆ VỚI LUNA</h2>
        <p style={styles.subtitle}>
          <i>"Gửi gắm tâm tư, kết nối đam mê"</i>
        </p>
      </div>

      <div style={styles.contentWrapper}>
        {/* --- CỘT TRÁI: THÔNG TIN & BẢN ĐỒ --- */}
        <div style={styles.infoColumn}>
          {/* Info List */}
          <div style={styles.infoList}>
            <InfoItem
              icon={<FaMapMarkerAlt />}
              title="Địa chỉ"
              content="12 Nguyễn Văn Bảo, P.4, Q.Gò Vấp, TP.HCM"
            />
            <InfoItem
              icon={<FaPhoneAlt />}
              title="Hotline"
              content="0123 456 789"
            />
            <InfoItem
              icon={<FaEnvelope />}
              title="Hộp thư"
              content="support@lunamusic.com"
            />
            <InfoItem
              icon={<FaClock />}
              title="Mở cửa"
              content="Thứ 2 - Chủ Nhật: 08:00 - 22:00"
            />
          </div>

          {/* Google Map (Đóng khung tranh) */}
          <div style={styles.mapFrame}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.8582378486044!2d106.68427047451785!3d10.82215895835165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e549695d13%3A0x333d81b991825902!2zMTIgTmd1eXDhu4VuIFbEg24gQuG6o28sIFBoxrDhu51uZyA0LCBHw7IgVuG6pXAsIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="300"
              style={{ border: 0, display: "block" }} // display block để fix khoảng trắng dưới iframe
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM LIÊN HỆ (Style bức thư) --- */}
        <div style={styles.formColumn}>
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>GỬI TIN NHẮN</h3>
            <div style={styles.dividerSmall}></div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên của bạn..."
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email liên hệ</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email..."
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
                  placeholder="Vấn đề bạn quan tâm..."
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Lời nhắn</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Viết lời nhắn tại đây..."
                  style={{
                    ...styles.input,
                    height: "120px",
                    resize: "vertical",
                  }}
                  required
                ></textarea>
              </div>

              <button type="submit" style={styles.submitBtn}>
                GỬI THƯ{" "}
                <FaPaperPlane style={{ marginLeft: 10, fontSize: 14 }} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con hiển thị từng dòng thông tin (Style liệt kê cổ điển)
const InfoItem = ({ icon, title, content }) => (
  <div style={styles.infoItem}>
    <div style={styles.iconBox}>{icon}</div>
    <div style={styles.infoTextWrapper}>
      <span style={styles.infoTitle}>{title}: </span>
      <span style={styles.infoContent}>{content}</span>
    </div>
  </div>
);

// --- VINTAGE CSS STYLES ---
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "60px 20px",
    backgroundColor: "white", // Màu kem giấy cũ
    fontFamily: "'Lora', serif",
    color: "#1a1a1a",
  },

  // 1. HEADER (Copy style từ ServiceSection)
  header: {
    textAlign: "center",
    marginBottom: "60px",
  },
  headerDecoration: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "15px",
  },
  decoLine: {
    width: "80px",
    height: "1px",
    backgroundColor: "#1a1a1a",
  },
  decoIcon: {
    fontSize: "16px",
    color: "#1a1a1a",
    transform: "rotate(-10deg)",
  },
  title: {
    fontSize: "42px",
    fontWeight: "400",
    color: "#1a1a1a",
    fontFamily: "'Playfair Display', serif",
    letterSpacing: "4px",
    textTransform: "uppercase",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    maxWidth: "600px",
    margin: "0 auto",
  },

  // LAYOUT
  contentWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "50px", // Tăng khoảng cách giữa 2 cột cho thoáng
    alignItems: "flex-start",
  },

  // 2. CỘT TRÁI (INFO & MAP)
  infoColumn: {
    flex: "1 1 400px",
  },
  infoList: {
    marginBottom: "40px",
    borderTop: "1px solid #1a1a1a", // Kẻ ngang trên cùng
    borderBottom: "1px solid #1a1a1a", // Kẻ ngang dưới cùng
    padding: "20px 0",
  },
  infoItem: {
    display: "flex",
    alignItems: "flex-start", // Căn đầu dòng
    gap: "15px",
    padding: "15px 0",
    borderBottom: "1px dashed #ccc", // Gạch đứt nét giữa các dòng
  },
  iconBox: {
    width: "24px",
    textAlign: "center",
    color: "#1a1a1a",
    fontSize: "18px",
    marginTop: "2px", // Căn chỉnh nhẹ với dòng text đầu tiên
  },
  infoTextWrapper: {
    flex: 1,
    fontFamily: "'Lora', serif",
  },
  infoTitle: {
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: "14px",
    letterSpacing: "1px",
    marginRight: "5px",
  },
  infoContent: {
    fontSize: "16px",
    color: "#333",
  },

  // MAP FRAME (Khung tranh)
  mapFrame: {
    border: "4px double #1a1a1a", // Viền đôi dày
    padding: "5px", // Khoảng trắng giữa viền và bản đồ
    backgroundColor: "#fff",
    boxShadow: "5px 5px 0px rgba(0,0,0,0.1)", // Bóng cứng nhẹ
  },

  // 3. CỘT PHẢI (FORM)
  formColumn: {
    flex: "1 1 400px",
  },
  formCard: {
    background: "#fff",
    padding: "40px",
    border: "1px solid #1a1a1a", // Viền đơn
    position: "relative",
    // Hiệu ứng chồng giấy (giả lập tờ giấy đặt lên bàn)
    boxShadow: "10px 10px 0px #e0ded8",
  },
  formTitle: {
    fontSize: "26px",
    fontFamily: "'Playfair Display', serif",
    fontWeight: "700",
    margin: "0 0 10px 0",
    color: "#1a1a1a",
    textAlign: "center",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  dividerSmall: {
    width: "40px",
    height: "2px",
    backgroundColor: "#1a1a1a",
    margin: "0 auto 30px auto",
  },
  formGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "13px",
    color: "#1a1a1a",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'Lora', serif",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    background: "#fdfbf7", // Nền hơi kem nhẹ cho input
    border: "1px solid #888", // Viền xám đậm
    borderRadius: "0", // Vuông vức tuyệt đối
    fontSize: "16px",
    fontFamily: "'Lora', serif",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  // Nút Submit phong cách cổ điển
  submitBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#1a1a1a", // Đen tuyền
    color: "#fdfbf7", // Chữ trắng kem
    border: "none",
    borderRadius: "0",
    fontSize: "16px",
    fontFamily: "'Playfair Display', serif",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
    transition: "opacity 0.3s",
  },
};

export default ContactSection;
