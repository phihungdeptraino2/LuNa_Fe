"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { BE_HOST } from "../utils/constants";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Style toast
const VINTAGE_STYLE = {
  success: {
    background: "#1a1a1a",
    color: "#fffaf0",
    border: "2px solid #c9b19e",
    fontFamily: "serif",
  },
  error: {
    background: "#8b0000",
    color: "#fff",
    border: "2px solid #fff",
    fontFamily: "serif",
  },
  warning: {
    background: "#fffaf0",
    color: "#333",
    border: "2px solid #333",
    fontFamily: "sans-serif",
  },
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const token = user?.token;

  const [cartItems, setCartItems] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // Load cart from DB when logged in
  useEffect(() => {
    if (token) {
      loadCartFromDB();
    } else {
      const stored = sessionStorage.getItem("cart");
      if (stored) setCartItems(JSON.parse(stored));
    }
  }, [token]);

  const loadCartFromDB = async () => {
    try {
      const res = await fetch(`${BE_HOST}/api/cart`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return console.error("Lỗi khi load giỏ hàng");

      const data = await res.json();
      if (data.data?.items) {
        const formatted = data.data.items.map((i) => ({
          product: {
            id: i.productId,
            name: i.name,
            price: i.price,
            imageUrl: i.imageUrl,
          },
          quantity: i.quantity,
        }));
        setCartItems(formatted);
        sessionStorage.setItem("cart", JSON.stringify(formatted));
      }
    } catch (e) {
      console.error("Lỗi load giỏ hàng:", e);
    }
  };

  // Sync cart → sessionStorage
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // =======================================================
  // ADD TO CART
  // =======================================================
  const addToCart = async (product, quantity = 1) => {
    if (token) {
      try {
        const res = await fetch(
          `${BE_HOST}/api/cart/add?productId=${product.id}&quantity=${quantity}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Thêm vào giỏ hàng thất bại");
        }

        const data = await res.json();
        if (data.data?.items) {
          const formatted = data.data.items.map((i) => ({
            product: {
              id: i.productId,
              name: i.name,
              price: i.price,
              imageUrl: i.imageUrl,
            },
            quantity: i.quantity,
          }));
          setCartItems(formatted);
          sessionStorage.setItem("cart", JSON.stringify(formatted));
        }

        toast.success("🎶 Đã Thêm Bản Nhạc!", {
          duration: 3000,
          style: VINTAGE_STYLE.success,
        });
      } catch (e) {
        console.error(e);
        toast.error("🚨 Lỗi thêm vào giỏ hàng!", {
          duration: 4000,
          style: VINTAGE_STYLE.error,
        });
      }
    } else {
      // Chưa login → lưu local
      const exist = cartItems.find((i) => i.product?.id === product.id);
      let newCart;
      if (exist) {
        newCart = cartItems.map((i) =>
          i.product?.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newCart = [...cartItems, { product, quantity }];
      }

      setCartItems(newCart);
      sessionStorage.setItem("cart", JSON.stringify(newCart));

      toast("🎫 Vui lòng đăng nhập để lưu giỏ hàng!", {
        icon: "📝",
        duration: 3500,
        style: VINTAGE_STYLE.warning,
      });
    }
  };

  // =======================================================
  // REMOVE FROM CART
  // =======================================================
  const removeFromCart = async (productId) => {
    if (token) {
      try {
        const res = await fetch(
          `${BE_HOST}/api/cart/remove?productId=${productId}`,
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

        toast("🗑️ Đã xóa sản phẩm!", {
          duration: 1500,
          style: VINTAGE_STYLE.warning,
        });
      } catch (e) {
        toast.error("Lỗi khi xóa sản phẩm!", {
          duration: 4000,
          style: VINTAGE_STYLE.error,
        });
      }
    } else {
      // Local cart
      const newCart = cartItems.filter(
        (i) => (i.product?.id || i.id) !== productId
      );
      setCartItems(newCart);
      sessionStorage.setItem("cart", JSON.stringify(newCart));

      toast("🗑️ Đã xóa bản nhạc tạm thời!", {
        duration: 1500,
        style: VINTAGE_STYLE.warning,
      });
    }
  };

  // =======================================================
  // CLEAR CART
  // =======================================================
  const clearCart = async () => {
    if (token) {
      try {
        for (const item of cartItems) {
          const productId = item.product?.id;
          if (!productId) continue;

          await fetch(`${BE_HOST}/api/cart/remove?productId=${productId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        setCartItems([]);
        sessionStorage.removeItem("cart");

        toast.success("Đã dọn sạch giỏ hàng!", {
          duration: 2500,
          style: VINTAGE_STYLE.success,
        });
      } catch (e) {
        toast.error("Không thể dọn sạch giỏ hàng!", {
          duration: 4000,
          style: VINTAGE_STYLE.error,
        });
      }
    } else {
      setCartItems([]);
      sessionStorage.removeItem("cart");
      toast("🧹 Đã dọn giỏ tạm thời!", {
        duration: 2000,
        style: VINTAGE_STYLE.warning,
      });
    }
  };

  // =======================================================
  // UPDATE QUANTITY
  // =======================================================
  const updateItemQuantity = async (productId, newQuantity) => {
    const quantity = Math.max(0, newQuantity);

    if (token) {
      if (quantity === 0) return removeFromCart(productId);

      try {
        const res = await fetch(
          `${BE_HOST}/api/cart/update?productId=${productId}&quantity=${quantity}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Cập nhật số lượng thất bại");

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

        toast.success("Đã cập nhật số lượng!", {
          duration: 1500,
          style: VINTAGE_STYLE.success,
        });
      } catch (e) {
        toast.error("Lỗi cập nhật số lượng!", {
          duration: 3000,
          style: VINTAGE_STYLE.error,
        });
      }
    } else {
      // Update local
      let newCart;

      if (quantity === 0) {
        newCart = cartItems.filter(
          (i) => (i.product?.id || i.id) !== productId
        );
      } else {
        newCart = cartItems.map((i) =>
          (i.product?.id || i.id) === productId
            ? { ...i, quantity }
            : i
        );
      }

      setCartItems(newCart);
      sessionStorage.setItem("cart", JSON.stringify(newCart));

      toast("🔄 Đã cập nhật số lượng tạm!", {
        duration: 1500,
        style: VINTAGE_STYLE.warning,
      });
    }
  };

  // =======================================================
  // TOTALS
  // =======================================================
  const totalQuantity = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalTypes = cartItems.length;
  const totalPrice = cartItems.reduce(
    (s, i) => s + i.quantity * (i.product?.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateItemQuantity,
        totalQuantity,
        totalPrice,
        totalTypes,
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </CartContext.Provider>
  );
};
