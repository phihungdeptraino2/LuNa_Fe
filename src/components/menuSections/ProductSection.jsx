import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import "../../pages/home/HomePage.css";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Filters state
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    color: "",
    material: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const colorAttr = p.productAttributes.find(attr => attr.attributeName === "Màu sắc")?.attributeValue || "";
    const materialAttr = p.productAttributes.find(attr => attr.attributeName === "Chất liệu thân")?.attributeValue || "";
    const price = p.price;

    return (
      (!filters.brand || p.brand.name === filters.brand) &&
      (!filters.category || p.category.name === filters.category) &&
      (!filters.color || colorAttr === filters.color) &&
      (!filters.material || materialAttr === filters.material) &&
      (!filters.minPrice || price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || price <= Number(filters.maxPrice))
    );
  });

  // Pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get unique values for filters
  const brands = [...new Set(products.map(p => p.brand.name))];
  const categories = [...new Set(products.map(p => p.category.name))];
  const colors = [...new Set(products.flatMap(p => p.productAttributes
    .filter(attr => attr.attributeName === "Màu sắc")
    .map(attr => attr.attributeValue)
  ))];
  const materials = [...new Set(products.flatMap(p => p.productAttributes
    .filter(attr => attr.attributeName === "Chất liệu thân")
    .map(attr => attr.attributeValue)
  ))];

  if (loading) return <p style={{ textAlign: "center", margin: "20px" }}>Loading products...</p>;
  if (products.length === 0) return <p style={{ textAlign: "center", margin: "20px" }}>No products available.</p>;

  return (
    <div className="product-section-wrapper">
      {/* Filter Column */}
      <div className="filter-column">
        <h3>Filter Products</h3>

        <div className="filter-group">
          <label>Brand:</label>
          <select value={filters.brand} onChange={e => setFilters({...filters, brand: e.target.value})}>
            <option value="">All</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
            <option value="">All</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Color:</label>
          <select value={filters.color} onChange={e => setFilters({...filters, color: e.target.value})}>
            <option value="">All</option>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Material:</label>
          <select value={filters.material} onChange={e => setFilters({...filters, material: e.target.value})}>
            <option value="">All</option>
            {materials.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Price:</label>
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
        </div>
      </div>

      {/* Product Cards Column */}
      <div className="products-column">
        <div className="products-container">
          {currentProducts.map(product => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx} className={currentPage === idx+1 ? "active-page" : ""} onClick={() => handlePageChange(idx+1)}>{idx+1}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
