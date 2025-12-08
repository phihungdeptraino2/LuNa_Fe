import React, { useEffect, useState } from "react";
import {
  getBrands,
  deleteBrand,
  createBrand,
  updateBrand,
} from "../../services/brandService";
import { FaEdit, FaTrash, FaPlus, FaTags, FaSearch } from "react-icons/fa"; // <--- Import FaSearch
import { toast } from "react-toastify";

const AdminBrandManager = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // <--- 1. State tìm kiếm

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBrand, setCurrentBrand] = useState({
    id: null,
    name: "",
    description: "",
  });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách thương hiệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      try {
        await deleteBrand(id);
        toast.success("Xóa thành công!");
        fetchBrands();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Không thể xóa thương hiệu này."
        );
      }
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentBrand({ id: null, name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (brand) => {
    setIsEditMode(true);
    setCurrentBrand(brand);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateBrand(currentBrand.id, currentBrand);
        toast.success("Cập nhật thành công!");
      } else {
        await createBrand(currentBrand);
        toast.success("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchBrands();
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  // --- 2. LOGIC LỌC TÌM KIẾM ---
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        color: "#333",
        padding: 20,
      }}
    >
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
            Quản Lý Thương Hiệu
          </h2>
          <p style={{ color: "#888", fontSize: 14 }}>Brand Management</p>
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
          }}
        >
          <FaPlus /> Thêm Thương Hiệu
        </button>
      </div>

      {/* --- 3. THANH TÌM KIẾM --- */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <input
          type="text"
          placeholder="Tìm kiếm thương hiệu..."
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
              <th style={{ padding: 15 }}>Tên Thương Hiệu</th>
              <th style={{ padding: 15 }}>Mô tả</th>
              <th style={{ padding: 15, textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ padding: 20, textAlign: "center" }}>
                  Đang tải...
                </td>
              </tr>
            ) : filteredBrands.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: 20, textAlign: "center" }}>
                  {searchTerm
                    ? "Không tìm thấy kết quả nào."
                    : "Chưa có thương hiệu nào."}
                </td>
              </tr>
            ) : (
              // --- 4. Render danh sách đã lọc (filteredBrands) ---
              filteredBrands.map((brand) => (
                <tr
                  key={brand.id}
                  style={{ borderBottom: "1px solid #f4f4f4" }}
                >
                  <td style={{ padding: 15, fontWeight: "bold" }}>
                    #{brand.id}
                  </td>
                  <td style={{ padding: 15 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          background: "#eee",
                          borderRadius: 4,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FaTags color="#888" />
                      </div>
                      <b>{brand.name}</b>
                    </div>
                  </td>
                  <td style={{ padding: 15, color: "#555" }}>
                    {brand.description || "Chưa có mô tả"}
                  </td>
                  <td style={{ padding: 15, textAlign: "right" }}>
                    <button
                      onClick={() => openEditModal(brand)}
                      style={btnStyle("#5a02c2")}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      style={btnStyle("#ff5252")}
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

      {/* MODAL */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>
              {isEditMode ? "Cập Nhật Thương Hiệu" : "Thêm Thương Hiệu Mới"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 15 }}>
                <label
                  style={{ display: "block", marginBottom: 5, fontWeight: 500 }}
                >
                  Tên thương hiệu:
                </label>
                <input
                  type="text"
                  required
                  value={currentBrand.name}
                  onChange={(e) =>
                    setCurrentBrand({ ...currentBrand, name: e.target.value })
                  }
                  style={inputStyle}
                  placeholder="Nhập tên thương hiệu..."
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{ display: "block", marginBottom: 5, fontWeight: 500 }}
                >
                  Mô tả:
                </label>
                <textarea
                  value={currentBrand.description}
                  onChange={(e) =>
                    setCurrentBrand({
                      ...currentBrand,
                      description: e.target.value,
                    })
                  }
                  style={{ ...inputStyle, height: 80 }}
                  placeholder="Nhập mô tả..."
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

// CSS
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
  zIndex: 1000,
};
const modalContentStyle = {
  background: "white",
  padding: 30,
  borderRadius: 12,
  width: 400,
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
};
const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 14,
};
const actionBtnStyle = {
  padding: "8px 20px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
};

export default AdminBrandManager;
