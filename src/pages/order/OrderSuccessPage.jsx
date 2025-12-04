"use client"

import { useLocation, useNavigate } from "react-router-dom"
import "./OrderSuccessPage.css"

const OrderSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const order = location.state?.order

  if (!order) {
    return (
      <div className="order-success-empty">
        <h2>Không tìm thấy thông tin đơn hàng</h2>
        <button onClick={() => navigate("/home")}>Quay lại trang chủ</button>
      </div>
    )
  }

  return (
    <div className="order-success-container">
      <div className="success-card">
        {/* Success Icon */}
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1>Đặt hàng thành công!</h1>
        <p className="order-number">
          Mã đơn hàng: <strong>#{order.id}</strong>
        </p>

        {/* Order Summary */}
        <div className="order-info">
          <div className="info-row">
            <span>Ngày đặt hàng:</span>
            <strong>{new Date(order.orderDate).toLocaleString("vi-VN")}</strong>
          </div>
          <div className="info-row">
            <span>Tổng tiền:</span>
            <strong className="amount">
              {(order.total || 0).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </strong>
          </div>
          <div className="info-row">
            <span>Trạng thái:</span>
            <strong className="status">{order.status}</strong>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="shipping-info">
          <h3>Địa chỉ giao hàng</h3>
          <div className="address-details">
            <p>{order.address?.street}</p>
            <p>
              {order.address?.district}, {order.address?.province}
            </p>
            <p>{order.address?.city}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-continue" onClick={() => navigate("/products")}>
            Tiếp tục mua sắm
          </button>
          <button className="btn-home" onClick={() => navigate("/home")}>
            Quay lại trang chủ
          </button>
        </div>

        <p className="info-text">Một email xác nhận đã được gửi đến {order.user?.email}</p>
      </div>
    </div>
  )
}

export default OrderSuccessPage
