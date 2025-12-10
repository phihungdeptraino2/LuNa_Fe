"use client"

import { useState, useEffect } from "react"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "./CheckoutPage.css"

const CheckoutPage = () => {
  // ✨ Đảm bảo lấy clearCart
  const { cartItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const BE_HOST = "http://localhost:8081"

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cod")

  // ✨ BỔ SUNG STATE CHO MODAL XÁC NHẬN
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // orderSnapshot giờ là bản nháp tạm thời (Temporary Draft)
  const [orderSnapshot, setOrderSnapshot] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false) // Trạng thái đang xử lý API POST cuối cùng

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    district: "",
    province: "",
    isDefault: false,
  })

  const buildImageUrl = (url) => {
    if (!url) return "/placeholder.svg"
    if (url.startsWith("http")) return url // Nếu đã là URL đầy đủ
    return `${BE_HOST}${url.startsWith("/") ? url : `/${url}`}`
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);


  // Hàm chuyển đổi giá trị payment method sang tên tiếng Việt
  const getPaymentMethodName = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "bank":
        return "Chuyển khoản ngân hàng";
      case "card":
        return "Thẻ tín dụng / Thẻ ghi nợ";
      default:
        return "Không rõ";
    }
  };

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

  // ✨ CẬP NHẬT LOGIC handleCheckout: CHỈ HIỂN THỊ MODAL
  const handleCheckout = () => {
    if (!selectedAddress) {
      setError("Vui lòng chọn hoặc thêm địa chỉ giao hàng")
      return
    }

    // Reset trạng thái lỗi và xử lý
    setIsProcessing(false);
    setError(null);

    // Tạo bản nháp đơn hàng tạm thời cho Modal (chưa có ID thực từ DB)
    // Giả định Total bằng totalPrice hiện tại trong giỏ hàng
    const draftOrder = {
      id: "TẠM TÍNH",
      total: totalPrice,
      // Thêm các trường cần thiết khác để hiển thị trong Modal (nếu có)
    };

    setOrderSnapshot(draftOrder);
    setShowConfirmModal(true);
  }

  // ✨ BỔ SUNG HÀM XÁC NHẬN CUỐI CÙNG TRONG MODAL: GỌI API & CHUYỂN TRANG
  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      setError("Lỗi: Không tìm thấy địa chỉ giao hàng được chọn.")
      return
    }

    try {
      setIsProcessing(true) // Bắt đầu xử lý (disable các nút)
      setError(null)

      const token = localStorage.getItem("token")
      const userId = user?.id

      // BƯỚC 1: GỌI API TẠO ĐƠN HÀNG VÀ HOÀN TẤT
      const response = await fetch(`http://localhost:8081/api/orders/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: selectedAddress.id,
          paymentMethod: paymentMethod,
        }),
      })

      if (!response.ok) {
        // Thử đọc chi tiết lỗi nếu có
        const errorDetail = await response.text();
        console.error("API Error Response:", errorDetail);
        throw new Error("Không thể tạo đơn hàng. Vui lòng thử lại.");
      }

      const data = await response.json()
      const finalOrder = data.data; // Đơn hàng cuối cùng với ID thật, tổng tiền, v.v.

      // BƯỚC 2: XÓA GIỎ HÀNG (Frontend) VÀ CHUYỂN TRANG
      clearCart()

      // Điều hướng sang trang thành công (Order Success Page)
      navigate("/order-success", {
        state: {
          order: finalOrder, // Dữ liệu đơn hàng cuối cùng
          paymentMethodName: getPaymentMethodName(paymentMethod),
          itemsToDisplay: cartItems, // Truyền snapshot cartItems ban đầu
        }
      })

      // Reset trạng thái (dù navigate đã reset)
      setIsProcessing(false)
      setShowConfirmModal(false)

    } catch (err) {
      console.error("Error creating order:", err)
      setError(`Lỗi: ${err.message}`)
      setIsProcessing(false) // Kết thúc xử lý nếu thất bại
    }
  }

  // Xử lý Hủy Modal (quay lại bước Checkout)
  const handleCancelConfirmation = () => {
    setShowConfirmModal(false);
    setOrderSnapshot(null); // Xóa bản nháp
    setIsProcessing(false);
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
        {/* ===== BÊN TRÁI: FORM ĐỊA CHỈ & THÔNG TIN KHÁCH HÀNG & THANH TOÁN ===== */}
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
                  <input type="text" name="street" value={formData.street} onChange={handleFormChange} placeholder="Ví dụ: 123 Đường Nguyễn Huệ" required />
                </div>
                <div className="form-group">
                  <label>Quận/Huyện *</label>
                  <input type="text" name="district" value={formData.district} onChange={handleFormChange} placeholder="Ví dụ: Quận 1" required />
                </div>
                <div className="form-group">
                  <label>Thành phố (City) *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleFormChange} placeholder="Ví dụ: Thành phố Hồ Chí Minh" required />
                </div>
                <div className="form-group">
                  <label>Tỉnh/Thành phố *</label>
                  <input type="text" name="province" value={formData.province} onChange={handleFormChange} placeholder="Ví dụ: Hồ Chí Minh" required />
                </div>
                <div className="form-group checkbox">
                  <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleFormChange} id="isDefault" />
                  <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
                </div>
                <button type="submit" className="btn-save-address">
                  Lưu địa chỉ
                </button>
              </form>
            )}
          </div>

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

          <div className="payment-method">
            <h3>Phương thức thanh toán</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Thanh toán khi nhận hàng (COD)
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Chuyển khoản ngân hàng
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
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
                    <img
                      src={buildImageUrl(item.product?.imageUrl)}
                      alt={item.product?.name}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                    <div className="item-details">
                      <p className="item-name">{item.product?.name}</p>
                      <p className="item-quantity">x{item.quantity}</p>
                    </div>
                  </div>
                  <p className="item-price">
                    {(item.quantity * (item.product?.price || 0)).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>{formatPrice(totalPrice * 0.05)}</span>
              </div>
              <div className="total-row">
                <span>Thuế:</span>
                <span>{formatPrice(totalPrice * 0.05)}</span>
              </div>
              <div className="total-row total-final">
                <span>Tổng cộng:</span>
                <span>{formatPrice(totalPrice + totalPrice*0.1)}</span>
              </div>
            </div>

            <button
              className="btn-checkout"
              onClick={handleCheckout}
              // Vô hiệu hóa nút ngoài khi đang xử lý API cuối cùng hoặc chưa chọn địa chỉ
              disabled={isProcessing || !selectedAddress}
            >
              {isProcessing ? "Đang xử lý..." : "Tiếp tục thanh toán"}
            </button>

            <button className="btn-back" onClick={() => navigate("/cart")}>
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODAL XÁC NHẬN ĐƠN HÀNG MỚI ===== */}
      {showConfirmModal && orderSnapshot && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác nhận Đơn hàng (Tạm tính)</h2>
            <p className="modal-message">
              Bạn đã chọn: <strong>{getPaymentMethodName(paymentMethod)}</strong>
            </p>
            <div className="modal-summary">
              <div className="total-row">
                <span>Địa chỉ giao hàng:</span>
                <strong>{selectedAddress?.street}, {selectedAddress?.district}, {selectedAddress?.province}</strong>
              </div>
              <div className="total-row total-final">
                <span>Tổng cộng:</span>
                <strong className="final-price">{formatPrice(orderSnapshot.total + orderSnapshot.total*0.1)}</strong>
              </div>
            </div>
            <p className="modal-note">
              **Bấm "Xác nhận" để hoàn tất đơn hàng và tiến hành thanh toán.**
            </p>
            <div className="modal-actions">
              <button
                className="btn-confirm-modal"
                onClick={handleConfirmOrder}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang gửi đơn..." : "Xác nhận và Đặt hàng"}
              </button>
              <button
                className="btn-cancel-modal"
                onClick={handleCancelConfirmation}
                disabled={isProcessing}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage