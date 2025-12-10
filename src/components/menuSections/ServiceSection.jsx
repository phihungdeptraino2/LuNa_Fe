import React from "react";
import {
  FaTools,
  FaGuitar,
  FaMicrophoneAlt,
  FaVolumeUp,
  FaArrowRight,
  FaCheckCircle,
  FaMusic,
  FaPhoneAlt,
} from "react-icons/fa";

const ServiceSection = () => {
  // Danh sách dịch vụ
  const services = [
    {
      id: 1,
      title: "Bảo Dưỡng & Sửa Chữa",
      icon: <FaTools />,
      description:
        "Chăm sóc nhạc cụ với sự tỉ mỉ tuyệt đối. Thay dây, căn chỉnh action, vệ sinh đàn bởi nghệ nhân lành nghề.",
    },
    {
      id: 2,
      title: "Đào Tạo Âm Nhạc",
      icon: <FaGuitar />,
      description:
        "Khơi dậy đam mê với giáo trình cổ điển & hiện đại. Piano, Guitar, Violin. Cam kết chất lượng nghệ thuật.",
    },
    {
      id: 3,
      title: "Phòng Thu (Studio)",
      icon: <FaMicrophoneAlt />,
      description:
        "Không gian mộc mạc, chất âm Analog ấm áp. Thu âm, mix & master đạt tiêu chuẩn thính phòng.",
    },
    {
      id: 4,
      title: "Không Gian Âm Nhạc",
      icon: <FaVolumeUp />,
      description:
        "Thiết kế & lắp đặt âm thanh Hi-end cho phòng trà, quán Cafe Acoustic và nhà hát thính phòng.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* --- HEADER --- */}
      <div style={styles.header}>
        <div style={styles.headerDecoration}>
          <div style={styles.decoLine}></div>
          <FaMusic style={styles.decoIcon} />
          <div style={styles.decoLine}></div>
        </div>
        <h2 style={styles.title}>DỊCH VỤ CỦA LUNA</h2>
        <p style={styles.subtitle}>
          <i>"Nơi lưu giữ và thăng hoa những giá trị âm nhạc nguyên bản"</i>
        </p>
      </div>

      {/* --- SERVICE GRID --- */}
      <div style={styles.grid}>
        {services.map((service) => (
          <div key={service.id} style={styles.card}>
            <div style={styles.iconWrapper}>{service.icon}</div>
            <h3 style={styles.cardTitle}>{service.title}</h3>
            <div style={styles.dividerSmall}></div>
            <p style={styles.cardDesc}>{service.description}</p>
            <button style={styles.readMoreBtn}>
              XEM CHI TIẾT <FaArrowRight style={{ marginLeft: 5 }} />
            </button>
          </div>
        ))}
      </div>

      {/* --- PROMISE SECTION --- */}
      <div style={styles.promiseSection}>
        <div style={styles.promiseBorder}>
          <h3 style={styles.promiseTitle}>CAM KẾT CHẤT LƯỢNG</h3>
          <div style={styles.promiseGrid}>
            {[
              "Nghệ nhân trên 10 năm kinh nghiệm",
              "Nhạc cụ & Thiết bị chính hãng",
              "Bảo hành tận tâm trọn đời",
              "Tư vấn chuyên môn sâu sắc",
            ].map((text, index) => (
              <div key={index} style={styles.promiseItem}>
                <FaCheckCircle style={styles.checkIcon} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CTA BANNER --- */}
      <div style={styles.ctaBanner}>
        <div style={styles.ctaContent}>
          <h3 style={styles.ctaTitle}>BẠN CẦN TƯ VẤN?</h3>
          <p style={styles.ctaDesc}>
            Liên hệ ngay để đặt lịch hẹn với nghệ nhân.
          </p>
        </div>

        {/* Nút điện thoại đã sửa căn chỉnh thẳng hàng */}
        <div style={styles.ctaBtnWrapper}>
          <button style={styles.ctaBtn}>
            <FaPhoneAlt size={18} />{" "}
            {/* Bỏ style margin ở đây, dùng gap ở parent */}
            <span style={{ position: "relative", top: "2px" }}>
              0123 456 789
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CSS STYLES ---
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "60px 20px",
    backgroundColor: "white",
    fontFamily: "'Lora', serif",
    color: "#1a1a1a",
  },

  // HEADER STYLES
  header: {
    textAlign: "center",
    marginBottom: "70px",
    position: "relative",
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
    maxWidth: "700px",
    margin: "0 auto",
  },

  // GRID STYLES
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "0",
    border: "2px solid #1a1a1a",
    backgroundColor: "#fff",
  },
  card: {
    padding: "40px 30px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRight: "1px solid #1a1a1a",
    borderBottom: "1px solid #1a1a1a",
  },
  iconWrapper: {
    fontSize: "36px",
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "15px",
    fontFamily: "'Playfair Display', serif",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  dividerSmall: {
    width: "40px",
    height: "1px",
    backgroundColor: "#1a1a1a",
    margin: "0 auto 20px auto",
  },
  cardDesc: {
    fontSize: "15px",
    color: "#444",
    lineHeight: "1.6",
    marginBottom: "25px",
    flex: 1,
  },
  readMoreBtn: {
    background: "transparent",
    border: "1px solid #1a1a1a",
    color: "#1a1a1a",
    padding: "10px 25px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "2px",
    transition: "all 0.3s",
    borderRadius: "0",
  },

  // PROMISE SECTION STYLES
  promiseSection: {
    marginTop: "80px",
    padding: "8px",
    border: "1px solid #1a1a1a",
  },
  promiseBorder: {
    border: "3px double #1a1a1a",
    padding: "40px",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  promiseTitle: {
    fontSize: "28px",
    fontFamily: "'Playfair Display', serif",
    marginBottom: "40px",
    textTransform: "uppercase",
    letterSpacing: "3px",
    textDecoration: "underline",
    textUnderlineOffset: "8px",
  },
  promiseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "30px",
    textAlign: "left",
  },
  promiseItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  checkIcon: {
    color: "#1a1a1a",
    fontSize: "16px",
  },

  // CTA BANNER STYLES (Đã update căn chỉnh)
  ctaBanner: {
    marginTop: "60px",
    background: "#1a1a1a",
    color: "#fdfbf7",
    padding: "50px 60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "30px",
    border: "1px solid #1a1a1a",
    boxShadow: "15px 15px 0px 0px rgba(0,0,0,0.1)",
  },
  ctaContent: {
    flex: 1,
    borderLeft: "2px solid #fdfbf7",
    paddingLeft: "25px",
  },
  ctaTitle: {
    fontSize: "26px",
    fontFamily: "'Playfair Display', serif",
    letterSpacing: "2px",
    margin: "0 0 5px 0",
    fontWeight: "400",
  },
  ctaDesc: {
    margin: 0,
    fontStyle: "italic",
    opacity: 0.8,
    fontSize: "15px",
  },
  ctaBtnWrapper: {
    padding: "5px",
  },
  ctaBtn: {
    background: "transparent",
    color: "#fdfbf7",
    border: "1px solid #fdfbf7",
    outline: "1px solid #fdfbf7",
    outlineOffset: "4px",

    // --- PHẦN CHỈNH SỬA QUAN TRỌNG ĐỂ THẲNG HÀNG ---
    display: "flex", // Bắt buộc dùng Flexbox
    alignItems: "center", // Căn giữa theo trục dọc
    justifyContent: "center", // Căn giữa theo trục ngang
    gap: "12px", // Khoảng cách giữa icon và chữ
    lineHeight: "1", // Khóa chiều cao dòng để không bị lệch
    padding: "14px 35px", // Padding đều
    height: "auto", // Để padding tự quyết định chiều cao

    fontSize: "20px",
    fontFamily: "'Playfair Display', serif",
    letterSpacing: "2px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default ServiceSection;
