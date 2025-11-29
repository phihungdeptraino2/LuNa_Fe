import React, { createContext, useState, useEffect, useContext } from "react";
// 1. Thay đổi import: Không import axios nữa, mà import các hàm từ Service
import { loginAPI, getMeAPI, logoutAPI } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- HÀM CHECK LOGIN KHI F5 ---
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Dùng hàm từ Service
          const response = await getMeAPI();
          if (response.data && response.data.data) {
            setUser(response.data.data);
          }
        } catch (error) {
          console.log("Token lỗi");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  // --- HÀM LOGIN ---
  const login = async (username, password) => {
    try {
      // Dùng hàm từ Service
      const res = await loginAPI(username, password);

      if (res.data.data.token) {
        localStorage.setItem("token", res.data.data.token);

        // Dùng hàm từ Service
        const meRes = await getMeAPI();
        const userData = meRes.data.data;

        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
    return null;
  };

  // --- HÀM LOGOUT ---
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);

    // Dùng hàm từ Service (gọi chạy ngầm, ko cần await cũng được)
    logoutAPI();

    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
