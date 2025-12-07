import React, { useEffect, useState } from "react";
import { getProductById } from "../../services/productService";
import "./ProductDetailPage.css";
import { FaStar, FaShoppingCart, FaHeart, FaCheck } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import LoginModal from "../../components/LoginModal";
import { useAuth } from "../../context/AuthContext";

<button onClick={() => addToCart(product, quantity)}>
  Thêm vào giỏ hàng
</button>


const ProductDetailPage = () => {
  const { id } = useParams();          // Lấy id từ URL
  const navigate = useNavigate();      // Dùng để quay lại
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth(); // user = null nếu chưa đăng nhập



  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState("");
  const BE_HOST = "http://localhost:8081";
  const buildImageUrl = (url) => {
  if (!url) return "";
  return `${BE_HOST}${url.startsWith("/") ? url : `/${url}`}`;
};



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setMainImage(buildImageUrl(data.productImages?.[0]?.imageUrl || ""));

      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Đang tải chi tiết sản phẩm...</div>;
  if (!product) return <div className="loading">Sản phẩm không tồn tại</div>;

  const reviews = product.reviews || []; // Đảm bảo reviews là mảng
  const totalReviews = reviews.length;
  const totalRatingSum = reviews.reduce((sum, rev) => sum + (rev.rating || 0), 0);
  const averageRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0;

  const handleQuantityChange = (amount) => {
    const newQty = quantity + amount;
    if (newQty >= 1 && newQty <= (product.stockQuantity || 100)) setQuantity(newQty);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div className="product-detail-container">
      
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>{product.category?.name || "Sản phẩm"}</span> / <span>{product.name}</span>
      </div>

      <div className="product-main-section">
        <div className="left-column">
          <div 
          className="main-image-wrapper"
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.firstChild.style.transform = 'scale(2)'; // zoom sát hơn
            e.currentTarget.firstChild.style.objectPosition = `${x}% ${y}%`;
          }}
          onMouseLeave={e => {
            e.currentTarget.firstChild.style.transform = 'scale(1)';
            e.currentTarget.firstChild.style.objectPosition = 'center center';
          }}
        >
          <img src={mainImage} alt={product.name} />
        </div>


          <div className="thumbnail-list">
            {product.productImages?.map((img, index) => (
              <img
                key={index}
                src={buildImageUrl(img.imageUrl)}
                alt="thumb"
                className={mainImage === buildImageUrl(img.imageUrl) ? "active" : ""} 
                onClick={() => setMainImage(buildImageUrl(img.imageUrl))}
              />

            ))}
          </div>
        </div>

        <div className="right-column">
          <h1>{product.name}</h1>
          <div className="rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < (product.reviews?.[0]?.rating || 0) ? "#FFD700" : "#ccc"} />
              ))}
            </div>
            <span className="review-count">({totalReviews} đánh giá)</span>
            {/* NÚT CHUYỂN ĐẾN TRANG ĐÁNH GIÁ (NEW) */}
            {totalReviews > 0 && (
                <button 
                    className="view-all-reviews-btn" 
                    onClick={() => navigate(`/products/${product.id}/reviews`)} // Chuyển đến trang đánh giá
                >
                    Xem tất cả đánh giá ({totalReviews})
                </button>
            )}
          </div>

          <div className="price-section">
            <span className="current-price">{formatPrice(product.price)}</span>
          </div>

          <div className="stock-status">
            <FaCheck /> Còn hàng ({product.stockQuantity || 0})
          </div>

          <div className="actions-row">
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <input type="text" readOnly value={quantity} />
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={() => {
                addToCart(product, quantity);
              }}>
              <FaShoppingCart /> Thêm vào giỏ hàng
            </button>
            <button
              className="buy-now-btn"
              onClick={() => {
                if (!user) {
                  setShowLoginModal(true); // chưa đăng nhập -> hiện modal login
                  return;
                }
                addToCart(product, quantity);
                navigate("/cart"); // hoặc /cart tuỳ bạn
              }}
            >
              Mua hàng
            </button>

            <button className="wishlist-btn">
              <FaHeart /> Yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="product-bottom-section">
        <h2>Thông số kỹ thuật</h2>
        <table>
          <tbody>
            <tr>
              <td>Thương hiệu</td>
              <td>{product.brand?.name || "Đang cập nhật"}</td>
            </tr>
            <tr>
              <td>Danh mục</td>
              <td>{product.category?.name || "Đang cập nhật"}</td>
            </tr>
            {product.productAttributes?.map((attr, i) => (
              <tr key={i}>
                <td>{attr.attribute?.name}</td>
                <td>{attr.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Mô tả sản phẩm</h2>
        <p>{product.description}</p>

        <h2>Đánh giá sản phẩm</h2>
        {/* {product.reviews?.map((rev) => (
          <div key={rev.id} className="review-card">
            <div className="review-header">
              <strong>{rev.userName || "Người dùng ẩn danh"}</strong>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < rev.rating ? "#FFD700" : "#ccc"} />
                ))}
              </div>
            </div>
            <p>{rev.reviewText}</p>
          </div>
        ))} */}
        {/* NÚT XEM TẤT CẢ ĐÁNH GIÁ (LẦN 2: Dưới phần đánh giá) */}
        {totalReviews > 0 ? (
             <>
                 {/* Hiển thị TỐI ĐA 3 đánh giá gần nhất/tốt nhất */}
                 {reviews.slice(0, 3).map((rev) => (
                    <div key={rev.id} className="review-card">
                        {/* ... Nội dung đánh giá ... */}
                    </div>
                 ))}
                 <button 
                    className="view-more-reviews-btn" 
                    onClick={() => navigate(`/products/${product.id}/reviews`)}
                 >
                    Xem thêm {totalReviews > 3 ? `(${totalReviews - 3})` : ""} đánh giá khác
                 </button>
             </>
        ) : (
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(userData) => {
          setShowLoginModal(false);
          addToCart(product, quantity);

          if (userData.roles.includes("CUSTOMER")) {
            navigate("/customer/cart");
          } else if (userData.roles.includes("ADMIN")) {
            navigate("/admin/dashboard");
          }
        }}
      />
    </div>
  );
};



export default ProductDetailPage;
