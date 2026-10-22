function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    // If running on a live domain like deepaktextile.in, always use same-origin /api
    // to avoid Mixed Content (HTTPS -> HTTP) and localhost connection failures!
    if (!isLocalhost) {
      if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
        return "/api";
      }
      return envUrl;
    }

    return envUrl || "/api";
  }

  // Server-side (Node.js / SSR)
  const backend = process.env.BACKEND_API_URL || "http://127.0.0.1:5000";
  return `${backend}/api`;
}

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

  const baseUrl = getApiBaseUrl().replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

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

// Settings
export const settingsApi = {
  get: () => apiRequest("/settings"),
  update: (data) =>
    apiRequest("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Banners CRUD (Hero & Trending)
export const bannersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    const qs = query.toString();
    return apiRequest(`/banners${qs ? `?${qs}` : ""}`);
  },
  getById: (id) => apiRequest(`/banners/${id}`),
  create: (data) =>
    apiRequest("/banners", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/banners/${id}`, {
      method: "DELETE",
    }),
};

// Customer Reviews & Testimonials CRUD
export const reviewsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, String(v));
    });
    const qs = query.toString();
    return apiRequest(`/reviews${qs ? `?${qs}` : ""}`);
  },
  create: (data) =>
    apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/reviews/${id}`, {
      method: "DELETE",
    }),
};

// File Upload API (From Device)
export const uploadApi = {
  uploadImage: (base64Data, filename) =>
    apiRequest("/upload", {
      method: "POST",
      body: JSON.stringify({ image: base64Data, filename }),
    }),
};

