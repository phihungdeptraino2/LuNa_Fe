import React from "react";
import "../../pages/home/HomePage.css";

const CategoriesList = ({ CATEGORY_LIST }) => (
  <section className="categories-list-section">
    <h2 className="cat-section-title">Our Categories</h2>
    <div className="categories-grid-container">
      {CATEGORY_LIST.map((cat, index) => (
        <div key={index} className="category-list-item">
          <div className="cat-img-wrapper">
            <img src={cat.img || "/path/to/no-image.png"} alt={cat.name} />
          </div>
          <span className="cat-name">{cat.name}</span>
        </div>
      ))}
    </div>
  </section>
);

export default CategoriesList;
