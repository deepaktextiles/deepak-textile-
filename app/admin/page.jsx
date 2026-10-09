"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon,
  Package,
  Layers,
  Inbox,
  Save,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MessageCircle,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  LogOut,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useAdmin } from "../../lib/context/AdminContext";
import { settingsApi, productsApi, categoriesApi, enquiriesApi } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isAuthenticated, loading: authLoading, logout } = useAdmin();

  const [activeTab, setActiveTab] = useState("banner"); // 'banner', 'products', 'categories', 'enquiries'
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 1. Settings / Banner state
  const [settings, setSettings] = useState({
    bannerTitle: "",
    bannerSubtitle: "",
    bannerImage: "",
    phone: "",
    whatsapp: "",
    address: "",
    gstin: "",
  });

  // 2. Products state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    sku: "",
    wholesalePrice: "",
    price: "",
    minimumOrderQuantity: "10",
    fabric: "Banarasi Silk",
    color: "Multi / Catalog Set",
    images: "",
    description: "",
    stock: "100",
    unit: "piece",
    featured: true,
  });

  // 3. Category Form
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: "",
    description: "",
  });

  // 4. Enquiries state
  const [enquiries, setEnquiries] = useState([]);

  // Check Auth
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load Initial Data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes, cRes, eRes] = await Promise.allSettled([
        settingsApi.get(),
        productsApi.getAll({ limit: 100 }),
        categoriesApi.getAll(),
        enquiriesApi.getAll({ limit: 100 }),
      ]);

      if (sRes.status === "fulfilled") {
        const s = sRes.value?.settings || sRes.value?.setting;
        if (s) {
          setSettings({
            bannerTitle: s.bannerTitle || "",
            bannerSubtitle: s.bannerSubtitle || "",
            bannerImage: s.bannerImage || "",
            phone: s.phone || "",
            whatsapp: s.whatsapp || s.whatsappNumber || "",
            address: s.address || "",
            gstin: s.gstin || s.gstNumber || "",
          });
        }
      }

      if (pRes.status === "fulfilled" && pRes.value?.products) {
        setProducts(pRes.value.products);
      }

      if (cRes.status === "fulfilled" && cRes.value?.categories) {
        setCategories(cRes.value.categories);
        if (cRes.value.categories.length > 0 && !productForm.category) {
          setProductForm((prev) => ({ ...prev, category: cRes.value.categories[0]._id }));
        }
      }

      if (eRes.status === "fulfilled" && eRes.value?.enquiries) {
        setEnquiries(eRes.value.enquiries);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Handle Banner & Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await settingsApi.update(settings);
      if (res.success) {
        setSuccessMessage("Hero Banner & Store settings saved successfully! Live on homepage.");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(res.message || "Could not save settings.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to update banner settings.");
    } finally {
      setLoading(false);
    }
  };

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: "",
      category: categories[0]?._id || "",
      sku: `DT-${Math.floor(1000 + Math.random() * 9000)}`,
      wholesalePrice: "",
      price: "",
      minimumOrderQuantity: "10",
      fabric: "Banarasi Silk",
      color: "Catalog Matching Set",
      images: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      description: "Direct Surat mill production lot. Premium finish with matching blouse / accessories.",
      stock: "100",
      unit: "piece",
      featured: true,
    });
    setProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod._id);
    setProductForm({
      name: prod.name || "",
      category: prod.category?._id || prod.category || categories[0]?._id || "",
      sku: prod.sku || "",
      wholesalePrice: prod.wholesalePrice || "",
      price: prod.price || "",
      minimumOrderQuantity: prod.minimumOrderQuantity || "10",
      fabric: prod.fabric || "",
      color: prod.color || "",
      images: Array.isArray(prod.images) ? prod.images.join("\n") : prod.images || "",
      description: prod.description || "",
      stock: prod.stock || "100",
      unit: prod.unit || "piece",
      featured: prod.featured !== undefined ? prod.featured : true,
    });
    setProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const imageList = productForm.images
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload = {
      name: productForm.name,
      category: productForm.category,
      sku: productForm.sku,
      wholesalePrice: Number(productForm.wholesalePrice) || Number(productForm.price),
      price: Number(productForm.price) || Number(productForm.wholesalePrice),
      minimumOrderQuantity: Number(productForm.minimumOrderQuantity) || 1,
      fabric: productForm.fabric,
      color: productForm.color,
      images: imageList.length > 0 ? imageList : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
      description: productForm.description,
      stock: Number(productForm.stock) || 100,
      unit: productForm.unit,
      featured: Boolean(productForm.featured),
    };

    try {
      if (editingProductId) {
        const res = await productsApi.update(editingProductId, payload);
        if (res.success) {
          setSuccessMessage("Product updated successfully!");
          setProductModalOpen(false);
          loadAllData();
        } else {
          setErrorMessage(res.message || "Failed to update product.");
        }
      } else {
        const res = await productsApi.create(payload);
        if (res.success) {
          setSuccessMessage("New Wholesale Product added successfully!");
          setProductModalOpen(false);
          loadAllData();
        } else {
          setErrorMessage(res.message || "Failed to create product.");
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Error saving product.");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the wholesale catalog?`)) {
      return;
    }

    try {
      const res = await productsApi.delete(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setSuccessMessage(`Product "${name}" deleted.`);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete product.");
    }
  };

  // Add Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      const res = await categoriesApi.create({
        name: categoryForm.name.trim(),
        image: categoryForm.image.trim() || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        description: categoryForm.description.trim(),
      });

      if (res.success) {
        setSuccessMessage("Category added!");
        setCategoryModalOpen(false);
        setCategoryForm({ name: "", image: "", description: "" });
        loadAllData();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to create category.");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await categoriesApi.delete(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setSuccessMessage(`Category "${name}" removed.`);
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete category.");
    }
  };

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = async (id, newStatus) => {
    try {
      const res = await enquiriesApi.updateStatus(id, { status: newStatus });
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm("Delete this buyer enquiry record?")) return;
    try {
      await enquiriesApi.delete(id);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-txt-secondary">
              Admin Portal • Active
            </span>
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-navy-500 mt-0.5">
            Deepak Textiles Control Center
          </h1>
          <p className="text-xs text-txt-secondary">
            Logged in as: <strong>{admin?.name || admin?.email || "Super Admin"}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllData}
            isLoading={loading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:bg-red-50"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("banner")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors ${
            activeTab === "banner"
              ? "bg-navy-500 text-white border-b-2 border-gold-500"
              : "bg-white text-txt-secondary hover:text-navy-500 border border-border border-b-0"
          }`}
        >
          <ImageIcon className="w-4 h-4 text-gold-400" />
          <span>Hero Banner & Store Info</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors ${
            activeTab === "products"
              ? "bg-navy-500 text-white border-b-2 border-gold-500"
              : "bg-white text-txt-secondary hover:text-navy-500 border border-border border-b-0"
          }`}
        >
          <Package className="w-4 h-4 text-gold-400" />
          <span>Wholesale Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors ${
            activeTab === "categories"
              ? "bg-navy-500 text-white border-b-2 border-gold-500"
              : "bg-white text-txt-secondary hover:text-navy-500 border border-border border-b-0"
          }`}
        >
          <Layers className="w-4 h-4 text-gold-400" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("enquiries")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors ${
            activeTab === "enquiries"
              ? "bg-navy-500 text-white border-b-2 border-gold-500"
              : "bg-white text-txt-secondary hover:text-navy-500 border border-border border-b-0"
          }`}
        >
          <Inbox className="w-4 h-4 text-gold-400" />
          <span>Buyer Enquiries ({enquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: HERO BANNER & STORE SETTINGS */}
      {activeTab === "banner" && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-heading font-bold text-navy-500">
              Homepage Hero Banner & Store Contact
            </h2>
            <p className="text-xs text-txt-secondary mt-1">
              Any changes made here will update the homepage banner, top announcement bar, and contact details immediately.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-txt-secondary">
                Hero Banner Settings
              </h3>

              <Input
                label="Hero Banner Headline (Main Title)"
                value={settings.bannerTitle}
                onChange={(e) => setSettings({ ...settings, bannerTitle: e.target.value })}
                placeholder="e.g. Surat's Trusted Wholesale Textile & Garment Hub"
                required
              />

              <Textarea
                label="Hero Banner Subtitle"
                rows={2}
                value={settings.bannerSubtitle}
                onChange={(e) => setSettings({ ...settings, bannerSubtitle: e.target.value })}
                placeholder="Direct Mill Rates • Bulk Sarees, Suits, Kurti Sets & Fabrics • Pan-India Transport"
                required
              />

              <Input
                label="Hero Banner Image URL (High Resolution Fabric / Mill Photo)"
                value={settings.bannerImage}
                onChange={(e) => setSettings({ ...settings, bannerImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                required
              />

              {/* Banner Live Preview */}
              {settings.bannerImage && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-txt-secondary block">
                    Hero Banner Image Preview:
                  </span>
                  <div className="relative h-44 rounded-xl overflow-hidden border border-border bg-navy-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.bannerImage}
                      alt="Hero banner preview"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <h4 className="text-lg font-bold font-heading">{settings.bannerTitle || "Headline"}</h4>
                      <p className="text-xs text-gray-200 line-clamp-1">{settings.bannerSubtitle}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-txt-secondary">
                Wholesale Desk Phone & Numbers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Sales Desk Call Phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+91 98251 44520"
                />

                <Input
                  label="WhatsApp Order Number"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="+91 98251 44520"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Surat Mill / Showroom Address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Ring Road, Surat, Gujarat - 395002"
                />

                <Input
                  label="Company GSTIN"
                  value={settings.gstin}
                  onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                  placeholder="24AAACD1234F1Z5"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="font-bold bg-gold-500 hover:bg-gold-400 text-navy-500"
                isLoading={loading}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Hero Banner & Settings
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-navy-500">
                Wholesale Product Catalog
              </h2>
              <p className="text-xs text-txt-secondary mt-1">
                Add new products, set wholesale pricing, update minimum order quantities (MOQ), and edit fabric details.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddProduct}
              className="bg-gold-500 hover:bg-gold-400 text-navy-500 font-bold"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Product
            </Button>
          </div>

          {/* Products Table */}
          {products.length > 0 ? (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs divide-y divide-border">
                <thead className="bg-sitebg text-txt-secondary font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">SKU / Fabric</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Wholesale Rate</th>
                    <th className="py-3 px-4">MOQ</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-sitebg/50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.images?.[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80"}
                          alt={prod.name}
                          className="w-12 h-14 object-cover rounded border border-border shrink-0"
                        />
                        <div>
                          <span className="font-bold text-navy-500 block max-w-xs truncate">
                            {prod.name}
                          </span>
                          <span className="text-[11px] text-txt-secondary">{prod.color}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-txt-secondary block">{prod.sku}</span>
                        <span className="text-[11px] font-semibold text-gold-700">{prod.fabric}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-navy-500">
                        {prod.category?.name || "Wholesale Lot"}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-navy-500 text-sm">
                          ₹{prod.wholesalePrice?.toLocaleString("en-IN") || prod.price?.toLocaleString("en-IN")}
                        </span>
                        <span className="text-txt-secondary block text-[10px]">/{prod.unit || "pc"}</span>
                      </td>

                      <td className="py-3 px-4 font-bold text-navy-500">
                        {prod.minimumOrderQuantity} {prod.unit || "pcs"}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {prod.stock} {prod.unit || "pcs"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-sitebg text-txt-secondary hover:text-navy-500"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded hover:bg-sitebg text-blue-600 hover:text-blue-800"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(prod._id, prod.name)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-600 hover:text-red-800"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-xl p-8 space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-bold text-base text-navy-500">No Products in Catalog</h3>
              <p className="text-xs text-txt-secondary">
                Click &quot;Add New Product&quot; to add your first Surat wholesale textile lot.
              </p>
              <Button variant="primary" size="sm" onClick={handleOpenAddProduct}>
                Add First Product
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === "categories" && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-navy-500">
                Wholesale Categories
              </h2>
              <p className="text-xs text-txt-secondary mt-1">
                Organize catalog items (e.g. Sarees, Dress Materials, Kurtis, Running Fabrics).
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setCategoryModalOpen(true)}
              className="bg-gold-500 hover:bg-gold-400 text-navy-500 font-bold"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Category
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 rounded-xl border border-border bg-sitebg flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80"}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded-lg border border-border"
                  />
                  <div>
                    <h4 className="font-bold text-navy-500 text-sm">{cat.name}</h4>
                    <span className="text-[11px] text-txt-secondary">slug: {cat.slug}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCategory(cat._id, cat.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BUYER QUOTE ENQUIRIES */}
      {activeTab === "enquiries" && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-heading font-bold text-navy-500">
              Buyer Quote Enquiries ({enquiries.length})
            </h2>
            <p className="text-xs text-txt-secondary mt-1">
              Inquiries submitted by retailers and boutique owners through the website and product detail pages.
            </p>
          </div>

          {enquiries.length > 0 ? (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-xs divide-y divide-border">
                <thead className="bg-sitebg text-txt-secondary font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Buyer / Shop</th>
                    <th className="py-3 px-4">Phone / WhatsApp</th>
                    <th className="py-3 px-4">Product / Quantity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {enquiries.map((enq) => {
                    const cleanPhone = (enq.phone || "").replace(/[^0-9]/g, "");
                    const waText = encodeURIComponent(
                      `Hello ${enq.name}, we received your wholesale inquiry on Deepak Textiles for: ${
                        enq.product?.name || "wholesale textile catalog"
                      }. How can we assist you with catalog dispatch?`
                    );

                    return (
                      <tr key={enq._id} className="hover:bg-sitebg/50">
                        <td className="py-3 px-4 text-txt-secondary whitespace-nowrap">
                          {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-navy-500 block">{enq.name}</span>
                          <span className="text-[11px] text-txt-secondary">
                            {enq.companyName || "Retail Buyer"} {enq.city ? `(${enq.city})` : ""}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold text-navy-500 block">{enq.phone}</span>
                          {enq.email && <span className="text-[10px] text-txt-secondary">{enq.email}</span>}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-medium text-navy-500 block">
                            {enq.product?.name || "General Wholesale Inquiry"}
                          </span>
                          {enq.quantity && (
                            <span className="text-[11px] font-bold text-gold-700">
                              Qty: {enq.quantity} pcs
                            </span>
                          )}
                          {enq.message && (
                            <p className="text-[11px] text-txt-secondary line-clamp-1 mt-0.5">
                              {enq.message}
                            </p>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={enq.status || "new"}
                            onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                            className={`px-2 py-1 rounded text-[11px] font-bold border ${
                              enq.status === "completed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : enq.status === "contacted"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-gold-50 text-gold-800 border-gold-200"
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${waText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              onClick={() => handleDeleteEnquiry(enq._id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-xl p-8 space-y-3">
              <Inbox className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-bold text-base text-navy-500">No Inquiries Yet</h3>
              <p className="text-xs text-txt-secondary">
                When buyers click &quot;Request Wholesale Quote&quot; or send a form message, their details will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProductId ? "Edit Wholesale Product" : "Add New Wholesale Product"}
        size="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name *"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="e.g. Royal Banarasi Silk Zari Saree"
              required
            />

            <Select
              label="Category *"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              required
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="SKU Code *"
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              placeholder="DT-1001"
              required
            />

            <Input
              label="Wholesale Rate (₹) *"
              type="number"
              value={productForm.wholesalePrice}
              onChange={(e) => setProductForm({ ...productForm, wholesalePrice: e.target.value })}
              placeholder="850"
              required
            />

            <Input
              label="Retail MRP (₹)"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              placeholder="2499"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Minimum Order Qty (MOQ) *"
              type="number"
              value={productForm.minimumOrderQuantity}
              onChange={(e) => setProductForm({ ...productForm, minimumOrderQuantity: e.target.value })}
              placeholder="10"
              required
            />

            <Input
              label="Fabric Type *"
              value={productForm.fabric}
              onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
              placeholder="Banarasi Silk"
              required
            />

            <Input
              label="Color / Set Variant"
              value={productForm.color}
              onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
              placeholder="Set of 8 colors"
            />
          </div>

          <Textarea
            label="Product Image URLs (One URL per line)"
            rows={3}
            value={productForm.images}
            onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            helperText="Provide direct image links (Unsplash or any hosted image). First link will be main thumbnail."
            required
          />

          <Textarea
            label="Product Description / Fabric Details"
            rows={3}
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            placeholder="Direct Surat mill production lot. Standard packaging with matching blouse..."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setProductModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-navy-500 font-bold"
            >
              {editingProductId ? "Update Product" : "Add Product to Catalog"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ADD CATEGORY MODAL */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Add Wholesale Category"
        size="md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
          <Input
            label="Category Name *"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            placeholder="e.g. Designer Georgette Sarees"
            required
          />

          <Input
            label="Category Image URL"
            value={categoryForm.image}
            onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />

          <Textarea
            label="Category Description"
            rows={2}
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            placeholder="Bulk wholesale lots directly from Surat mills..."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-navy-500 font-bold"
            >
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
