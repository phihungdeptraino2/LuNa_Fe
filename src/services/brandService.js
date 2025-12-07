import axios from "axios";

// Đảm bảo URL này khớp với port backend của bạn (8080 hoặc 8081)
const API_URL = "http://localhost:8081/api/admin/brands";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getBrands = async () => {
    const res = await axios.get(API_URL, getAuthHeader());
    return res.data.data; // Lấy data từ ApiResponse
};

export const createBrand = async (brandData) => {
    const res = await axios.post(API_URL, brandData, getAuthHeader());
    return res.data.data;
};

export const updateBrand = async (id, brandData) => {
    const res = await axios.put(`${API_URL}/${id}`, brandData, getAuthHeader());
    return res.data.data;
};

export const deleteBrand = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return res.data;
};