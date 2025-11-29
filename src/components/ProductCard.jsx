// src/components/ProductCard.jsx
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Stock:</strong> {product.stockQuantity}</p>
      <p><strong>Brand:</strong> {product.brand.name}</p>
      <p><strong>Category:</strong> {product.category.name}</p>

      {product.productAttributes.length > 0 && (
        <div>
          <strong>Attributes:</strong>
          <ul>
            {product.productAttributes.map(attr => (
              <li key={attr.id}>
                {attr.attributeName}: {attr.attributeValue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
