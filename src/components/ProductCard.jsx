import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onSelect }) => (
    <div 
      className="product-card"
      onClick={() => onSelect && onSelect(product)} 
      style={{ cursor: "pointer" }}>
      <div className="card-img-container">
        {product.productImages.length > 0 ? (
          <img src={product.productImages[0]} alt={product.name} className="card-img" />
        ) : (
          <div className="card-img-placeholder">No Image</div>
        )}
      </div>

      <div className="card-info">
        <h5>{product.name}</h5>
        <p className="price">${product.price.toFixed(2)}</p>
      </div>
    </div>
);

export default ProductCard;
