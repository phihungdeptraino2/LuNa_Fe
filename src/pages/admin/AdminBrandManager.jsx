import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa"; // <--- Import FaSearch
import { toast } from "react-toastify";

const AdminCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // <--- 1. State tìm kiếm

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategory(id);
        toast.success("Xóa danh mục thành công!");
        fetchCategories();
      } catch (error) {
        toast.error("Không thể xóa (có thể đang chứa sản phẩm).");
      }
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentCategory({ id: null, name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditMode(true);
    setCurrentCategory(cat);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateCategory(currentCategory.id, currentCategory);
        toast.success("Cập nhật thành công!");
      } else {
        await createCategory(currentCategory);
        toast.success("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // --- 2. LOGIC LỌC TÌM KIẾM ---
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#333" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 30,
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
            Quản Lý Danh Mục
          </h2>
          <p style={{ color: "#888", fontSize: 14 }}>Category Management</p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            padding: "10px 20px",
            background: "#5a02c2",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: "600",
          }}
        >
          <FaPlus /> Thêm Danh Mục
        </button>
      </div>

      {/* --- 3. THANH TÌM KIẾM --- */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
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
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "#f8f9fa",
                textAlign: "left",
                color: "#666",
              }}
            >
              <th style={{ padding: 15 }}>ID</th>
              <th style={{ padding: 15 }}>Tên Danh Mục</th>
              <th style={{ padding: 15 }}>Mô Tả</th>
              <th style={{ padding: 15, textAlign: "right" }}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ padding: 20, textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: 20, textAlign: "center" }}>
                  {searchTerm
                    ? "Không tìm thấy kết quả nào."
                    : "Chưa có danh mục nào."}
                </td>
              </tr>
            ) : (
              // --- 4. Render danh sách đã lọc (filteredCategories) ---
              filteredCategories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                  <td
                    style={{ padding: 15, fontWeight: "bold", color: "#888" }}
                  >
                    #{cat.id}
                  </td>
                  <td style={{ padding: 15 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          background: "#e8f5e9",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#2e7d32",
                        }}
                      >
                        <FaLayerGroup />
                      </div>
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 15, color: "#555" }}>
                    {cat.description || <i>Chưa có mô tả</i>}
                  </td>
                  <td style={{ padding: 15, textAlign: "right" }}>
                    <button
                      onClick={() => openEditModal(cat)}
                      style={btnStyle("#5a02c2")}
                      title="Sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      style={btnStyle("#ff5252")}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL POPUP */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0 }}>
              {isEditMode ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 15 }}>
                <label style={labelStyle}>
                  Tên danh mục <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentCategory.name}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      name: e.target.value,
                    })
                  }
                  style={inputStyle}
                  placeholder="Ví dụ: Điện thoại, Laptop..."
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Mô tả</label>
                <textarea
                  value={currentCategory.description}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      description: e.target.value,
                    })
                  }
                  style={{ ...inputStyle, height: 80, resize: "none" }}
                  placeholder="Nhập mô tả cho danh mục..."
                />
              </div>
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    ...actionBtnStyle,
                    background: "#ccc",
                    color: "#333",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    ...actionBtnStyle,
                    background: "#5a02c2",
                    color: "white",
                  }}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const btnStyle = (color) => ({
  border: "none",
  background: "none",
  color: color,
  cursor: "pointer",
  fontSize: 16,
  marginLeft: 10,
});
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};
const modalContentStyle = {
  background: "white",
  padding: 30,
  borderRadius: 12,
  width: 450,
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
};
const labelStyle = {
  display: "block",
  marginBottom: 5,
  fontWeight: "500",
  fontSize: 14,
};
const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 14,
  boxSizing: "border-box",
};
const actionBtnStyle = {
  padding: "8px 20px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "600",
};

export default AdminCategoryManager;
