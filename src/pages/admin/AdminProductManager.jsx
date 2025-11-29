import React, { useEffect, useState } from "react";
// Đảm bảo đường dẫn import đúng. Nếu file productService nằm ở src/services/productService.js
// thì từ src/pages/admin/AdminProductManager.jsx ta phải lùi ra 2 cấp: ../../services/productService
import { getAdminProducts, deleteProduct } from "../../services/productService";

// Thay FaBoxOpen bằng FaBox để tránh lỗi import nếu bản icon cũ không có
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBox } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm load dữ liệu từ Backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts();
      setProducts(data);
      console.log("Admin Data:", data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm xử lý xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts(); // Load lại danh sách sau khi xóa
      } catch (error) {
        toast.error("Không thể xóa sản phẩm (có thể do ràng buộc đơn hàng).");
      }
    }
  };

  // Lọc sản phẩm theo tìm kiếm
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#333" }}>
      {/* HEADER & ACTIONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
            Product Management
          </h2>
          <p style={{ color: "#888", fontSize: 14 }}>Manage your catalog</p>
        </div>

        <button
          style={{
            padding: "12px 24px",
            background: "#5a02c2",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 10px rgba(90, 2, 194, 0.3)",
          }}
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 40px 12px 15px",
            borderRadius: 8,
            border: "1px solid #eee",
            background: "#f9f9f9",
            outline: "none",
          }}
        />
        <FaSearch
          style={{ position: "absolute", right: 15, top: 14, color: "#aaa" }}
        />
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid #eee",
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr
              style={{
                background: "#f8f9fa",
                textAlign: "left",
                color: "#666",
              }}
            >
              <th style={{ padding: 15, borderBottom: "1px solid #eee" }}>
                ID
              </th>
              <th style={{ padding: 15, borderBottom: "1px solid #eee" }}>
                Product Name
              </th>
              <th style={{ padding: 15, borderBottom: "1px solid #eee" }}>
                Category
              </th>
              <th style={{ padding: 15, borderBottom: "1px solid #eee" }}>
                Price
              </th>
              <th style={{ padding: 15, borderBottom: "1px solid #eee" }}>
                Stock
              </th>
              <th style={{ padding: 15, borderBottom: "1px solid #eee" }}>
                Status
              </th>
              <th
                style={{
                  padding: 15,
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: 30, textAlign: "center" }}>
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: 30, textAlign: "center" }}>
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                // --- LOGIC SỬA LỖI TRẠNG THÁI ---
                // Kiểm tra xem biến là isActive hay active (do Jackson serialize)
                const isProductActive =
                  product.isActive !== undefined
                    ? product.isActive
                    : product.active;

                return (
                  <tr
                    key={product.id}
                    style={{ borderBottom: "1px solid #f4f4f4" }}
                    className="hover:bg-gray-50"
                  >
                    <td
                      style={{ padding: 15, fontWeight: "bold", color: "#888" }}
                    >
                      #{product.id}
                    </td>

                    <td style={{ padding: 15 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: "#f0f0f0",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                          }}
                        >
                          <FaBox />
                        </div>
                        <span style={{ fontWeight: "600" }}>
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: 15, color: "#555" }}>
                      {product.category
                        ? product.category.name
                        : "Uncategorized"}
                    </td>

                    <td style={{ padding: 15, fontWeight: "bold" }}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.price)}
                    </td>

                    <td style={{ padding: 15 }}>
                      {product.stockQuantity < 10 ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          {product.stockQuantity} (Low)
                        </span>
                      ) : (
                        <span style={{ color: "green" }}>
                          {product.stockQuantity}
                        </span>
                      )}
                    </td>

                    {/* Cột Status đã sửa */}
                    <td style={{ padding: 15 }}>
                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: "bold",
                          background: isProductActive ? "#e8f5e9" : "#eceff1",
                          color: isProductActive ? "#2e7d32" : "#546e7a",
                        }}
                      >
                        {isProductActive ? "Active" : "Hidden"}
                      </span>
                    </td>

                    <td style={{ padding: 15, textAlign: "right" }}>
                      <button
                        style={{
                          marginRight: 10,
                          border: "none",
                          background: "none",
                          color: "#5a02c2",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{
                          border: "none",
                          background: "none",
                          color: "#ff5252",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductManager;
