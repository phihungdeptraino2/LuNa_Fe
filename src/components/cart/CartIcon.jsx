import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const CartIcon = () => {
  const { totalQuantity } = useCart();

  return (
    <Link to="/cart" className="cart-icon">
      <FaShoppingCart />
      {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
    </Link>
  );
};

export default CartIcon;
