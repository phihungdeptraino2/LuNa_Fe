import axios from "../utils/axiosConfig";

// Endpoint gốc cho admin orders
const ADMIN_ORDER_ENDPOINT = "/admin/orders";
const UPDATE_STATUS_ENDPOINT = "/orders/admin/update-status";
const ENDPOINT = "/orders";
// 1. Lấy tất cả đơn hàng
export const getAllOrders = async () => {
  const res = await axios.get(ADMIN_ORDER_ENDPOINT);
  return res.data.data;
};

// 2. Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (id) => {
  const res = await axios.get(`${ADMIN_ORDER_ENDPOINT}/${id}`);
  return res.data.data;
};

// 3. Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  // Backend dùng @RequestParam nên ta truyền vào params
  // Body để null vì method là PUT nhưng không gửi JSON body
  const res = await axios.put(UPDATE_STATUS_ENDPOINT, null, {
    params: { orderId, status },
  });
  return res.data;
};
export const getOrdersByUser = async (status) => {
  // Token tự động được thêm vào header bởi Interceptor

  // URL đầy đủ sẽ là: http://localhost:8081/api/orders/my-orders?status=...

  return await axios.get(`${ENDPOINT}/my-orders?status=${status}`);
};
