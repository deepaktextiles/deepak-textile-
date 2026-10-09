"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { adminApi, setAdminToken, removeAdminToken } from "../../services/api.js";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("dt_admin_token") : null;
      if (token) {
        try {
          const res = await adminApi.getMe();
          if (res.success && res.admin) {
            setAdmin(res.admin);
          } else {
            removeAdminToken();
          }
        } catch {
          removeAdminToken();
          setAdmin(null);
        }
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  const login = async (email, password) => {
    const res = await adminApi.login({ email, password });
    if (res.success && res.token) {
      setAdminToken(res.token);
      setAdmin(res.admin);
      return true;
    }
    return false;
  };

  const logout = () => {
    removeAdminToken();
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, isAuthenticated: !!admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
