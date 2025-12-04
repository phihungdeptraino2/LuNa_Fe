"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext" // AuthContext có user sau login

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const { user } = useAuth() // user có token nếu đã login

  // Lấy token đúng từ user
  const token = user?.token // <-- sửa token ở đây

  // Load giỏ hàng từ sessionStorage khi mở tab
  const [cartItems, setCartItems] = useState(() => {
    const stored = sessionStorage.getItem("cart")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    if (token) {
      loadCartFromDB()
    } else {
      // Nếu chưa login, dùng sessionStorage
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

  // Mỗi lần cartItems thay đổi -> lưu lại vào sessionStorage
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
            // "Content-Type": "application/json", // Không cần nữa
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

        alert("Đã thêm sản phẩm vào giỏ hàng!")
      } catch (err) {
        console.error(err)
        alert("Lỗi khi thêm vào giỏ hàng")
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
      alert("Bạn chưa đăng nhập, sản phẩm được lưu tạm vào giỏ!")
    }

    console.log("User in addToCart:", user)
    console.log("Token:", user?.token)
  }

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = async (productId) => {
    if (token) {
      try {
        const res = await fetch(`http://localhost:8081/api/cart/remove/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Xóa sản phẩm thất bại")

        const data = await res.json()
        if (data.items) {
          setCartItems(
            data.items.map((i) => ({
              product: i.product,
              quantity: i.quantity,
            })),
          )
          sessionStorage.setItem("cart", JSON.stringify(data.items))
        }
      } catch (err) {
        console.error(err)
        alert("Lỗi khi xóa sản phẩm")
      }
    } else {
      const newCart = cartItems.filter((item) => item.product?.id !== productId)
      setCartItems(newCart)
      sessionStorage.setItem("cart", JSON.stringify(newCart))
    }
  }

  // Xóa toàn bộ giỏ
  const clearCart = async () => {
    if (token) {
      try {
        const res = await fetch(`http://localhost:8081/api/cart/clear`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Xóa giỏ hàng thất bại")

        setCartItems([])
        sessionStorage.removeItem("cart")
      } catch (err) {
        console.error(err)
        alert("Lỗi khi xóa giỏ hàng")
      }
    } else {
      setCartItems([])
      sessionStorage.removeItem("cart")
    }
  }

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
    </CartContext.Provider>
  )
}
