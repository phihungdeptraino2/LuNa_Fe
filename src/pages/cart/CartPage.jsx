import React from "react";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import "./CartPage.css"
const CartPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();

  if (cartItems.length === 0)
    return <p>Giỏ hàng trống. Hãy thêm sản phẩm vào giỏ!</p>;

  return (
    <div className="cart-page">
      <h1>Giỏ hàng của bạn</h1>
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
      <h3>Tổng tiền: {totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</h3>
      <button onClick={clearCart}>Xóa tất cả</button>
      <button>Thanh toán</button>
    </div>
  );
};

export default CartPage;
