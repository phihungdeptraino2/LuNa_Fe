import axios from "../utils/axiosConfig"

export const loginAPI = async (username, password) => {
  // Chỉ gọi API và trả về kết quả, không can thiệp logic phụ
  return await axios.post("/auth/login", { username, password })
}

export const registerAPI = async (userData) => {
  return await axios.post("/auth/register", userData)
}

export const getMeAPI = async () => {
  return await axios.get("/auth/me")
}

export const logoutAPI = async () => {
  return await axios.post("/auth/logout")
}

export const getCartAPI = async () => {
  return await axios.get("/api/cart")
}
