"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import toast, { Toaster } from "react-hot-toast"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

// Định nghĩa style vintage cho các loại toast
const VINTAGE_STYLE = {
  success: {
    background: '#1a1a1a',
    color: '#fffaf0',
    border: '2px solid #c9b19e',
    fontFamily: 'serif',
  },
  error: {
    background: '#8b0000',
    color: '#fff',
    border: '2px solid #fff',
    fontFamily: 'serif',
  },
  warning: {
    background: '#fffaf0',
    color: '#333',
    border: '2px solid #333',
    fontFamily: 'sans-serif',
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

        toast.success("🎶 Đã Thêm Bản Nhạc! Tiếp tục thưởng thức.", {
          duration: 3000,
          style: VINTAGE_STYLE.success
        })
      } catch (err) {
        console.error(err)
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

      toast("🎫 Vé Tạm Thời. Vui lòng **Đăng Nhập** để đảm bảo đơn hàng không bị thất lạc.", {
        icon: '📝',
        duration: 4000,
        style: VINTAGE_STYLE.warning,
      })
    }
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

        toast('Đã loại bỏ bản nhạc.', {
          duration: 1500,
          icon: '🗑️',
          style: VINTAGE_STYLE.warning
        });

      } catch (err) {
        console.error(err);
        toast.error("Lỗi Xóa Bỏ. Không thể loại bỏ bản nhạc khỏi hệ thống.", {
          duration: 4000,
          style: VINTAGE_STYLE.error
        });
      }
    } else {
      const newCart = cartItems.filter((item) => (item.product?.id || item.id) !== productId);
      setCartItems(newCart);
      sessionStorage.setItem("cart", JSON.stringify(newCart));
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
        // Giữ vòng lặp for để xóa từng item nếu không có API xóa toàn bộ
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
            throw new Error(`Xóa sản phẩm ${productId} thất bại`);
          }
        }

        // Sau khi xóa API thành công → làm sạch state phía client
        setCartItems([]);
        sessionStorage.removeItem("cart");

        toast.success("Giỏ hàng đã được dọn sạch. Buổi hòa nhạc sắp bắt đầu!", {
          duration: 3000,
          style: VINTAGE_STYLE.success
        });

      } catch (err) {
        console.error(err);
        toast.error("Lỗi Dọn Sách. Không thể làm trống giỏ hàng trên hệ thống.", {
          duration: 5000,
          style: VINTAGE_STYLE.error
        });
      }

    } else {
      // Trường hợp user chưa đăng nhập → chỉ xóa local cart
      setCartItems([]);
      sessionStorage.removeItem("cart");
      toast("Đã dọn sạch giỏ tạm thời.", {
        icon: '🧹',
        duration: 3000,
        style: VINTAGE_STYLE.warning
      });
    }
  };

  // =======================================================
  // 🆕 HÀM CẬP NHẬT SỐ LƯỢNG SẢN PHẨM (Đã chuyển từ POST sang PUT)
  // =======================================================
  const updateItemQuantity = async (productId, newQuantity) => {
    const quantity = Math.max(0, newQuantity); // Đảm bảo số lượng không âm

    if (token) {
      // ➡️ Đã Login: Gọi API Cập nhật
      if (quantity === 0) {
        // Nếu số lượng về 0, gọi hàm xóa sản phẩm
        return removeFromCart(productId);
      }

      try {
        // SỬ DỤNG API CẬP NHẬT: Đã đổi method sang PUT
        const res = await fetch(
          `http://localhost:8081/api/cart/update?productId=${productId}&quantity=${quantity}`,
          {
            method: "PUT", // ⬅️ THAY ĐỔI TẠI ĐÂY: Từ POST sang PUT
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const errData = await res.text();
          console.error("Lỗi cập nhật giỏ hàng API:", res.status, errData);
          throw new Error(`Cập nhật số lượng thất bại: ${res.statusText}`);
        }

        const data = await res.json();
        const items = data.data?.items || [];

        // Format và Cập nhật state với dữ liệu giỏ hàng mới trả về từ API
        const updated = items.map((i) => ({
          product: { id: i.productId, name: i.name, price: i.price, imageUrl: i.imageUrl },
          quantity: i.quantity,
        }));

        setCartItems(updated);
        sessionStorage.setItem("cart", JSON.stringify(updated));

        toast.success(`Cập nhật số lượng thành công!`, {
          duration: 1500,
          style: VINTAGE_STYLE.success,
        });

      } catch (err) {
        console.error("Lỗi cập nhật số lượng:", err);
        toast.error("🚨 Lỗi Cập Nhật! Không thể điều chỉnh số lượng.", {
          duration: 4000,
          style: VINTAGE_STYLE.error,
        });
      }

    } else {
      // ➡️ Chưa Login: Cập nhật local storage 
      let newCart;
      if (quantity === 0) {
        newCart = cartItems.filter((item) => (item.product?.id || item.id) !== productId);
      } else {
        newCart = cartItems.map((item) =>
          (item.product?.id || item.id) === productId ? { ...item, quantity: quantity } : item
        );
      }

      setCartItems(newCart);
      sessionStorage.setItem("cart", JSON.stringify(newCart));

      toast('Số lượng tạm thời đã được điều chỉnh.', {
        duration: 1500,
        icon: '🔄',
        style: VINTAGE_STYLE.warning
      });
    }
  };
  // =======================================================


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
        updateItemQuantity, // 👈 Đã thêm hàm mới vào Context
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