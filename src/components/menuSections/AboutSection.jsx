import { Music, Guitar, Mic2, Piano, Drum, Award, Users, Heart } from 'lucide-react';
import './AboutSection.css'

export default function AboutSection() {
  return (
    <>
      <div className="about-container">
        {/* Floating Icons */}
        <div className="floating-icons">
          <div className="floating-icon icon-1">
            <Music size={64} />
          </div>
          <div className="floating-icon icon-2">
            <Guitar size={80} />
          </div>
          <div className="floating-icon icon-3">
            <Piano size={96} />
          </div>
          <div className="floating-icon icon-4">
            <Drum size={64} />
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="container">
            <h1 className="main-title">🎵 Harmony Music Store 🎵</h1>
            <p className="subtitle">Nơi Âm Nhạc Trở Thành Hiện Thực</p>
            <div className="divider"></div>
          </div>
        </div>

        {/* Story Section */}
        <div className="story-section">
          <div className="container">
            <div className="glass-card">
              <div className="story-grid">
                <div className="story-content">
                  <h2>
                    <Heart size={40} color="#f87171" />
                    Câu Chuyện Của Chúng Tôi
                  </h2>
                  <p>
                    Từ năm 2010, Harmony Music Store đã trở thành ngôi nhà thứ hai của hàng nghìn nhạc sĩ, từ những người mới bắt đầu đến các nghệ sĩ chuyên nghiệp. Chúng tôi tin rằng mỗi người đều có một giai điệu riêng trong tâm hồn.
                  </p>
                  <p>
                    Với hơn 15 năm kinh nghiệm, chúng tôi tự hào mang đến những nhạc cụ chất lượng cao từ các thương hiệu nổi tiếng thế giới, cùng đội ngũ tư vấn chuyên nghiệp và nhiệt tình.
                  </p>
                </div>
                <div className="stats-card">
                  <div className="stat-item">
                    <div className="stat-number">15+</div>
                    <div className="stat-label">Năm Kinh Nghiệm</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">10,000+</div>
                    <div className="stat-label">Khách Hàng Hài Lòng</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Sản Phẩm Đa Dạng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="values-section">
          <div className="container">
            <h2 className="section-title">Giá Trị Cốt Lõi</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="icon-wrapper icon-yellow">
                  <Award size={40} color="white" />
                </div>
                <h3>Chất Lượng Hàng Đầu</h3>
                <p>Cam kết 100% sản phẩm chính hãng, bảo hành dài hạn</p>
              </div>
              <div className="value-card">
                <div className="icon-wrapper icon-blue">
                  <Users size={40} color="white" />
                </div>
                <h3>Tư Vấn Chuyên Nghiệp</h3>
                <p>Đội ngũ nhân viên am hiểu âm nhạc, tận tâm phục vụ</p>
              </div>
              <div className="value-card">
                <div className="icon-wrapper icon-pink">
                  <Heart size={40} color="white" />
                </div>
                <h3>Đam Mê Âm Nhạc</h3>
                <p>Không chỉ bán hàng, chúng tôi chia sẻ tình yêu âm nhạc</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="categories-section">
          <div className="container">
            <h2 className="section-title">Danh Mục Sản Phẩm</h2>
            <div className="categories-grid">
              <div className="category-card cat-guitar">
                <div className="category-icon">
                  <Guitar size={64} color="white" />
                </div>
                <h3 className="category-name">Đàn Guitar</h3>
              </div>
              <div className="category-card cat-piano">
                <div className="category-icon">
                  <Piano size={64} color="white" />
                </div>
                <h3 className="category-name">Đàn Piano</h3>
              </div>
              <div className="category-card cat-drum">
                <div className="category-icon">
                  <Drum size={64} color="white" />
                </div>
                <h3 className="category-name">Trống</h3>
              </div>
              <div className="category-card cat-mic">
                <div className="category-icon">
                  <Mic2 size={64} color="white" />
                </div>
                <h3 className="category-name">Micro & Âm Thanh</h3>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2 className="cta-title">
                Hãy Để Âm Nhạc Nói Thay Lời Bạn Muốn Nói! 🎸
              </h2>
              <p className="cta-text">
                Ghé thăm cửa hàng hoặc liên hệ với chúng tôi ngay hôm nay để tìm được nhạc cụ hoàn hảo dành cho bạn!
              </p>
              <button className="cta-button">Khám Phá Ngay →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}