// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:8081/api", // Port của Spring Boot
//   withCredentials: true, // QUAN TRỌNG: Để CartController nhận được Session (Cookie)
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Tự động thêm Token vào Header cho các request cần bảo mật (Review, User info)
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // Lấy token từ bộ nhớ trình duyệt
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default instance;
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081/api",

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
