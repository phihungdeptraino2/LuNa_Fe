"use client"
import React, { useState } from "react"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"
import CartItem from "../../components/cart/CartItem"
import { useAuth } from "../../context/AuthContext"
import LoginModal from "../../components/LoginModal"
import RegisterModal from "../../components/RegisterModal" // *** ĐẢM BẢO IMPORT NÀY CÓ TỒN TẠI ***
import "./CartPage.css"

const CartPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  // Lấy user từ Auth Context
  const { user } = useAuth()

  // State quản lý hiển thị Modal Login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // State quản lý hiển thị Modal Register
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  // Hàm xử lý sự kiện Thanh toán
  const handleCheckout = () => {
    if (user) {
      // Đã đăng nhập
      navigate("/checkout")
    } else {
      // Chưa đăng nhập: Mở modal login
      setIsLoginModalOpen(true)
      setIsRegisterModalOpen(false)
    }
  }

  // Hàm mở Modal Register (được truyền vào LoginModal)
  const handleOpenRegister = () => {
    setIsLoginModalOpen(false) // Đóng Login
    setIsRegisterModalOpen(true) // Mở Register
  }

  // Hàm quay lại Modal Login (được truyền vào RegisterModal)
  const handleBackToLogin = () => {
    setIsRegisterModalOpen(false) // Đóng Register
    setIsLoginModalOpen(true) // Mở Login
  }


  // Nếu giỏ hàng rỗng
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Giỏ hàng trống</h2>
        <p>Hãy thêm sản phẩm để tiếp tục mua sắm!</p>
        <button className="btn-checkout" onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
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
          {/* Đã chỉnh lại lớp nút để trông giống nút Thanh toán hơn */}
          <button className="btn-clear btn-checkout-like" onClick={clearCart}>
            Xóa tất cả
          </button>

          <button className="btn-checkout" onClick={handleCheckout}>
            Thanh toán
          </button>
        </div>
      </div>

      {/* Render Modal Login */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onOpenRegister={handleOpenRegister} // Truyền hàm mở Register
        />
      )}

      {/* Render Modal Register */}
      {isRegisterModalOpen && (
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onBackToLogin={handleBackToLogin} // Truyền hàm quay lại Login
        />
      )}
    </div>
  )
}

export default CartPage