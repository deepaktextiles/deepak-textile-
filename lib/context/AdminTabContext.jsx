"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const AdminTabContext = createContext({
  activeTab: "banner",
  setActiveTab: () => {},
});

export const AdminTabProvider = ({ children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTabState] = useState(tabFromUrl || "banner");

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl);
    }
  }, [tabFromUrl]);

  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    // If we're on /admin, update query string gracefully
    if (pathname === "/admin") {
      router.push(`/admin?tab=${newTab}`, { scroll: false });
    } else {
      router.push(`/admin?tab=${newTab}`);
    }
  };

  return (
    <AdminTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AdminTabContext.Provider>
  );
};

export const useAdminTab = () => useContext(AdminTabContext);
