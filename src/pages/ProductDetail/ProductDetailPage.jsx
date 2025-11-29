import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../services/productService";
import "./ProductDetailPage.css";
// Import icon chính xác từ 'fa'
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

  // Dữ liệu giả phòng khi API lỗi hoặc chưa có dữ liệu
  const DUMMY_DETAIL = {
    id: id,
    name: "Fender Player Stratocaster HSS",
    price: 18500000,
    description:
      "The inspiring sound of a Stratocaster is one of the foundations of Fender. Featuring this classic sound—bell-like high end, punchy mids and robust low end, combined with crystal-clear articulation.",
    stockQuantity: 15,
    category: { name: "Electric Guitar" },
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
      { attribute: { name: "Thân đàn" }, value: "Alder" },
      { attribute: { name: "Cần đàn" }, value: "Maple" },
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
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        Đang tải chi tiết...
      </div>
    );
  if (!product)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        Sản phẩm không tồn tại
      </div>
    );

  const handleQuantityChange = (amount) => {
    const newQty = quantity + amount;
    if (newQty >= 1 && newQty <= product.stockQuantity) {
      setQuantity(newQty);
    }
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
        {/* Dùng ?. để tránh lỗi nếu category null */}
        <Link to="#">{product.category?.name || "Sản phẩm"}</Link>{" "}
        <span>/</span>
        <span style={{ color: "#333" }}>{product.name}</span>
      </div>

      <div className="product-main-section">
        {/* CỘT TRÁI: ẢNH */}
        <div className="left-column">
          <div className="image-gallery">
            <div className="main-image-wrapper">
              <img
                src={mainImage || "https://via.placeholder.com/500"}
                alt={product.name}
              />
            </div>
            <div className="thumbnail-list">
              {product.productImages &&
                product.productImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt="thumb"
                    className={`thumb-img ${
                      mainImage === img.imageUrl ? "active" : ""
                    }`}
                    onClick={() => setMainImage(img.imageUrl)}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className="right-column product-info">
          <h1>{product.name}</h1>

          <div className="rating-row">
            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <span className="review-count">(Xem 12 đánh giá)</span>
            <span style={{ marginLeft: "auto", color: "#888" }}>
              Mã SP: {product.id}
            </span>
          </div>

          <div className="price-section">
            <span className="current-price">{formatPrice(product.price)}</span>
            <span className="vat-text">Đã bao gồm VAT & Phí vận chuyển</span>
          </div>

          <div className="stock-status">
            <FaCheck /> Còn hàng ({product.stockQuantity} sản phẩm)
          </div>

          <div className="actions-row">
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <input
                type="text"
                className="qty-input"
                value={quantity}
                readOnly
              />
              <button
                className="qty-btn"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={() => alert(`Đã thêm ${quantity} sản phẩm vào giỏ!`)}
            >
              <FaShoppingCart /> Thêm vào giỏ hàng
            </button>

            <button className="wishlist-btn" title="Thêm vào yêu thích">
              <FaHeart />
            </button>
          </div>

          <div className="product-trust">
            <div className="trust-row">
              <FaTruck className="icon-check" /> Miễn phí vận chuyển toàn quốc
            </div>
            <div className="trust-row">
              <FaShieldAlt className="icon-check" /> Bảo hành chính hãng 3 năm
            </div>
            <div className="trust-row">
              <FaUndo className="icon-check" /> Đổi trả trong vòng 30 ngày
            </div>
          </div>
        </div>
      </div>

      {/* PHẦN DƯỚI: THÔNG SỐ & MÔ TẢ */}
      <div className="product-bottom-section">
        <h2 className="section-title">Thông số kỹ thuật</h2>

        <table className="specs-table">
          <tbody>
            <tr>
              <td className="specs-key">Thương hiệu</td>
              {/* SỬA LỖI Ở ĐÂY: Thêm ?. vào brand */}
              <td className="specs-val">
                {product.brand?.name || "Đang cập nhật"}
              </td>
            </tr>

            {/* SỬA LỖI Ở ĐÂY: Thêm ?. vào attribute */}
            {product.productAttributes &&
              product.productAttributes.map((attr, index) => (
                <tr key={index}>
                  <td className="specs-key">
                    {attr.attribute?.name || "Thuộc tính"}
                  </td>
                  <td className="specs-val">{attr.value}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <h2 className="section-title">Mô tả sản phẩm</h2>
        <div className="description-content">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
