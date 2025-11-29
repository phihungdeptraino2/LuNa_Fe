import axios from "../utils/axiosConfig";

export const getAllProducts = async () => {
  // Backend trả về ApiResponse, dữ liệu thực nằm trong response.data.data
  const response = await axios.get("/products");
  return response.data.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`/products/${id}`);
  return response.data.data;
};

// --- ADMIN API (Quản trị viên dùng) ---
// Gọi vào /api/admin/products (như trong AdminProductController của bạn)
export const getAdminProducts = async () => {
  const response = await axios.get("/admin/products");
  return response.data.data;
};

export const deleteProduct = async (id) => {
  return await axios.delete(`/admin/products/${id}`);
};
