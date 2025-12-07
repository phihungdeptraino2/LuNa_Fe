import axios from "axios";

const API_URL = "http://localhost:8081/api/orders";

// Lấy danh sách đơn hàng theo user + status
export const getOrdersByUser = async (status) => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/my-orders?status=${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
