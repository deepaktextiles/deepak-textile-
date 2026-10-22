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
      const cachedProfile = typeof window !== "undefined" ? localStorage.getItem("dt_admin_profile") : null;

      if (token && cachedProfile) {
        try {
          setAdmin(JSON.parse(cachedProfile));
        } catch {
          // Ignore json parse error
        }
      }

      if (token) {
        try {
          const res = await adminApi.getMe();
          if (res.success && res.admin) {
            setAdmin(res.admin);
            if (typeof window !== "undefined") {
              localStorage.setItem("dt_admin_profile", JSON.stringify(res.admin));
            }
          } else {
            removeAdminToken();
            if (typeof window !== "undefined") {
              localStorage.removeItem("dt_admin_profile");
            }
            setAdmin(null);
          }
        } catch (err) {
          // If strictly unauthenticated (401/403), remove token
          const msg = err?.message || "";
          if (msg.includes("401") || msg.includes("403") || msg.includes("expired") || msg.includes("Invalid")) {
            removeAdminToken();
            if (typeof window !== "undefined") {
              localStorage.removeItem("dt_admin_profile");
            }
            setAdmin(null);
          }
        }
      } else {
        setAdmin(null);
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
      if (typeof window !== "undefined") {
        localStorage.setItem("dt_admin_profile", JSON.stringify(res.admin));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    removeAdminToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("dt_admin_profile");
    }
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, isAuthenticated: !!admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
