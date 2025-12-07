import React from "react";
import { FaCheck, FaFacebook, FaYoutube, FaInstagram, FaPinterest, FaTiktok, FaCcPaypal, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcAmazonPay } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { SiDinersclub } from "react-icons/si";
import "../../pages/home/HomePage.css";

const Footer = () => (
  <footer className="site-footer">
    {/* Newsletter */}
    <div className="newsletter-section">
      <div className="newsletter-content">
        <div className="newsletter-left">
          <div className="newsletter-icon-wrapper">
            <span style={{ fontSize: 24 }}>🎟️</span>
          </div>
          <div className="newsletter-text">
            <h3>Bản tin Luna Music</h3>
            <p>
              Đăng ký nhận bản tin của Luna và có cơ hội nhận ngay một trong 50
              phiếu mua hàng trị giá 1.000.000₫!
            </p>
            <ul className="newsletter-benefits">
              <li>
                <FaCheck className="check-icon-small" /> Bài viết truyền cảm hứng
              </li>
              <li>
                <FaCheck className="check-icon-small" /> Ưu đãi độc quyền
              </li>
              <li>
                <FaCheck className="check-icon-small" /> Tin tức Luna
              </li>
            </ul>
          </div>
        </div>
        <div className="newsletter-right">
          <div className="input-group">
            <input type="email" placeholder="Địa chỉ Email*" />
            <button>Đăng ký ngay</button>
          </div>
          <p className="disclaimer">
            Bằng cách nhấp vào "Đăng ký ngay", bạn đồng ý nhận email quảng cáo.
            Bạn có thể hủy đăng ký bất cứ lúc nào.
          </p>
          <p className="required-hint">* Bắt buộc</p>
        </div>
      </div>
    </div>

    {/* Info Section */}
    <div className="footer-info-section">
      <div className="footer-col">
        <h4>Mua sắm & Thanh toán an toàn</h4>
        <div className="payment-icons">
          <FaCcPaypal className="pay-icon" style={{ color: "#003087" }} />
          <FaCcAmazonPay
            className="pay-icon"
            style={{ color: "#232f3e" }}
          />
          <FaCcVisa className="pay-icon" style={{ color: "#1a1f71" }} />
          <FaCcMastercard
            className="pay-icon"
            style={{ color: "#eb001b" }}
          />
          <FaCcAmex className="pay-icon" style={{ color: "#2e77bc" }} />
          <SiDinersclub className="pay-icon" style={{ color: "#004a97" }} />
          <BsBank className="pay-icon" style={{ color: "#555" }} />
        </div>
        <p className="payment-desc">
          Thanh toán an toàn và bảo mật qua PayPal, Amazon Pay, Thẻ tín dụng
          hoặc Chuyển khoản ngân hàng.
        </p>
      </div>

      <div className="footer-col">
        <h4>Quyền lợi của bạn</h4>
        <ul className="footer-list-check">
          <li>
            <FaCheck className="check-icon-small" /> Bảo hành Luna 3 năm
          </li>
          <li>
            <FaCheck className="check-icon-small" /> Hoàn tiền trong 30 ngày
          </li>
          <li>
            <FaCheck className="check-icon-small" /> Dịch vụ sửa chữa
          </li>
          <li>
            <FaCheck className="check-icon-small" /> Tư vấn từ chuyên gia
          </li>
          <li>
            <FaCheck className="check-icon-small" /> Đảm bảo hài lòng
          </li>
          <li>
            <FaCheck className="check-icon-small" /> Kho hàng quy mô lớn
          </li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Dịch vụ</h4>
        <ul className="footer-list-link">
          <li>Phí vận chuyển & Thời gian giao hàng</li>
          <li>Trung tâm trợ giúp</li>
          <li>Phiếu mua hàng (Vouchers)</li>
          <li>Liên hệ với chúng tôi</li>
          <li>Cửa hàng trực tiếp</li>
          <li>Tổng quan dịch vụ</li>
        </ul>
      </div>
    </div>

    {/* Dark Bottom Section */}
    <div className="footer-dark">
      <div className="dark-content">
        <div className="dark-col">
          <div className="social-icons">
            <FaFacebook /> <FaYoutube /> <FaInstagram /> <FaPinterest />{" "}
            <FaTiktok />
          </div>
          <ul className="dark-links">
            <li>Điều khoản & Điều kiện</li>
            <li>Chính sách bảo mật</li>
            <li>Cài đặt Cookie</li>
            <li>Chính sách đổi trả</li>
            <li>Quy trình đặt hàng Online</li>
            <li>Quyền bảo hành theo luật định</li>
          </ul>
        </div>

        <div className="dark-col">
          <ul className="dark-links">
            <li>Về chúng tôi</li>
            <li>Tuyển dụng</li>
            <li>Blog</li>
            <li>Rao vặt</li>
            <li>Hệ thống phản ánh & Khiếu nại</li>
          </ul>
        </div>

        <div className="dark-col app-col">
          <div className="app-buttons">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="App Store"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
            />
          </div>
          <div className="copyright">
            <p>© 1996–2025 Luna GmbH.</p>
            <p>
              <i>Luna yêu bạn, vì bạn rất tuyệt!</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;