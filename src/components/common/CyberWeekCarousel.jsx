import React, { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const CyberWeekCarousel = ({ products, loading }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const progress = (container.scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    }
  };

  const scrollRight = () => scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  const scrollLeft = () => scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });

  return (
    <section className="cyberweek-section">
      <h2 className="cw-title-3d">CYBERWEEK</h2>
      <div className="carousel-wrapper">
        <button className="nav-btn prev-btn" onClick={scrollLeft}><FaChevronLeft /></button>
        <div className="product-carousel" ref={scrollContainerRef} onScroll={handleScroll}>
          {loading ? (
            <div style={{ color: "white" }}>Loading...</div>
          ) : (
            products.map((product) => {
              const imgUrl = product.productImages?.[0]?.imageUrl || product.imageUrl || "https://via.placeholder.com/200";
              const fakeOldPrice = product.price * 1.2;
              return (
                <div key={product.id} className="product-card carousel-card">
                  <div className="deal-badge">Deal</div>
                  <div className="card-img-container"><img src={imgUrl} alt={product.name} className="card-img" /></div>
                  <div className="card-info">
                    <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}><h4>{product.name}</h4></Link>
                    <div className="rating">⭐⭐⭐⭐⭐ <span style={{ color: "#888" }}>(7)</span></div>
                    <div className="price-box">
                      <span className="price">${product.price.toLocaleString()}</span>
                      <span className="old-price">${fakeOldPrice.toLocaleString()}</span>
                    </div>
                    <div className="stock"><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50" }}></div> In stock</div>
                    <div className="card-actions"><FaHeart className="heart-icon" /> <FaShoppingCart className="cart-btn-mini" /></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button className="nav-btn next-btn" onClick={scrollRight}><FaChevronRight /></button>
      </div>
      <div className="custom-scroll-track">
        <div className="custom-scroll-thumb" style={{ left: `${scrollProgress * 0.8}%` }}></div>
      </div>
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button className="show-all-btn">Show all deals</button>
      </div>
    </section>
  );
};

export default CyberWeekCarousel;
