// src/utils/constants.js

// URL gốc của Backend (để dành cho việc hiển thị ảnh)
export const BE_HOST = "http://localhost:8081";

// Hàm tiện ích để build URL ảnh
export const getImageUrl = (path) => {
  if (!path) return "";
  // Nếu path đã là link online (https://...) thì giữ nguyên, còn không thì nối với BE_HOST
  if (path.startsWith("http")) return path;
  
  return `${BE_HOST}${path.startsWith("/") ? path : `/${path}`}`;
};