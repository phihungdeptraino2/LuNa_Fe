import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // IMPORT useNavigate
import { getAllProducts } from "../../services/productService";
import ProductCard from "../../components/ProductCard";
import "./CategorySection.css";

// Giới hạn số lượng mục hiển thị ban đầu
const MAX_ITEMS_DISPLAY = 10;

export default function CategorySection() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // KHAI BÁO HOOK navigate
  const categoryId = searchParams.get("categoryId");

  // State cho filter
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [minRating, setMinRating] = useState(0);

  // State mới để quản lý Show More/Less
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllOrigins, setShowAllOrigins] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        const filteredByCategory = categoryId
          ? data.filter((p) => p.category.id.toString() === categoryId)
          : data;
        setAllProducts(filteredByCategory);
        setFilteredProducts(filteredByCategory);
        // Cập nhật price range max
        const prices = filteredByCategory.map((p) => p.price);
        if (prices.length > 0) setPriceRange([Math.min(...prices), Math.max(...prices)]);
      } catch (err) {
        console.error(err);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  // Lọc khi filter thay đổi (Giữ nguyên logic này)
  useEffect(() => {
    let temp = [...allProducts];

    // Brand
    if (selectedBrands.length > 0) {
      temp = temp.filter((p) => selectedBrands.includes(p.brand.name));
    }

    // Price: Cần lấy min/max price ban đầu của tất cả sản phẩm
    const initialMinPrice = allProducts.length > 0 ? Math.min(...allProducts.map(p => p.price)) : 0;
    const initialMaxPrice = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 10000;

    temp = temp.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Stock
    if (inStockOnly) {
      temp = temp.filter((p) => p.stockQuantity > 0);
    }

    // Color
    if (selectedColors.length > 0) {
      temp = temp.filter((p) =>
        p.productAttributes.some(
          (attr) => attr.attributeName === "Màu sắc" && selectedColors.includes(attr.attributeValue)
        )
      );
    }

    // Origin
    if (selectedOrigins.length > 0) {
      temp = temp.filter((p) =>
        p.productAttributes.some(
          (attr) => attr.attributeName === "Xuất xứ" && selectedOrigins.includes(attr.attributeValue)
        )
      );
    }

    // Rating
    if (minRating > 0) {
      temp = temp.filter((p) => {
        if (p.reviews.length === 0) return false;
        const avg = p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length;
        return avg >= minRating;
      });
    }

    setFilteredProducts(temp);
  }, [allProducts, selectedBrands, priceRange, inStockOnly, selectedColors, selectedOrigins, minRating]);

  // ******************************************************
  // ************* HÀM ĐẶT LẠI BỘ LỌC *******************
  // ******************************************************

  const handleResetFilters = () => {
    // 1. Đặt lại các state filter về giá trị mặc định
    setSelectedBrands([]);
    setInStockOnly(false);
    setSelectedColors([]);
    setSelectedOrigins([]);
    setMinRating(0);

    // 2. Đặt lại priceRange về min/max của TẤT CẢ sản phẩm
    const prices = allProducts.map((p) => p.price);
    if (prices.length > 0) {
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    } else {
      setPriceRange([0, 10000]);
    }

    // 3. Đặt lại trạng thái Show More/Less
    setShowAllBrands(false);
    setShowAllColors(false);
    setShowAllOrigins(false);

    // Lưu ý: Việc đặt lại filteredProducts sẽ diễn ra trong useEffect khi các state trên thay đổi.
  };

  // Lấy danh sách unique cho filter options (Giữ nguyên)
  const brands = Array.from(new Set(allProducts.map((p) => p.brand.name)));
  const colors = Array.from(
    new Set(
      allProducts
        .flatMap((p) => p.productAttributes.filter((a) => a.attributeName === "Màu sắc").map((a) => a.attributeValue))
    )
  );
  const origins = Array.from(
    new Set(
      allProducts
        .flatMap((p) => p.productAttributes.filter((a) => a.attributeName === "Xuất xứ").map((a) => a.attributeValue))
    )
  );

  // Áp dụng giới hạn hiển thị (Giữ nguyên)
  const visibleBrands = showAllBrands ? brands : brands.slice(0, MAX_ITEMS_DISPLAY);
  const visibleColors = showAllColors ? colors : colors.slice(0, MAX_ITEMS_DISPLAY);
  const visibleOrigins = showAllOrigins ? origins : origins.slice(0, MAX_ITEMS_DISPLAY);

  // Hàm xử lý chuyển hướng
  const handleProductSelect = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) return <p>Loading products...</p>;
  if (allProducts.length === 0) return <p>No products found in this category.</p>;

  return (
    <div className="category-section">
      <h2>Danh mục sản phẩm</h2>
      <div className="category-container">
        {/* Sidebar Filter */}
        <div className="filter-sidebar">
          <h3>Filters</h3>

          {/* NÚT ĐẶT LẠI */}
          <div className="filter-reset-group">
            <button
              className="reset-button"
              onClick={handleResetFilters}
            >
              Đặt lại Bộ lọc
            </button>
          </div>

          {/* Brand */}
          <div className="filter-group multi-select-grid">
            <h4>Brand</h4>
            {visibleBrands.map((b) => (
              <label key={b}>
                <input
                  type="checkbox"
                  value={b}
                  checked={selectedBrands.includes(b)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedBrands([...selectedBrands, b]);
                    else setSelectedBrands(selectedBrands.filter((x) => x !== b));
                  }}
                />
                {b}
              </label>
            ))}
            {/* Nút Xem Thêm/Thu Gọn */}
            {brands.length > MAX_ITEMS_DISPLAY && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllBrands(!showAllBrands)}
              >
                {showAllBrands ? "Thu gọn (Hide)" : `Xem thêm (${brands.length - MAX_ITEMS_DISPLAY} nữa)`}
              </button>
            )}
          </div>

          {/* Price */}
          <div className="filter-group price-filter">
            <h4>Price</h4>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            />
            <span> - </span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            />
          </div>

          {/* Stock */}
          <div className="filter-group">
            <h4>Stock</h4>
            <label>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              Còn hàng
            </label>
          </div>

          {/* Color */}
          <div className="filter-group multi-select-grid">
            <h4>Color</h4>
            {visibleColors.map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  value={c}
                  checked={selectedColors.includes(c)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedColors([...selectedColors, c]);
                    else setSelectedColors(selectedColors.filter((x) => x !== c));
                  }}
                />
                {c}
              </label>
            ))}
            {/* Nút Xem Thêm/Thu Gọn */}
            {colors.length > MAX_ITEMS_DISPLAY && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllColors(!showAllColors)}
              >
                {showAllColors ? "Thu gọn (Hide)" : `Xem thêm (${colors.length - MAX_ITEMS_DISPLAY} nữa)`}
              </button>
            )}
          </div>

          {/* Origin */}
          <div className="filter-group multi-select-grid">
            <h4>Origin</h4>
            {visibleOrigins.map((o) => (
              <label key={o}>
                <input
                  type="checkbox"
                  value={o}
                  checked={selectedOrigins.includes(o)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedOrigins([...selectedOrigins, o]);
                    else setSelectedOrigins(selectedOrigins.filter((x) => x !== o));
                  }}
                />
                {o}
              </label>
            ))}
            {/* Nút Xem Thêm/Thu Gọn */}
            {origins.length > MAX_ITEMS_DISPLAY && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllOrigins(!showAllOrigins)}
              >
                {showAllOrigins ? "Thu gọn (Hide)" : `Xem thêm (${origins.length - MAX_ITEMS_DISPLAY} nữa)`}
              </button>
            )}
          </div>

          {/* Rating */}
          <div className="filter-group multi-select-grid">
            <h4>Rating</h4>
            {[5, 4, 3, 2, 1].map((r) => (
              <label key={r}>
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(r)}
                />
                {r} sao trở lên
              </label>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="category-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              // THÊM SỰ KIỆN CHUYỂN HƯỚNG
              onSelect={() => handleProductSelect(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}