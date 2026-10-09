const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("dt_admin_token");
  }
  return null;
};

export const setAdminToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("dt_admin_token", token);
  }
};

export const removeAdminToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("dt_admin_token");
  }
};

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Network error. Please ensure the backend is running.");
  }
}

// Admin Auth
export const adminApi = {
  login: (credentials) =>
    apiRequest("/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getMe: () => apiRequest("/admin/me"),
};

// Products
export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    return apiRequest(`/products?${query.toString()}`);
  },
  getBySlug: (slug) => apiRequest(`/products/${slug}`),
  getFilters: () => apiRequest("/products/filters"),
  create: (data) =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/products/${id}`, {
      method: "DELETE",
    }),
};

// Categories
export const categoriesApi = {
  getAll: () => apiRequest("/categories"),
  getBySlug: (slug) => apiRequest(`/categories/${slug}`),
  create: (data) =>
    apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
};

// Enquiries
export const enquiriesApi = {
  submit: (data) =>
    apiRequest("/enquiries", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    return apiRequest(`/enquiries?${query.toString()}`);
  },
  updateStatus: (id, data) =>
    apiRequest(`/enquiries/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/enquiries/${id}`, {
      method: "DELETE",
    }),
};

// Settings & Banners
export const settingsApi = {
  get: () => apiRequest("/settings"),
  update: (data) =>
    apiRequest("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
