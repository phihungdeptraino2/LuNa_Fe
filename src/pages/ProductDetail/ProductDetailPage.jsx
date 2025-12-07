import React, { useEffect, useState } from "react";
import { getProductById } from "../../services/productService";
import "./ProductDetailPage.css";
import { FaStar, FaShoppingCart, FaHeart, FaCheck } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import LoginModal from "../../components/LoginModal";
import { useAuth } from "../../context/AuthContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
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

  const reviews = product.reviews || [];
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
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.firstChild.style.transform = "scale(2)";
              e.currentTarget.firstChild.style.objectPosition = `${x}% ${y}%`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.firstChild.style.transform = "scale(1)";
              e.currentTarget.firstChild.style.objectPosition = "center center";
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
                <FaStar key={i} color={i < averageRating ? "#FFD700" : "#ccc"} />
              ))}
            </div>
            <span className="review-count">({totalReviews} đánh giá)</span>

            {/* NÚT LUÔN HIỂN THỊ */}
            <button
              className="view-all-reviews-btn"
              onClick={() => navigate(`/products/${product.id}/reviews`)}
            >
              {totalReviews > 0
                ? `Xem tất cả đánh giá (${totalReviews})`
                : "Viết đánh giá đầu tiên"}
            </button>
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
              onClick={() => addToCart(product, quantity)}
            >
              <FaShoppingCart /> Thêm vào giỏ hàng
            </button>

            <button
              className="buy-now-btn"
              onClick={() => {
                if (!user) return setShowLoginModal(true);
                addToCart(product, quantity);
                navigate("/cart");
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

        <h2>Đánh giá sản phẩm</h2>

        {totalReviews === 0 ? (
          <>
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            <button
              className="view-more-reviews-btn"
              onClick={() => navigate(`/products/${product.id}/reviews`)}
            >
              Viết đánh giá đầu tiên
            </button>
          </>
        ) : (
          <>
            {reviews.slice(0, 3).map((rev) => (
              <div key={rev.id} className="review-card">
                <strong>{rev.userName}</strong>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < rev.rating ? "#FFD700" : "#ccc"} />
                  ))}
                </div>
                <p>{rev.reviewText}</p>
              </div>
            ))}

            <button
              className="view-more-reviews-btn"
              onClick={() => navigate(`/products/${product.id}/reviews`)}
            >
              Xem tất cả đánh giá ({totalReviews})
            </button>
          </>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default ProductDetailPage;
