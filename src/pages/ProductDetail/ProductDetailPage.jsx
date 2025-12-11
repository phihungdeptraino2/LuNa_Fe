import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getAllProducts } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../../components/LoginModal";
import { FaStar, FaShoppingCart, FaHeart, FaCheck, FaShippingFast, FaShieldAlt, FaGift, FaCreditCard, FaHeadset } from "react-icons/fa";
import { productVideos } from "../../data/productVideos";
import ProductCard from "../../components/ProductCard";
import "./ProductDetailPage.css";
import { BE_HOST } from "../../utils/constants";


const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  const videoUrl = productVideos[id];

  const getVideoId = (url) => {
    if (!url) return "";
    if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1];
    return "";
  };

  const buildImageUrl = (url) => {
    if (!url) return "";
    return `${BE_HOST}${url.startsWith("/") ? url : `/${url}`}`;
  };

  // Logic fetch SP liên quan theo Category ID (Sản phẩm cùng loại nhạc cụ)
  const fetchRelatedProducts = async (categoryId, currentProductId) => {
    try {
      // Lấy tất cả sản phẩm để lọc theo Category ID
      const allProductsResponse = await getAllProducts();
      const allProducts = allProductsResponse.data || [];

      // Lọc sản phẩm cùng Category ID và loại trừ sản phẩm đang xem
      const filtered = allProducts
        .filter(p => p.id !== currentProductId && p.category?.id === categoryId)
        .slice(0, 4); // Giới hạn 4 sản phẩm

      setRelatedProducts(filtered);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        const defaultImage = data.productImages?.find(img => img.default)?.imageUrl || data.productImages?.[0]?.imageUrl || "";
        setMainImage(buildImageUrl(defaultImage));

        // Chạy fetch SP liên quan sau khi có data sản phẩm chính
        if (data.category?.id) {
          // Đảm bảo Category ID là số nếu cần thiết
          const categoryIdNumber = parseInt(data.category.id);
          await fetchRelatedProducts(categoryIdNumber, data.id);
        } else {
          setLoading(false);
        }

      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
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
  const stockAvailable = product.stockQuantity > 0;

  const handleQuantityChange = (amount) => {
    const newQty = quantity + amount;
    if (newQty >= 1 && newQty <= (product.stockQuantity || 100)) setQuantity(newQty);
  };

  const handleAddToCart = () => {
    if (!stockAvailable) {
      // alert("Sản phẩm tạm thời hết hàng.");
      return;
    }
    addToCart(product, quantity);
    // alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng.`);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

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
          {videoUrl && (
            <div className="product-video-direct">
              <iframe
                width="100%"
                height="100%"
                // Thêm autoplay=1 và mute=1 để tự chạy
                src={`https://www.youtube.com/embed/${getVideoId(videoUrl)}?autoplay=1&mute=1&loop=1&playlist=${getVideoId(videoUrl)}&controls=1`}
                title="Product Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}


        </div>

        <div className="right-column">
          <h1>{product.name}</h1>
          <div className="rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < averageRating ? "#FFD700" : "#ccc"} />
              ))}
            </div>
            <span
              className="review-count"
              onClick={() => navigate(`/products/${product.id}/reviews`)}
            >
              ({totalReviews} đánh giá)
            </span>
          </div>

          <div className="price-section">
            <span className="current-price">{formatPrice(product.price)}</span>
          </div>

          <div className={`stock-status ${stockAvailable ? 'in-stock' : 'out-of-stock'}`}>
            <FaCheck /> {stockAvailable ? `Còn hàng (${product.stockQuantity})` : "Hết hàng"}
          </div>

          <div className="actions-row">
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity === 1 || !stockAvailable}>-</button>
              <input type="text" readOnly value={quantity} />
              <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stockQuantity || !stockAvailable}>+</button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!stockAvailable}
            >
              <FaShoppingCart /> Thêm vào giỏ hàng
            </button>

            <button className="wishlist-btn">
              <FaHeart />
            </button>
          </div>

          {/* KHU VỰC CAM KẾT VÀ KHUYẾN MÃI */}
          <div className="product-commitment">
            <h4>Cam kết & Ưu đãi</h4>
            <div className="commitment-item">
              <FaShippingFast className="commit-icon" />
              <span>Giao hàng miễn phí toàn quốc (Đơn lớn hơn 10 Triệu VND)</span>
            </div>
            <div className="commitment-item">
              <FaShieldAlt className="commit-icon" />
              <span>Bảo hành chính hãng 12 tháng, 1 đổi 1 trong 7 ngày.</span>
            </div>
            <div className="commitment-item promo">
              <FaGift className="commit-icon" />
              <span>**Tặng kèm phụ kiện & Voucher giảm 10% cho lần mua tiếp theo.**</span>
            </div>
          </div>
          {/* KẾT THÚC KHU VỰC CAM KẾT */}

          {/* KHU VỰC MÔ TẢ TÓM TẮT */}
          <div className="product-summary">
            <h4>Mô tả sản phẩm</h4>
            <p>{product.description || "Đang cập nhật mô tả chi tiết từ nhà sản xuất."}</p>
          </div>

          {/* KHU VỰC HỖ TRỢ & THANH TOÁN */}
          <div className="payment-support-info">
            <h4>Hỗ trợ & Thanh toán</h4>
            <div className="support-item">
              <FaCreditCard className="support-icon" />
              <span>Hỗ trợ trả góp 0% qua thẻ tín dụng (Visa/MasterCard).</span>
            </div>
            <div className="support-item">
              <FaHeadset className="support-icon" />
              <span>Tư vấn kỹ thuật 24/7 (Hotline: 1900-6789).</span>
            </div>
          </div>
          {/* KẾT THÚC KHU VỰC HỖ TRỢ & THANH TOÁN */}

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
            {/* SỬA LỖI PROPERTY NAME cho Thông số kỹ thuật */}
            {product.productAttributes?.map((attr, i) => (
              <tr key={i}>
                <td>{attr.attributeName}</td>
                <td>{attr.attributeValue}</td>
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
            {reviews.slice(0, 3).map((rev, index) => (
              <div key={index} className="review-card">
                <strong>{rev.userName || "Người dùng ẩn danh"}</strong>
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

      {/* =======================================
         KHU VỰC SẢN PHẨM TƯƠNG TỰ
         ======================================= */}
      <div className="related-products-section">
        <h2>Sản phẩm tương tự</h2>
        <div className="related-products-grid">
          {relatedProducts.length > 0 ? (
            relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} onSelect={() => navigate(`/products/${relatedProduct.id}`)} />
            ))
          ) : (
            <p className="no-related-products">Không tìm thấy sản phẩm liên quan trong danh mục này.</p>
          )}
        </div>
      </div>
      {/* KẾT THÚC KHU VỰC SẢN PHẨM TƯƠNG TỰ */}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {showVideo && (
        <div className="video-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-popup" onClick={(e) => e.stopPropagation()}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${getVideoId(videoUrl)}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;