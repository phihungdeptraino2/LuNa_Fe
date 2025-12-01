import React, { useEffect, useState } from "react";
import { getProductById } from "../../services/productService";
import "./ProductDetailPage.css";
import { FaStar, FaShoppingCart, FaHeart, FaCheck } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();          // Lấy id từ URL
  const navigate = useNavigate();      // Dùng để quay lại
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setMainImage(data.productImages?.[0]?.imageUrl || "");
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
          <div className="main-image-wrapper">
            {mainImage ? <img src={mainImage} alt={product.name} /> : <div className="no-image">No Image</div>}
          </div>
          <div className="thumbnail-list">
            {product.productImages?.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl}
                alt="thumb"
                className={mainImage === img.imageUrl ? "active" : ""}
                onClick={() => setMainImage(img.imageUrl)}
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
            <span className="review-count">({product.reviews?.length || 0} đánh giá)</span>
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

            <button className="add-to-cart-btn" onClick={() => alert(`Đã thêm ${quantity} sản phẩm vào giỏ!`)}>
              <FaShoppingCart /> Thêm vào giỏ hàng
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
        {product.reviews?.map((rev) => (
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
        ))}
      </div>
    </div>
  );
};

export default ProductDetailPage;
