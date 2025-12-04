"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import "./OrderReviewPage.css"

const OrderReviewPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clearCart } = useCart()

  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState(null)

  const order = location.state?.order
  const selectedAddress = location.state?.selectedAddress

  if (!order) {
    return (
      <div className="order-review-empty">
        <h2>Không tìm thấy thông tin đơn hàng</h2>
        <button onClick={() => navigate("/checkout")}>Quay lại Checkout</button>
      </div>
    )
  }

  const handleConfirmOrder = async () => {
    try {
      setIsConfirming(true)

      // Order is already created in CheckoutPage
      // Just clear cart and navigate to success
      clearCart()
      navigate("/order-success", { state: { order: order } })
    } catch (err) {
      console.error("Error:", err)
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="order-review-container">
      <h1>Xác nhận đơn hàng</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="order-review-content">
        {/* Left Side - Order Info */}
        <div className="order-review-left">
          {/* Customer Info */}
          <div className="section">
            <h2>Thông tin khách hàng</h2>
            <div className="info-item">
              <span>Tên:</span>
              <strong>{order.user?.fullName || "N/A"}</strong>
            </div>
            <div className="info-item">
              <span>Email:</span>
              <strong>{order.user?.email || "N/A"}</strong>
            </div>
            <div className="info-item">
              <span>Số điện thoại:</span>
              <strong>{order.user?.phone || "N/A"}</strong>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="section">
            <h2>Địa chỉ giao hàng</h2>
            <div className="address-box">
              <p>{order.address?.street}</p>
              <p>
                {order.address?.district}, {order.address?.province}
              </p>
              <p>{order.address?.city}</p>
            </div>
          </div>

          {/* Order Date */}
          <div className="section">
            <h2>Ngày đặt hàng</h2>
            <p>{new Date(order.orderDate).toLocaleString("vi-VN")}</p>
          </div>

          {/* Order Status */}
          <div className="section">
            <h2>Trạng thái đơn hàng</h2>
            <p className="status-badge">{order.status}</p>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="order-review-right">
          <div className="order-summary">
            <h2>Tóm tắt đơn hàng (Đơn hàng #{order.id})</h2>

            {/* Items List */}
            <div className="summary-items">
              {order.items?.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="item-info">
                    <div className="item-details">
                      <p className="item-name">{item.productName}</p>
                      <p className="item-quantity">Số lượng: {item.quantity}</p>
                      <p className="item-price-unit">
                        {(item.price || 0).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}{" "}
                        / sản phẩm
                      </p>
                    </div>
                  </div>
                  <p className="item-total">
                    {(item.quantity * (item.price || 0)).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="summary-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>
                  {(order.subtotal || 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="total-row">
                <span>Thuế:</span>
                <span>
                  {(order.tax || 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>
                  {(order.shippingFee || 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="total-row total-final">
                <span>Tổng cộng:</span>
                <span>
                  {(order.total || 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-confirm" onClick={handleConfirmOrder} disabled={isConfirming}>
                {isConfirming ? "Đang xác nhận..." : "Xác nhận đơn hàng"}
              </button>
              <button className="btn-cancel" onClick={() => navigate("/checkout")} disabled={isConfirming}>
                Quay lại Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderReviewPage
