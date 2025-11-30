import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../services/productService";
import "./ProductDetailPage.css";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaCheck,
  FaTruck,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  // Dummy data phòng khi API lỗi
  const DUMMY_DETAIL = {
    id,
    name: "Fender Player Stratocaster",
    price: 849.99,
    description:
      "Guitar điện biểu tượng, cần Maple, cấu hình pickup SSS kinh điển.",
    stockQuantity: 20,
    category: { name: "Electric Guitar (Guitar Điện)" },
    brand: { name: "Fender" },
    productImages: [
      {
        imageUrl:
          "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/432093.jpg",
      },
      {
        imageUrl:
          "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/432093_2.jpg",
      },
      {
        imageUrl:
          "https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/prod/432093_3.jpg",
      },
    ],
    productAttributes: [
      { attribute: { name: "Màu sắc" }, value: "3-Color Sunburst" },
      { attribute: { name: "Chất liệu thân" }, value: "Alder" },
      { attribute: { name: "Số dây/Số phím" }, value: "6 dây" },
      { attribute: { name: "Xuất xứ" }, value: "Mexico" },
    ],
    reviews: [
      {
        id: 1,
        reviewText: "Cây đàn tuyệt vời, đúng chất Fender!",
        rating: 5,
        userName: "Nguyễn Văn A",
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
          if (data.productImages && data.productImages.length > 0) {
            setMainImage(data.productImages[0].imageUrl);
          }
        } else {
          setProduct(DUMMY_DETAIL);
          setMainImage(DUMMY_DETAIL.productImages[0].imageUrl);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        setProduct(DUMMY_DETAIL);
        setMainImage(DUMMY_DETAIL.productImages[0].imageUrl);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return <div className="loading">Đang tải chi tiết sản phẩm...</div>;
  if (!product)
    return <div className="loading">Sản phẩm không tồn tại</div>;

  const handleQuantityChange = (amount) => {
    const newQty = quantity + amount;
    if (newQty >= 1 && newQty <= product.stockQuantity) setQuantity(newQty);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="product-detail-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span>/</span>
        <Link to="#">{product.category?.name || "Sản phẩm"}</Link> <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-main-section">
        {/* LEFT COLUMN: IMAGE */}
        <div className="left-column">
          <div className="main-image-wrapper">
            <img
              src={mainImage || "https://via.placeholder.com/500"}
              alt={product.name}
            />
          </div>
          <div className="thumbnail-list">
            {product.productImages.map((img, index) => (
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

        {/* RIGHT COLUMN: INFO */}
        <div className="right-column">
          <h1>{product.name}</h1>

          {/* Rating & Reviews */}
          <div className="rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < (product.reviews[0]?.rating || 0) ? "#FFD700" : "#ccc"} />
              ))}
            </div>
            <span className="review-count">
              ({product.reviews.length} đánh giá)
            </span>
            <span className="product-code">Mã SP: {product.id}</span>
          </div>

          {/* Price */}
          <div className="price-section">
            <span className="current-price">{formatPrice(product.price)}</span>
            <span className="vat-text">Đã bao gồm VAT & Phí vận chuyển</span>
          </div>

          {/* Stock */}
          <div className="stock-status">
            <FaCheck /> Còn hàng ({product.stockQuantity})
          </div>

          {/* Quantity & Actions */}
          <div className="actions-row">
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <input type="text" readOnly value={quantity} />
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={() => alert(`Đã thêm ${quantity} sản phẩm vào giỏ!`)}
            >
              <FaShoppingCart /> Thêm vào giỏ hàng
            </button>

            <button className="wishlist-btn">
              <FaHeart /> Yêu thích
            </button>
          </div>

          {/* Trust Info */}
          <div className="product-trust">
            <div>
              <FaTruck /> Miễn phí vận chuyển toàn quốc
            </div>
            <div>
              <FaShieldAlt /> Bảo hành chính hãng 3 năm
            </div>
            <div>
              <FaUndo /> Đổi trả trong vòng 30 ngày
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Attributes & Description & Reviews */}
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
            {product.productAttributes.map((attr, i) => (
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
        {product.reviews.map((rev) => (
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
