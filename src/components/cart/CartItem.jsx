import React from "react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img src={item.productImages?.[0]?.imageUrl} alt={item.name} width={80} />
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>Giá: {item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
        <p>Số lượng: {item.quantity}</p>
      </div>
      <button onClick={() => removeFromCart(item.id)}>Xóa</button>
    </div>
  );
};

export default CartItem;
