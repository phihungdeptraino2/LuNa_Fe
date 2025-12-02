import React from "react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  const BE_HOST = "http://localhost:8081";

  // Lấy sản phẩm từ item (đảm bảo với cả user chưa login)
  const product = item.product || item;

  // tìm ảnh default giống ProductCard
  const defaultImage =
    product.productImages?.find(img => img.default)?.imageUrl || "";

  // Ghép URL giống ProductCard
  const imageSrc = defaultImage
    ? `${BE_HOST}${defaultImage.startsWith("/") ? defaultImage : `/${defaultImage}`}`
    : "";

  const price = product.price ?? 0; // fallback 0 nếu undefined

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
          {price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <p>Số lượng: {item.quantity}</p>
      </div>

      <button
        className="remove-btn"
        onClick={() => removeFromCart(product.id)}
      >
        Xóa
      </button>
    </div>
  );
};

export default CartItem;
