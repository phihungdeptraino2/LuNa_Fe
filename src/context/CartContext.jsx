import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  //Load giỏ hàng từ sessionStorage khi mở tab
  const [cartItems, setCartItems] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  //Mỗi lần cartItems thay đổi -> lưu lại vào sessionStorage
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };
  const clearCart = () => setCartItems([]);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalTypes = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalQuantity,
        totalPrice,
        totalTypes
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
