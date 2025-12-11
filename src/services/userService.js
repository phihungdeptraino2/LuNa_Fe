import axios from "../utils/axiosConfig"; // Đảm bảo đường dẫn đúng tới file config của bạn

const ENDPOINT = "/admin/users";

export const getAllUsers = async () => {
  // axiosConfig đã có baseURL là ".../api" và tự động gắn Token
  const res = await axios.get(ENDPOINT);
  
  // Trả về data (tương ứng với res.data.data trong code cũ của bạn)
  return res.data.data;
};