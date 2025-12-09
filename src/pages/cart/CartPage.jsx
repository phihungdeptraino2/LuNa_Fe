"use client"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"
import CartItem from "../../components/cart/CartItem"
import "./CartPage.css"

const CartPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  // === Debug dữ liệu giỏ hàng ===
  console.log("cartItems:", cartItems)

  // Nếu giỏ hàng rỗng
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Giỏ hàng trống</h2>
        <p>Hãy thêm sản phẩm để tiếp tục mua sắm!</p>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Giỏ hàng của bạn</h1>

      <div className="cart-items-list">
        {cartItems.map((item, index) => (
          <CartItem
            key={item.product?.id || item.id || index}
            item={item}
          />
        ))}
      </div>

      <div className="cart-summary">
        <h3>
          Tổng tiền:{" "}
          <span className="total-price">
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </h3>

        <div className="cart-actions">
          <button className="btn-clear" onClick={clearCart}>
            Xóa tất cả
          </button>

          <button className="btn-checkout" onClick={() => navigate("/checkout")}>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
