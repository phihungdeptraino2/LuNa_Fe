import axios from "axios";

// Đổi port 8081 nếu server bạn chạy port khác
const API_URL = "http://localhost:8081/api/admin/categories";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getCategories = async () => {
  const res = await axios.get(API_URL, getAuthHeader());
  // Tùy vào backend trả về, có thể là res.data hoặc res.data.data
  return res.data.data || res.data; 
};

export const createCategory = async (categoryData) => {
  const res = await axios.post(API_URL, categoryData, getAuthHeader());
  return res.data.data || res.data;
};

export const updateCategory = async (id, categoryData) => {
  const res = await axios.put(`${API_URL}/${id}`, categoryData, getAuthHeader());
  return res.data.data || res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  return res.data;
};