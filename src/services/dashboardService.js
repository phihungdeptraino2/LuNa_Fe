import axios from "../utils/axiosConfig";

const ENDPOINT = "/admin/dashboard";

export const getDashboardStats = async () => {
  // axiosConfig đã lo phần BaseURL và Token
  const res = await axios.get(ENDPOINT);
  
  // Trả về data (tương ứng với res.data.data trong code cũ)
  return res.data.data;
};