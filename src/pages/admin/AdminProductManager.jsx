import React, { useEffect, useState } from "react";
import {
  deleteProduct,
  createProduct,
  updateProduct,
  uploadProductImages,
  getAllCategories,
  getAllBrands,
  getAllProducts,
} from "../../services/productService";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaBox,
  FaTimes,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE MỚI CHO FORM & MODAL ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // State chứa dữ liệu form
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    isActive: true,
    categoryId: "",
    brandId: "",
  });

  // State chứa file ảnh upload
  const [selectedFiles, setSelectedFiles] = useState([]);

  // --- INIT DATA ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  // Load Categories & Brands khi component mount để dùng cho Select option
  useEffect(() => {
    fetchProducts();
    const fetchMeta = async () => {
      const cats = await getAllCategories();
      const brs = await getAllBrands();
      setCategories(cats);
      setBrands(brs);
    };
    fetchMeta();
  }, []);

  // --- HANDLERS ---

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id);
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Không thể xóa sản phẩm.");
      }
    }
  };

  // Mở Modal Thêm mới
  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      isActive: true,
      categoryId: "",
      brandId: "",
    });
    setSelectedFiles([]);
    setShowModal(true);
  };

  const BE_HOST = "http://localhost:8081";
  const buildImageUrl = (url) => {
    if (!url) {
      console.warn("⚠️ URL trống");
      return "";
    }

    const fullUrl = `${BE_HOST}${url.startsWith("/") ? url : `/${url}`}`;
    // console.log("🖼️ Image URL:", fullUrl);

    return fullUrl;
  };

  // Mở Modal Edit
  const handleEdit = (product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      stockQuantity: product.stockQuantity,
      isActive:
        product.isActive !== undefined ? product.isActive : product.active,
      // Lấy ID từ object category/brand nếu có
      categoryId: product.category ? product.category.id : "",
      brandId: product.brand ? product.brand.id : "",
    });
    setSelectedFiles([]);
    setShowModal(true);
  };

  // Xử lý submit form
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!formData.name || !formData.categoryId || !formData.brandId) {
      toast.warning("Vui lòng điền tên, danh mục và thương hiệu!");
      return;
    }

    try {
      let savedProduct;

      // 1. Lưu thông tin Text (Create hoặc Update)
      if (isEditing) {
        savedProduct = await updateProduct(formData.id, formData);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        savedProduct = await createProduct(formData);
        toast.success("Tạo sản phẩm thành công!");
      }

      // 2. Upload ảnh (Nếu có file được chọn)
      if (selectedFiles.length > 0 && savedProduct) {
        try {
          await uploadProductImages(savedProduct.id, selectedFiles);
          toast.success(`Đã tải lên ${selectedFiles.length} ảnh.`);
        } catch (imgError) {
          toast.error("Lỗi khi tải ảnh: " + imgError.message);
        }
      }

      setShowModal(false);
      fetchProducts(); // Reload lại bảng
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu sản phẩm");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        color: "#333",
        position: "relative",
      }}
    >
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
            Quản Lý Sản Phẩm
          </h2>
          <p style={{ color: "#888", fontSize: 14 }}>
            Quản lý danh mục hàng hóa của bạn
          </p>
        </div>
        <button
          onClick={handleAddNew}
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
          <FaPlus /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên..."
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
              <th style={{ padding: 15 }}>ID</th>
              <th style={{ padding: 15 }}>Tên Sản Phẩm</th>
              <th style={{ padding: 15 }}>Danh Mục</th>
              <th style={{ padding: 15 }}>Thương Hiệu</th>
              <th style={{ padding: 15 }}>Giá</th>
              <th style={{ padding: 15 }}>Kho</th>
              <th style={{ padding: 15 }}>Trạng Thái</th>
              <th style={{ padding: 15, textAlign: "right" }}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: 30, textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: 30, textAlign: "center" }}>
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
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
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {product.productImages?.[0] ? (
                            <img
                              src={buildImageUrl(
                                product.productImages[0].imageUrl
                              )}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <FaBox style={{ color: "#999" }} />
                          )}
                        </div>
                        <span style={{ fontWeight: "600" }}>
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 15 }}>
                      {product.category?.name || "N/A"}
                    </td>
                    <td style={{ padding: 15 }}>
                      {product.brand?.name || "N/A"}
                    </td>
                    <td style={{ padding: 15, fontWeight: "bold" }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </td>
                    <td style={{ padding: 15 }}>
                      <span
                        style={{
                          color: product.stockQuantity < 10 ? "red" : "green",
                        }}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>
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
                        {isProductActive ? "Hoạt động" : "Ẩn"}
                      </span>
                    </td>
                    <td style={{ padding: 15, textAlign: "right" }}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={{
                          marginRight: 10,
                          border: "none",
                          background: "none",
                          color: "#5a02c2",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                        title="Sửa"
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
                        title="Xóa"
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

      {/* --- MODAL ADD/EDIT --- */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 12,
              width: 600,
              maxWidth: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              <FaTimes />
            </button>

            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              {isEditing ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
            </h2>

            <form
              onSubmit={handleSave}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              {/* NAME */}
              <div>
                <label
                  style={{ display: "block", marginBottom: 5, fontWeight: 600 }}
                >
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 20 }}>
                {/* CATEGORY */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Danh mục
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* BRAND */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Thương hiệu
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData({ ...formData, brandId: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 20 }}>
                {/* PRICE */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Giá bán
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
                {/* STOCK */}
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 5,
                      fontWeight: 600,
                    }}
                  >
                    Số lượng kho
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: parseInt(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  style={{ display: "block", marginBottom: 5, fontWeight: 600 }}
                >
                  Mô tả
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              {/* ACTIVE STATUS */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  id="isActive"
                  style={{ width: 18, height: 18 }}
                />
                <label htmlFor="isActive" style={{ cursor: "pointer" }}>
                  Kích hoạt sản phẩm
                </label>
              </div>

              {/* UPLOAD IMAGES */}
              <div
                style={{
                  border: "1px dashed #5a02c2",
                  padding: 20,
                  borderRadius: 8,
                  background: "#f5f0ff",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: 10,
                    fontWeight: 600,
                    color: "#5a02c2",
                  }}
                >
                  <FaCloudUploadAlt /> Tải ảnh lên
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                />
                {selectedFiles.length > 0 && (
                  <p style={{ fontSize: 12, marginTop: 5 }}>
                    Đã chọn: {selectedFiles.length} tệp
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 6,
                    border: "none",
                    background: "#eee",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    borderRadius: 6,
                    border: "none",
                    background: "#5a02c2",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {isEditing ? "Cập Nhật" : "Tạo Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManager;
