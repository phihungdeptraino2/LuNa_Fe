import React, { useEffect, useState, useRef } from "react";
import { getAllProducts } from "../../services/productService";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 1. Import Auth Context
import LoginModal from "../../components/LoginModal"; // 2. Import Login Modal
import "./HomePage.css";

// Icon bộ FontAwesome (fa)
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaCheckCircle,
  FaTruck,
  FaUndo,
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaCcPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcAmazonPay,
} from "react-icons/fa";

// Icon bộ Bootstrap (bs)
import { BsStars, BsShieldCheck, BsBank } from "react-icons/bs";

// Icon bộ Simple Icons (si)
import { SiDinersclub } from "react-icons/si";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIC AUTH & MODAL ---
  const { user, logout } = useAuth(); // Lấy thông tin user
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State mở/đóng modal

  // State để lưu phần trăm cuộn
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  const CATEGORY_LIST = [
    {
      name: "Guitars and Basses",
      img: "https://cdn-icons-png.flaticon.com/512/4430/4430537.png",
    },
    {
      name: "Drums and Percussion",
      img: "https://cdn-icons-png.flaticon.com/512/1255/1255799.png",
    },
    {
      name: "Keys",
      img: "https://cdn-icons-png.flaticon.com/512/2895/2895537.png",
    },
    {
      name: "Studio and Recording",
      img: "https://cdn-icons-png.flaticon.com/512/9385/9385244.png",
    },
    {
      name: "Software",
      img: "https://cdn-icons-png.flaticon.com/512/2285/2285564.png",
    },
    {
      name: "PA Equipment",
      img: "https://cdn-icons-png.flaticon.com/512/3233/3233499.png",
    },
    {
      name: "Lighting and Stage",
      img: "https://cdn-icons-png.flaticon.com/512/3159/3159313.png",
    },
    {
      name: "DJ Equipment",
      img: "https://cdn-icons-png.flaticon.com/512/3067/3067272.png",
    },
    {
      name: "Broadcast & Video",
      img: "https://cdn-icons-png.flaticon.com/512/3660/3660412.png",
    },
    {
      name: "Microphones",
      img: "https://cdn-icons-png.flaticon.com/512/3065/3065873.png",
    },
    {
      name: "Effect & Signal Proc.",
      img: "https://cdn-icons-png.flaticon.com/512/5900/5900350.png",
    },
    {
      name: "Wind Instruments",
      img: "https://cdn-icons-png.flaticon.com/512/860/860264.png",
    },
    {
      name: "Traditional Instruments",
      img: "https://cdn-icons-png.flaticon.com/512/886/886915.png",
    },
    {
      name: "Sheet Music",
      img: "https://cdn-icons-png.flaticon.com/512/3028/3028564.png",
    },
    {
      name: "Cases, Racks and Bags",
      img: "https://cdn-icons-png.flaticon.com/512/2855/2855904.png",
    },
    {
      name: "Cables and Connectors",
      img: "https://cdn-icons-png.flaticon.com/512/3659/3659911.png",
    },
    {
      name: "Accessories",
      img: "https://cdn-icons-png.flaticon.com/512/1066/1066367.png",
    },
    {
      name: "Stompenberg FX",
      img: "https://cdn-icons-png.flaticon.com/512/3131/3131924.png",
    },
  ];

  const DUMMY_PRODUCTS = [
    // {
    //   id: 991,
    //   name: "Moog Spectravox",
    //   price: 7500000,
    //   imageUrl:
    //     "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/586762.jpg",
    //   rating: 5,
    // },
    // {
    //   id: 992,
    //   name: "Höfner Ignition Bass Limited",
    //   price: 9500000,
    //   imageUrl:
    //     "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/576307.jpg",
    //   rating: 4,
    // },
    // {
    //   id: 993,
    //   name: "Sennheiser XSW IEM Set",
    //   price: 11200000,
    //   imageUrl:
    //     "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/541936.jpg",
    //   rating: 5,
    // },
    // {
    //   id: 994,
    //   name: "Epiphone J-45 Express Ebony",
    //   price: 5600000,
    //   imageUrl:
    //     "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/563857.jpg",
    //   rating: 3,
    // },
    // {
    //   id: 995,
    //   name: "Ibanez RG550 Genesis",
    //   price: 25000000,
    //   imageUrl:
    //     "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/432093.jpg",
    //   rating: 5,
    // },
    // {
    //   id: 996,
    //   name: "Yamaha C40",
    //   price: 3200000,
    //   imageUrl:
    //     "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/146816.jpg",
    //   rating: 5,
    // },
    // {
    //   id: 997,
    //   name: "Fender Stratocaster",
    //   price: 18500000,
    //   imageUrl:
    //     "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/432093.jpg",
    //   rating: 5,
    // },
    // {
    //   id: 998,
    //   name: "Gibson Les Paul",
    //   price: 65000000,
    //   imageUrl:
    //     "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/576307.jpg",
    //   rating: 5,
    // },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts();
        if (!data || data.length === 0) setProducts(DUMMY_PRODUCTS);
        else setProducts(data);
      } catch (error) {
        setProducts(DUMMY_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm xử lý khi bấm vào icon User
  const handleUserIconClick = () => {
    if (user) {
      const confirmLogout = window.confirm("Bạn muốn đăng xuất?");
      if (confirmLogout) logout();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const scrollValue = container.scrollLeft;
      if (maxScroll > 0) {
        const progress = (scrollValue / maxScroll) * 100;
        setScrollProgress(progress);
      }
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* 3. NHÚNG LOGIN MODAL VÀO ĐÂY */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <div className="super-top-bar">
        CYBERWEEK - Save up to 70% 🔥 Shop Now!
      </div>

      <header>
        <div className="top-bar">
          <div className="top-links">
            <span>Service</span> <span>Contact us</span> <span>About Us</span>
          </div>
          <div className="top-links">
            <span>Repair Service</span> <span>3-Year Luna Warranty</span>
          </div>
        </div>
        <div className="main-header">
          <div className="logo">
            Luna<span>•</span>Music
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <FaSearch className="search-icon" />
          </div>
          <div className="user-actions">
            <div className="action-item">EN - $</div>

            {/* 4. SỬA PHẦN ICON USER CÓ SỰ KIỆN ONCLICK */}
            <div
              className="action-item"
              onClick={handleUserIconClick}
              style={{ cursor: "pointer" }}
            >
              {user ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "#5a02c2",
                  }}
                >
                  <FaUser className="header-icon" />
                  <span style={{ fontSize: 14, fontWeight: "bold" }}>
                    Hi, {user.username}
                  </span>
                </div>
              ) : (
                <FaUser className="header-icon" />
              )}
            </div>

            <FaHeart className="header-icon" />
            <div className="action-item">
              <FaShoppingCart className="header-icon" />
              <span className="badge">0</span>
            </div>
          </div>
        </div>
        <div className="category-bar">
          {/* Giữ nguyên danh sách Category */}
          <span className="cat-item">Electric Guitar</span>
          <span className="cat-item">Acoustic Guitar</span>
          <span className="cat-item">Bass Guitar</span>
          <span className="cat-item">Digital Piano & Keyboards</span>
          <span className="cat-item">Acoustic Drums</span>
          <span className="cat-item">Electronic Drums</span>
          <span className="cat-item">Wind Instruments</span>
          <span className="cat-item">Bowed Strings</span>
          <span className="cat-item">Studio & Recording</span>
          <span className="cat-item">Amplifiers</span>
          <span className="cat-item">Effects Pedals</span>
          <span className="cat-item">Accessories</span>
        </div>
      </header>

      {/* --- HERO BANNER --- */}
      <section className="hero-container">
        <h2 className="hero-title">Welcome to Luna 👋</h2>
        <div className="hero-banners">
          <div className="banner-side">
            <img
              className="banner-img"
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop"
              alt="1"
            />
          </div>
          <div className="banner-center">
            <img
              className="banner-img"
              src="https://thumbs.static-thomann.de/thumb/thumb1000x/pics/cms/image/teasertool/en/17066/cyber_week_banner_2025_en.webp"
            />
          </div>
          <div className="banner-side">
            <img
              className="banner-img"
              src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop"
              alt="3"
            />
          </div>
        </div>
      </section>

      {/* --- TRUST BAR --- */}
      <div className="trust-bar-container">
        <div className="trust-bar">
          <div className="trust-item">
            <FaUndo className="trust-icon" /> 30 Days Money-Back
          </div>
          <div className="trust-item">
            <BsShieldCheck className="trust-icon" /> 3 Years Warranty
          </div>
          <div className="trust-item">
            <FaTruck className="trust-icon" /> Free Shipping
          </div>
          <div className="trust-item">
            <BsStars className="trust-icon" /> Best Service
          </div>
        </div>
      </div>

      {/* --- CYBERWEEK CAROUSEL --- */}
      <section className="cyberweek-section">
        <h2 className="cw-title-3d">CYBERWEEK</h2>

        <div className="carousel-wrapper">
          <button className="nav-btn prev-btn" onClick={scrollLeft}>
            <FaChevronLeft />
          </button>

          <div
            className="product-carousel"
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            {loading ? (
              <div style={{ color: "white" }}>Loading...</div>
            ) : (
              products.map((product) => {
                let imgUrl = product.imageUrl;
                if (product.productImages && product.productImages.length > 0)
                  imgUrl = product.productImages[0].imageUrl;
                const fakeOldPrice = product.price * 1.2;

                return (
                  <div key={product.id} className="product-card carousel-card">
                    <div className="deal-badge">Deal</div>
                    <div className="card-img-container">
                      <img
                        src={imgUrl || "https://via.placeholder.com/200"}
                        alt={product.name}
                        className="card-img"
                      />
                    </div>
                    <div className="card-info">
                      <Link
                        to={`/products/${product.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <h4>{product.name}</h4>
                      </Link>
                      <div className="rating">
                        ⭐⭐⭐⭐⭐ <span style={{ color: "#888" }}>(7)</span>
                      </div>
                      <div className="price-box">
                        <span className="price">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(product.price)}
                        </span>
                        <span className="old-price">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(fakeOldPrice)}
                        </span>
                      </div>
                      <div className="stock">
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#4caf50",
                          }}
                        ></div>{" "}
                        In stock
                      </div>
                      <div className="card-actions">
                        <FaHeart className="heart-icon" />
                        <FaShoppingCart className="cart-btn-mini" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button className="nav-btn next-btn" onClick={scrollRight}>
            <FaChevronRight />
          </button>
        </div>

        <div className="custom-scroll-track">
          <div
            className="custom-scroll-thumb"
            style={{ left: `${scrollProgress * 0.8}%` }}
          ></div>
        </div>

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button className="show-all-btn">Show all deals</button>
        </div>
      </section>

      {/* --- CATEGORIES LIST --- */}
      <section className="categories-list-section">
        <h2 className="cat-section-title">Our Categories</h2>
        <div className="categories-grid-container">
          {CATEGORY_LIST.map((cat, index) => (
            <div key={index} className="category-list-item">
              <div className="cat-img-wrapper">
                <img src={cat.img} alt={cat.name} />
              </div>
              <span className="cat-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="site-footer">
        {/* Newsletter */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-left">
              <div className="newsletter-icon-wrapper">
                <span style={{ fontSize: 24 }}>🎟️</span>
              </div>
              <div className="newsletter-text">
                <h3>Luna Newsletter</h3>
                <p>
                  Subscribe to the Luna Newsletter and with a bit of luck win
                  one of 50 vouchers worth €50 each!
                </p>
                <ul className="newsletter-benefits">
                  <li>
                    <FaCheck className="check-icon-small" /> Inspirational
                    contributions
                  </li>
                  <li>
                    <FaCheck className="check-icon-small" /> Deals
                  </li>
                  <li>
                    <FaCheck className="check-icon-small" /> Luna Insights
                  </li>
                </ul>
              </div>
            </div>
            <div className="newsletter-right">
              <div className="input-group">
                <input type="email" placeholder="Email address*" />
                <button>Sign up now</button>
              </div>
              <p className="disclaimer">
                By clicking on "Sign up now", you agree to receiving e-mail
                advertising. You can unsubscribe at any time.
              </p>
              <p className="required-hint">* Required</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="footer-info-section">
          <div className="footer-col">
            <h4>Shop and pay safely</h4>
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
              Payment can be made safely and securely with PayPal, Amazon Pay,
              Credit Card or Bank Transfer.
            </p>
          </div>

          <div className="footer-col">
            <h4>Your benefits</h4>
            <ul className="footer-list-check">
              <li>
                <FaCheck className="check-icon-small" /> 3 Years Luna Warranty
              </li>
              <li>
                <FaCheck className="check-icon-small" /> 30-Day Money-Back
                Guarantee
              </li>
              <li>
                <FaCheck className="check-icon-small" /> Repair Service
              </li>
              <li>
                <FaCheck className="check-icon-small" /> Advice from our experts
              </li>
              <li>
                <FaCheck className="check-icon-small" /> Satisfaction Guarantee
              </li>
              <li>
                <FaCheck className="check-icon-small" /> Europe's Largest
                Warehouse
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Service</h4>
            <ul className="footer-list-link">
              <li>Shipping Costs and Delivery Times</li>
              <li>Help Centre</li>
              <li>Vouchers</li>
              <li>Contact us</li>
              <li>Walk-in Store</li>
              <li>Service Overview</li>
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
                <li>Terms & Conditions / Imprint</li>
                <li>Privacy Policy</li>
                <li>Cookie Settings</li>
                <li>Right of Withdrawal</li>
                <li>Online Ordering Process</li>
                <li>Statutory Warranty Rights</li>
              </ul>
            </div>

            <div className="dark-col">
              <ul className="dark-links">
                <li>About Us</li>
                <li>Jobs & Careers</li>
                <li>Blog</li>
                <li>Classified Ads</li>
                <li>Whistleblower system</li>
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
                  <i>Luna loves you, because you rock!</i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
