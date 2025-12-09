import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts } from "../../services/productService";
import ProductCard from "../../components/ProductCard";
import "./CategorySection.css";

export default function CategorySection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); // ✅ lấy searchParams
  const categoryId = searchParams.get("categoryId"); // ✅ khai báo categoryId

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // bắt đầu loading mỗi lần URL thay đổi
      try {
        const data = await getAllProducts();
        // nếu có categoryId thì lọc, ngược lại lấy tất cả
        const filtered = categoryId
          ? data.filter((p) => p.category.id.toString() === categoryId)
          : data;
        setProducts(filtered);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]); // ✅ dependency là categoryId

  if (loading) return <p>Loading products...</p>;
  if (products.length === 0) return <p>No products available.</p>;

  return (
    <div className="category-section">
      <h2>Danh mục sản phẩm</h2>
      <div className="category-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
