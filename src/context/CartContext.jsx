"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import toast, { Toaster } from "react-hot-toast" // 👈 Đã thêm import

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

// Định nghĩa style vintage cho các loại toast
const VINTAGE_STYLE = {
  success: {
    background: '#1a1a1a', // Đen tối
    color: '#fffaf0', // Trắng ngà
    border: '2px solid #c9b19e', // Viền sepia
    fontFamily: 'serif',
  },
  error: {
    background: '#8b0000', // Đỏ đậm
    color: '#fff',
    border: '2px solid #fff',
    fontFamily: 'serif',
  },
  warning: {
    background: '#fffaf0', // Trắng ngà
    color: '#333',
    border: '2px solid #333',
    fontFamily: 'sans-serif', // Cho dễ đọc hơn
  },
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const token = user?.token

  const [cartItems, setCartItems] = useState(() => {
    const stored = sessionStorage.getItem("cart")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    if (token) {
      loadCartFromDB()
    } else {
      const stored = sessionStorage.getItem("cart")
      if (stored) {
        setCartItems(JSON.parse(stored))
      }
    }
  }, [token])

  const loadCartFromDB = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        console.error("Lỗi khi load giỏ hàng:", res.status)
        return
      }

      const data = await res.json()
      console.log("[v0] Cart loaded from DB:", data)

      if (data.data?.items) {
        const formattedCart = data.data.items.map((i) => ({
          product: {
            id: i.productId,
            name: i.name,
            price: i.price,
            imageUrl: i.imageUrl,
          },
          quantity: i.quantity,
        }))
        setCartItems(formattedCart)
        sessionStorage.setItem("cart", JSON.stringify(formattedCart))
      }
    } catch (err) {
      console.error("Lỗi load giỏ hàng:", err)
    }
  }

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Thêm sản phẩm vào giỏ
  const addToCart = async (product, quantity = 1) => {
    if (token) {
      try {
        const res = await fetch(`http://localhost:8081/api/cart/add?productId=${product.id}&quantity=${quantity}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const errData = await res.text()
          console.error("Thêm giỏ lỗi:", res.status, errData)
          throw new Error("Thêm vào giỏ hàng thất bại")
        }

        const data = await res.json()

        if (data.data?.items) {
          setCartItems(
            data.data.items.map((i) => ({
              product: {
                id: i.productId,
                name: i.name,
                price: i.price,
                imageUrl: i.imageUrl,
              },
              quantity: i.quantity,
            })),
          )
          sessionStorage.setItem("cart", JSON.stringify(data.data.items))
        }

        // ✅ THAY THẾ alert() THÀNH CÔNG
        toast.success("🎶 Đã Thêm Bản Nhạc! Tiếp tục thưởng thức.", {
          duration: 3000,
          style: VINTAGE_STYLE.success
        })
      } catch (err) {
        console.error(err)
        // ❌ THAY THẾ alert() THẤT BẠI
        toast.error("🚨 Đứt Dây Đàn! Lỗi khi thêm vào giỏ hàng. Xin thử lại.", {
          duration: 5000,
          style: VINTAGE_STYLE.error
        })
      }
    } else {
      // Chưa login → lưu vào sessionStorage
      const exist = cartItems.find((item) => item.product?.id === product.id)
      let newCart
      if (exist) {
        newCart = cartItems.map((item) =>
          item.product?.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        newCart = [...cartItems, { product, quantity }]
      }
      setCartItems(newCart)
      sessionStorage.setItem("cart", JSON.stringify(newCart))

      // ⚠️ THAY THẾ alert() CHƯA LOGIN
      toast("🎫 Vé Tạm Thời. Vui lòng **Đăng Nhập** để đảm bảo đơn hàng không bị thất lạc.", {
        icon: '📝',
        duration: 4000,
        style: VINTAGE_STYLE.warning,
      })
    }

    console.log("User in addToCart:", user)
    console.log("Token:", user?.token)
  }

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = async (productId) => {
    if (token) {
      try {
        const res = await fetch(
          `http://localhost:8081/api/cart/remove?productId=${productId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

        const data = await res.json();

        const items = data.data?.items || [];

        const updated = items.map((i) => ({
          product: {
            id: i.productId,
            name: i.name,
            price: i.price,
            imageUrl: i.imageUrl,
          },
          quantity: i.quantity,
        }));

        setCartItems(updated);
        sessionStorage.setItem("cart", JSON.stringify(updated));

        // ✅ THAY THẾ alert() XÓA THÀNH CÔNG (Có thể bỏ qua hoặc dùng toast nhỏ)
        toast('Đã loại bỏ bản nhạc.', {
          duration: 1500,
          icon: '🗑️',
          style: VINTAGE_STYLE.warning
        });

      } catch (err) {
        console.error(err);
        // ❌ THAY THẾ alert() LỖI XÓA
        toast.error("Lỗi Xóa Bỏ. Không thể loại bỏ bản nhạc khỏi hệ thống.", {
          duration: 4000,
          style: VINTAGE_STYLE.error
        });
      }
    } else {
      const newCart = cartItems.filter((item) => item.product?.id !== productId);
      setCartItems(newCart);
      sessionStorage.setItem("cart", JSON.stringify(newCart));
      // ✅ THAY THẾ alert() XÓA LOCAL
      toast('Đã loại bỏ bản nhạc tạm thời.', {
        duration: 1500,
        icon: '🗑️',
        style: VINTAGE_STYLE.warning
      });
    }
  };


  // Xóa toàn bộ giỏ
  const clearCart = async () => {
    if (token) {
      try {
        // Cần cập nhật backend API để có thể xóa toàn bộ chỉ bằng 1 request
        // Hiện tại, ta sẽ giữ vòng lặp for cho đến khi bạn sửa API
        for (const item of cartItems) {
          const productId = item.product?.id;

          if (!productId) continue;

          const res = await fetch(
            `http://localhost:8081/api/cart/remove?productId=${productId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            // Nếu có lỗi, ta sẽ ném lỗi và thoát vòng lặp
            throw new Error(`Xóa sản phẩm ${productId} thất bại`);
          }
        }

        // Sau khi xóa API thành công → làm sạch state phía client
        setCartItems([]);
        sessionStorage.removeItem("cart");

        // ✅ THAY THẾ alert() CLEAR THÀNH CÔNG
        toast.success("Giỏ hàng đã được dọn sạch. Buổi hòa nhạc sắp bắt đầu!", {
          duration: 3000,
          style: VINTAGE_STYLE.success
        });

      } catch (err) {
        console.error(err);
        // ❌ THAY THẾ alert() LỖI CLEAR
        toast.error("Lỗi Dọn Sách. Không thể làm trống giỏ hàng trên hệ thống.", {
          duration: 5000,
          style: VINTAGE_STYLE.error
        });
      }

    } else {
      // Trường hợp user chưa đăng nhập → chỉ xóa local cart
      setCartItems([]);
      sessionStorage.removeItem("cart");
      // ✅ THAY THẾ alert() CLEAR LOCAL
      toast("Đã dọn sạch giỏ tạm thời.", {
        icon: '🧹',
        duration: 3000,
        style: VINTAGE_STYLE.warning
      });
    }
  };


  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalTypes = cartItems.length
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalQuantity,
        totalPrice,
        totalTypes,
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </CartContext.Provider>
  )
}