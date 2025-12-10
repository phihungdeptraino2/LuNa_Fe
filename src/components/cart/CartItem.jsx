// File: ../../components/cart/CartItem.js

import React from "react";
import { useCart } from "../../context/CartContext";
import "./CartItem.css"

const CartItem = ({ item }) => {
  // 🆕 Destructure thêm updateItemQuantity
  const { removeFromCart, updateItemQuantity } = useCart();

  const BE_HOST = "http://localhost:8081";

  // Lấy sản phẩm và ID
  const product = item.product || item;
  const productId = product.id;
  const currentQuantity = item.quantity;

  // Lấy ảnh: (Giữ nguyên logic)
  let imageSrc = "";
  if (product.productImages?.length > 0) {
    const defaultImg = product.productImages.find(img => img.default);
    if (defaultImg) {
      imageSrc = `${BE_HOST}${defaultImg.imageUrl.startsWith("/") ? defaultImg.imageUrl : `/${defaultImg.imageUrl}`}`;
    }
  } else if (product.imageUrl) {
    imageSrc = `${BE_HOST}${product.imageUrl.startsWith("/") ? product.imageUrl : `/${product.imageUrl}`}`;
  }

  const price = product.price ?? 0;

  // Xử lý tăng/giảm số lượng
  const handleQuantityChange = (delta) => {
    const newQuantity = currentQuantity + delta;
    // Gọi hàm cập nhật từ CartContext
    updateItemQuantity(productId, newQuantity);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-img">
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} width={80} />
        ) : (
          <div className="cart-img-placeholder">No Image</div>
        )}
      </div>

      <div className="cart-item-info">
        <h4>{product.name}</h4>
        <p>
          Giá:{" "}
          {price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        {/* 🆕 BỘ ĐIỀU KHIỂN SỐ LƯỢNG MỚI */}
        <div className="quantity-control">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={currentQuantity <= 1}
          >
            -
          </button>
          <span className="current-quantity">{currentQuantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>

      <button
        className="remove-btn"
        onClick={() => removeFromCart(productId)}
      >
        Xóa
      </button>
    </div>
  );
};

export default CartItem;