// Giả sử file cấu hình axios instance của bạn nằm ở "../utils/axiosConfig"
// Hãy đổi đường dẫn này nếu bạn lưu file ở chỗ khác
import axios from "../utils/axiosConfig";

const ENDPOINT = "/admin/brands";

export const getBrands = async () => {
  // baseURL đã có "/api", nên url chỉ cần nối thêm "/admin/brands"
  const res = await axios.get(ENDPOINT);
  return res.data.data; // Giữ lại việc lấy .data.data nếu backend trả về dạng ApiResponse
};

export const createBrand = async (brandData) => {
  const res = await axios.post(ENDPOINT, brandData);
  return res.data.data;
};

export const updateBrand = async (id, brandData) => {
  const res = await axios.put(`${ENDPOINT}/${id}`, brandData);
  return res.data.data;
};

export const deleteBrand = async (id) => {
  return await axios.delete(`${ENDPOINT}/${id}`);
};
