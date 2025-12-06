"use client"

import { useState, useEffect } from "react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "./CheckoutPage.css"

const CheckoutPage = () => {
  const { cartItems, totalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    district: "",
    province: "",
    isDefault: false,
  })

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchUserAddresses()
  }, [user, navigate])

  const fetchUserAddresses = async () => {
    if (!user || !user.id) return
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const userId = user?.id

      console.log("[v0] Fetching addresses for user:", userId)

      const response = await fetch(`http://localhost:8081/api/users/${userId}/addresses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Không thể lấy địa chỉ")
      }

      const data = await response.json()
      console.log("[v0] Addresses data:", data.data)

      setAddresses(data.data || [])

      if (data.data && data.data.length > 0) {
        const defaultAddr = data.data.find((addr) => addr.isDefault)
        setSelectedAddress(defaultAddr || data.data[0])
      }

      setError(null)
    } catch (err) {
      console.error("Error fetching addresses:", err)
      setError("Không thể tải địa chỉ. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const userId = user?.id || 2

      const requestBody = {
        street: formData.street,
        city: formData.city,
        district: formData.district,
        province: formData.province,
        isDefault: formData.isDefault,
      }

      console.log("[v0] Submitting address:", requestBody)

      const response = await fetch(`http://localhost:8081/api/users/${userId}/addresses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Không thể lưu địa chỉ")
      }

      const newAddress = await response.json()
      console.log("[v0] New address saved:", newAddress.data)

      setAddresses([...addresses, newAddress.data])
      setSelectedAddress(newAddress.data)
      setShowAddressForm(false)

      setFormData({
        street: "",
        city: "",
        district: "",
        province: "",
        isDefault: false,
      })
    } catch (err) {
      console.error("Error saving address:", err)
      setError("Không thể lưu địa chỉ. Vui lòng thử lại.")
    }
  }

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError("Vui lòng chọn hoặc thêm địa chỉ giao hàng")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const userId = user?.id

      const response = await fetch(`http://localhost:8081/api/orders/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddress.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Không thể tạo đơn hàng")
      }

      const data = await response.json()
      console.log("[v0] Order created:", data.data)

      navigate("/order-review", { state: { order: data.data, selectedAddress: selectedAddress } })
    } catch (err) {
      console.error("Error creating order:", err)
      setError("Không thể tạo đơn hàng. Vui lòng thử lại.")
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Giỏ hàng trống</h2>
        <p>Vui lòng thêm sản phẩm trước khi thanh toán</p>
        <button onClick={() => navigate("/cart")}>Quay lại giỏ hàng</button>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1>Thanh toán</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="checkout-content">
        {/* ===== BÊN TRÁI: FORM ĐỊA CHỈ ===== */}
        <div className="checkout-left">
          <div className="address-section">
            <h2>Địa chỉ giao hàng</h2>

            {loading ? (
              <div>Đang tải địa chỉ...</div>
            ) : addresses.length > 0 ? (
              <>
                <div className="addresses-list">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-item ${selectedAddress?.id === addr.id ? "selected" : ""}`}
                      onClick={() => setSelectedAddress(addr)}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => setSelectedAddress(addr)}
                      />
                      <div className="address-details">
                        <p className="address-text">
                          {addr.street}, {addr.district}, {addr.province}
                        </p>
                        {addr.city && <p className="address-city">{addr.city}</p>}
                        {addr.isDefault && <span className="badge-default">Mặc định</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <button className="btn-add-address" onClick={() => setShowAddressForm(!showAddressForm)}>
              {showAddressForm ? "Hủy" : "+ Thêm địa chỉ mới"}
            </button>

            {showAddressForm && (
              <form className="address-form" onSubmit={handleAddressSubmit}>
                <div className="form-group">
                  <label>Địa chỉ chi tiết (số nhà, tên đường) *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: 123 Đường Nguyễn Huệ"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quận/Huyện *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: Quận 1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Thành phố (City) *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: Thành phố Hồ Chí Minh"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tỉnh/Thành phố *</label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: Hồ Chí Minh"
                    required
                  />
                </div>

                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleFormChange}
                    id="isDefault"
                  />
                  <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
                </div>

                <button type="submit" className="btn-save-address">
                  Lưu địa chỉ
                </button>
              </form>
            )}
          </div>

          {/* ===== THÔNG TIN KHÁCH HÀNG ===== */}
          <div className="customer-info">
            <h3>Thông tin khách hàng</h3>
            <p>
              <strong>Tên:</strong> {user?.fullName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {user?.phone || "N/A"}
            </p>
          </div>

          {/* ===== PHƯƠNG THỨC THANH TOÁN ===== */}
          <div className="payment-method">
            <h3>Phương thức thanh toán</h3>
            <div className="payment-options">
              <label>
                <input type="radio" name="payment" value="cod" defaultChecked />
                Thanh toán khi nhận hàng (COD)
              </label>
              <label>
                <input type="radio" name="payment" value="bank" />
                Chuyển khoản ngân hàng
              </label>
              <label>
                <input type="radio" name="payment" value="card" />
                Thẻ tín dụng / Thẻ ghi nợ
              </label>
            </div>
          </div>
        </div>

        {/* ===== BÊN PHẢI: TÓM TẮT ĐƠN HÀNG ===== */}
        <div className="checkout-right">
          <div className="order-summary">
            <h2>Tóm tắt đơn hàng</h2>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.product?.id} className="summary-item">
                  <div className="item-info">
                    <img src={item.product?.imageUrl || "/placeholder.svg"} alt={item.product?.name} />
                    <div className="item-details">
                      <p className="item-name">{item.product?.name}</p>
                      <p className="item-quantity">x{item.quantity}</p>
                    </div>
                  </div>
                  <p className="item-price">
                    {(item.quantity * (item.product?.price || 0)).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>
                  {(0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="total-row">
                <span>Giảm giá:</span>
                <span>
                  {(0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="total-row total-final">
                <span>Tổng cộng:</span>
                <span>
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>

            <button className="btn-checkout" onClick={handleCheckout}>
              Tiếp tục thanh toán
            </button>

            <button className="btn-back" onClick={() => navigate("/cart")}>
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
