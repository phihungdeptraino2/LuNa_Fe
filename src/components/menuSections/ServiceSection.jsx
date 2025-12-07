import React from "react";
import {
  FaTools,
  FaGuitar,
  FaMicrophoneAlt,
  FaVolumeUp,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const ServiceSection = () => {
  // Danh sách dịch vụ giả lập
  const services = [
    {
      id: 1,
      title: "Bảo Dưỡng & Sửa Chữa",
      icon: <FaTools />,
      description:
        "Đội ngũ kỹ thuật viên chuyên nghiệp, nhận sửa chữa Guitar, Piano, Organ... Thay dây, căn chỉnh action, vệ sinh đàn uy tín.",
    },
    {
      id: 2,
      title: "Đào Tạo Âm Nhạc",
      icon: <FaGuitar />,
      description:
        "Các khóa học từ cơ bản đến nâng cao: Guitar đệm hát, Piano cổ điển, Ukulele, Thanh nhạc. Cam kết đầu ra sau 3 tháng.",
    },
    {
      id: 3,
      title: "Phòng Thu Âm (Studio)",
      icon: <FaMicrophoneAlt />,
      description:
        "Hệ thống phòng thu đạt chuẩn quốc tế. Nhận thu âm bài hát, mix & master, sản xuất âm nhạc trọn gói với giá ưu đãi.",
    },
    {
      id: 4,
      title: "Lắp Đặt Âm Thanh",
      icon: <FaVolumeUp />,
      description:
        "Tư vấn và lắp đặt hệ thống âm thanh cho quán Cafe, Phòng trà, Hội trường, Nhà thờ với chi phí tối ưu nhất.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>Dịch Vụ Của Luna Music</h2>
        <p style={styles.subtitle}>
          Không chỉ cung cấp nhạc cụ, chúng tôi mang đến những giải pháp âm nhạc
          toàn diện nhất cho đam mê của bạn.
        </p>
      </div>

      {/* SERVICE GRID */}
      <div style={styles.grid}>
        {services.map((service) => (
          <div key={service.id} style={styles.card}>
            <div style={styles.iconWrapper}>{service.icon}</div>
            <h3 style={styles.cardTitle}>{service.title}</h3>
            <p style={styles.cardDesc}>{service.description}</p>
            <button style={styles.readMoreBtn}>
              Xem chi tiết <FaArrowRight style={{ fontSize: 12 }} />
            </button>
          </div>
        ))}
      </div>

      {/* PROMISE SECTION (Cam kết) */}
      <div style={styles.promiseSection}>
        <h3 style={{ ...styles.title, fontSize: "28px", marginBottom: 30 }}>
          Tại Sao Chọn Chúng Tôi?
        </h3>
        <div style={styles.promiseGrid}>
          <div style={styles.promiseItem}>
            <FaCheckCircle style={styles.checkIcon} />{" "}
            <span>Đội ngũ chuyên gia trên 10 năm kinh nghiệm</span>
          </div>
          <div style={styles.promiseItem}>
            <FaCheckCircle style={styles.checkIcon} />{" "}
            <span>Trang thiết bị hiện đại, chính hãng</span>
          </div>
          <div style={styles.promiseItem}>
            <FaCheckCircle style={styles.checkIcon} />{" "}
            <span>Bảo hành dịch vụ lên đến 12 tháng</span>
          </div>
          <div style={styles.promiseItem}>
            <FaCheckCircle style={styles.checkIcon} />{" "}
            <span>Hỗ trợ tư vấn 24/7 hoàn toàn miễn phí</span>
          </div>
        </div>
      </div>

      {/* CTA BANNER */}
      <div style={styles.ctaBanner}>
        <div>
          <h3 style={{ margin: 0, fontSize: 24 }}>
            Bạn cần tư vấn dịch vụ ngay?
          </h3>
          <p style={{ margin: "5px 0 0 0", opacity: 0.9 }}>
            Liên hệ hotline để đặt lịch hẹn sửa chữa hoặc đăng ký khóa học.
          </p>
        </div>
        <button style={styles.ctaBtn}>Gọi Ngay: 0123 456 789</button>
      </div>
    </div>
  );
};

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
    color: "#1e1e2d",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    maxWidth: "700px",
    margin: "0 auto",
  },
  // GRID
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", // Tự động co giãn cột
    gap: "30px",
    marginBottom: "60px",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconWrapper: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#f3e8ff", // Tím nhạt
    color: "#5a02c2", // Tím đậm
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#333",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "20px",
    flex: 1, // Để đẩy nút xuống dưới cùng nếu nội dung ngắn dài khác nhau
  },
  readMoreBtn: {
    background: "transparent",
    border: "1px solid #5a02c2",
    color: "#5a02c2",
    padding: "8px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
  },

  // PROMISE SECTION
  promiseSection: {
    textAlign: "center",
    background: "#f9f9f9",
    padding: "40px",
    borderRadius: "16px",
    marginBottom: "50px",
  },
  promiseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    textAlign: "left",
  },
  promiseItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#444",
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
  },
  checkIcon: {
    color: "#10b981", // Màu xanh lá uy tín
    fontSize: "18px",
    flexShrink: 0,
  },

  // CTA BANNER
  ctaBanner: {
    background: "linear-gradient(90deg, #5a02c2 0%, #8e2de2 100%)", // Gradient tím
    padding: "30px 40px",
    borderRadius: "12px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    boxShadow: "0 10px 30px rgba(90, 2, 194, 0.3)",
  },
  ctaBtn: {
    background: "white",
    color: "#5a02c2",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
};

export default ServiceSection;
