import React, { createContext, useState, useEffect, useContext } from "react";
import { loginAPI, getMeAPI, logoutAPI, registerAPI } from "../services/authService";

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
          const meRes = await getMeAPI();
          const userData = meRes.data.data;

          // Lưu token vào user
          setUser({ ...userData, token });
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
      const res = await loginAPI(username, password);
      const token = res.data.data.token;

      if (token) {
        localStorage.setItem("token", token);

        const meRes = await getMeAPI();
        const userData = meRes.data.data;

        // Lưu token vào user
        setUser({ ...userData, token });

        window.location.reload();

        return { ...userData, token };
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
    logoutAPI();
    window.location.href = "/";
  };

  const register = async (formData) => {
    try {
      const res = await registerAPI(formData);

      if (res.data.status === 201) {
        // Đăng ký thành công
        return {
          success: true,
          message: res.data.message,
        };
      }
    } catch (error) {
      console.error(error);

      // Nếu backend trả lỗi dạng { message: "..." }
      const message =
        error.response?.data?.message || "Register failed";

      return {
        success: false,
        message,
      };
    }

    return { success: false, message: "Register failed" };
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
