import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.1.98:8081/api",

  // SỬA TẠM THÀNH FALSE
  // Lý do: Để trình duyệt không chặn CORS khi Server đang trả về "*"
  // Hậu quả: Tạm thời tính năng Giỏ hàng (Session) sẽ không hoạt động, nhưng xem Sản phẩm thì OK.
  withCredentials: false,

  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
