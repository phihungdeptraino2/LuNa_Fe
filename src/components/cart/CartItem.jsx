import React from "react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  const BE_HOST = "http://localhost:8081";

  // Lấy sản phẩm từ item (hỗ trợ cả user chưa login)
  const product = item.product || item;

  // Lấy ảnh: ưu tiên productImages.default, nếu không có dùng imageUrl trực tiếp
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
