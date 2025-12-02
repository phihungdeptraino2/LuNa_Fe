import React from "react";
import "./ProductCard.css"

const ProductCard = ({ product, onSelect }) => {
  const defaultImage = product.productImages.find(img => img.default)?.imageUrl || "";

  const BE_HOST = "http://localhost:8081";

const imageSrc = defaultImage
  ? `${BE_HOST}${defaultImage.startsWith("/") ? defaultImage : `/${defaultImage}`}`
  : "";

  return (
    <div 
      className="product-card"
      onClick={() => onSelect && onSelect(product)} 
      style={{ cursor: "pointer" }}
    >
      <div className="card-img-container">
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} className="card-img" />
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
};

export default ProductCard;
