import axios from "../utils/axiosConfig";

// Base URL trong config đã là ".../api", nên ở đây chỉ cần đuôi
const ENDPOINT = "/admin/categories";

export const getCategories = async () => {
  const res = await axios.get(ENDPOINT);
  // Lấy data từ cấu trúc ApiResponse của backend
  return res.data.data;
};

export const createCategory = async (categoryData) => {
  const res = await axios.post(ENDPOINT, categoryData);
  return res.data.data;
};

export const updateCategory = async (id, categoryData) => {
  const res = await axios.put(`${ENDPOINT}/${id}`, categoryData);
  return res.data.data;
};

export const deleteCategory = async (id) => {
  // Với delete thường chỉ cần status 200, return cả response hoặc data tùy ý
  return await axios.delete(`${ENDPOINT}/${id}`);
};
