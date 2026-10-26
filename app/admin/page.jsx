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
  EyeOff,
  Star,
  Store,
  UploadCloud,
  Monitor,
  Smartphone,
  Key,
  ShieldCheck,
  UserCheck,
  Database,
} from "lucide-react";
import { useAdmin } from "../../lib/context/AdminContext";
import { useAdminTab } from "../../lib/context/AdminTabContext";
import {
  adminApi,
  settingsApi,
  productsApi,
  categoriesApi,
  enquiriesApi,
  bannersApi,
  reviewsApi,
  uploadApi,
} from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isAuthenticated, loading: authLoading, logout, refreshAdmin } = useAdmin();
  const { activeTab, setActiveTab } = useAdminTab();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Admin Profile & Security State
  const [adminProfileForm, setAdminProfileForm] = useState({
    name: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingAdminProfile, setSavingAdminProfile] = useState(false);
  const [changingAdminPassword, setChangingAdminPassword] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // 1. Hero & Trending Banners CRUD state
  const [banners, setBanners] = useState([]);
  const [bannerTypeFilter, setBannerTypeFilter] = useState("all");
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const [uploadingMobileBannerImage, setUploadingMobileBannerImage] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    badge: "",
    image: "",
    mobileImage: "",
    link: "/products",
    btnText: "",
    order: 1,
    active: true,
    type: "hero",
  });

  // Store Contact Settings
  const [settings, setSettings] = useState({
    bannerTitle: "",
    bannerSubtitle: "",
    bannerImage: "",
    phone: "",
    whatsapp: "",
    address: "",
    gstin: "",
  });
  const [uploadingSettingsBanner, setUploadingSettingsBanner] = useState(false);

  // 2. Products state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [uploadingProductImages, setUploadingProductImages] = useState(false);
  const [productUploadProgress, setProductUploadProgress] = useState("");
  const [newImageUrlInput, setNewImageUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    sku: "",
    wholesalePrice: "",
    price: "",
    minimumOrderQuantity: "10",
    fabric: "Banarasi Silk",
    color: "Multi / Catalog Set",
    images: [],
    description: "",
    stock: "100",
    unit: "piece",
    featured: true,
  });

  // 3. Category State & Edit
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: "",
    description: "",
  });

  // 4. Enquiries state
  const [enquiries, setEnquiries] = useState([]);

  // 5. Customer Reviews & Testimonials CRUD state
  const [reviews, setReviews] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    business: "Retail Textile Merchant",
    rating: 5,
    time: "Verified Buyer",
    text: "",
    isLocalGuide: true,
    avatarBg: "bg-[#C00000]",
    active: true,
    order: 1,
  });

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
      const [sRes, pRes, cRes, eRes, bRes, rRes] = await Promise.allSettled([
        settingsApi.get(),
        productsApi.getAll({ limit: 100 }),
        categoriesApi.getAll(),
        enquiriesApi.getAll({ limit: 100 }),
        bannersApi.getAll(),
        reviewsApi.getAll(),
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

      if (bRes.status === "fulfilled" && bRes.value?.banners) {
        setBanners(bRes.value.banners);
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

      if (rRes.status === "fulfilled" && rRes.value?.reviews) {
        setReviews(rRes.value.reviews);
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

  // Open Add Banner Modal
  const handleOpenAddBanner = () => {
    setEditingBannerId(null);
    setBannerForm({
      title: "",
      subtitle: "",
      badge: "",
      image: "",
      mobileImage: "",
      link: "/products",
      btnText: "",
      order: banners.length + 1,
      active: true,
      type: "hero",
    });
    setBannerModalOpen(true);
  };

  // Open Edit Banner Modal
  const handleOpenEditBanner = (b) => {
    setEditingBannerId(b._id);
    setBannerForm({
      title: "",
      subtitle: "",
      badge: "",
      image: b.image || "",
      mobileImage: b.mobileImage || "",
      link: b.link || "/products",
      btnText: "",
      order: b.order !== undefined ? b.order : 1,
      active: b.active !== undefined ? b.active : true,
      type: b.type || "hero",
    });
    setBannerModalOpen(true);
  };

  // Handle Banner Image File Upload from Device (Desktop or Mobile)
  const handleBannerFileUpload = async (e, fieldName = "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP, etc.).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file size should be less than 10MB.");
      return;
    }

    if (fieldName === "mobileImage") {
      setUploadingMobileBannerImage(true);
    } else {
      setUploadingBannerImage(true);
    }
    setErrorMessage("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await uploadApi.uploadImage(base64Data, file.name);
          if (res.success && res.url) {
            setBannerForm((prev) => ({ ...prev, [fieldName]: res.url }));
            setSuccessMessage(
              fieldName === "mobileImage"
                ? "Mobile banner image uploaded successfully!"
                : "Desktop banner image uploaded successfully!"
            );
            setTimeout(() => setSuccessMessage(""), 3500);
          } else {
            setErrorMessage(res.message || "Failed to upload image.");
          }
        } catch (uploadErr) {
          setErrorMessage(uploadErr.message || "Error uploading image to server.");
        } finally {
          if (fieldName === "mobileImage") {
            setUploadingMobileBannerImage(false);
          } else {
            setUploadingBannerImage(false);
          }
        }
      };
      reader.onerror = () => {
        setErrorMessage("Could not read image file from your device.");
        if (fieldName === "mobileImage") {
          setUploadingMobileBannerImage(false);
        } else {
          setUploadingBannerImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMessage(err.message || "Failed to read file.");
      if (fieldName === "mobileImage") {
        setUploadingMobileBannerImage(false);
      } else {
        setUploadingBannerImage(false);
      }
    }
  };

  // Save Banner (Create or Update)
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.image.trim()) {
      setErrorMessage("Please upload a Desktop banner image or provide an image URL.");
      return;
    }
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (editingBannerId) {
        const res = await bannersApi.update(editingBannerId, bannerForm);
        if (res.success) {
          setSuccessMessage("Banner updated successfully!");
          setBannerModalOpen(false);
          loadAllData();
        } else {
          setErrorMessage(res.message || "Failed to update banner.");
        }
      } else {
        const res = await bannersApi.create(bannerForm);
        if (res.success) {
          setSuccessMessage("New Banner added successfully to slider!");
          setBannerModalOpen(false);
          loadAllData();
        } else {
          setErrorMessage(res.message || "Failed to create banner.");
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save banner.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id, title) => {
    if (!window.confirm(`Delete banner "${title}" from the homepage carousel?`)) return;
    try {
      const res = await bannersApi.delete(id);
      if (res.success) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
        setSuccessMessage(`Banner "${title}" deleted.`);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete banner.");
    }
  };

  // Sync Admin profile data to form
  useEffect(() => {
    if (admin) {
      setAdminProfileForm({
        name: admin.name || "",
        email: admin.email || "",
      });
    }
  }, [admin]);

  // Handle Save Admin Profile in MongoDB
  const handleSaveAdminProfile = async (e) => {
    e.preventDefault();
    if (!adminProfileForm.name.trim() || !adminProfileForm.email.trim()) {
      setErrorMessage("Please enter both admin name and email.");
      return;
    }
    setSavingAdminProfile(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await adminApi.updateProfile({
        name: adminProfileForm.name.trim(),
        email: adminProfileForm.email.trim(),
      });
      if (res.success) {
        setSuccessMessage("Admin credentials updated in database successfully!");
        if (refreshAdmin) await refreshAdmin();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(res.message || "Failed to update admin profile.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to update admin profile.");
    } finally {
      setSavingAdminProfile(false);
    }
  };

  // Handle Change Admin Password in MongoDB
  const handleChangeAdminPassword = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setErrorMessage("Please enter current and new password.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    setChangingAdminPassword(true);

    try {
      const res = await adminApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.success) {
        setSuccessMessage("Admin password successfully updated in database!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(res.message || "Failed to update admin password.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to change admin password.");
    } finally {
      setChangingAdminPassword(false);
    }
  };

  // Handle Store Contact Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await settingsApi.update(settings);
      if (res.success) {
        setSuccessMessage("Store contact & showroom details saved successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage(res.message || "Could not save settings.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to update store settings.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Showroom / MegaMenu Promotional Banner File Upload
  const handleSettingsBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file size should be less than 10MB.");
      return;
    }

    setUploadingSettingsBanner(true);
    setErrorMessage("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await uploadApi.uploadImage(base64Data, file.name);
          if (res.success && res.url) {
            setSettings((prev) => ({ ...prev, bannerImage: res.url }));
            setSuccessMessage("Showroom promotional banner uploaded successfully!");
            setTimeout(() => setSuccessMessage(""), 3500);
          } else {
            setErrorMessage(res.message || "Failed to upload image.");
          }
        } catch (uploadErr) {
          setErrorMessage(uploadErr.message || "Error uploading image to server.");
        } finally {
          setUploadingSettingsBanner(false);
        }
      };
      reader.onerror = () => {
        setErrorMessage("Could not read image file from device.");
        setUploadingSettingsBanner(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMessage(err.message || "Failed to read file.");
      setUploadingSettingsBanner(false);
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
      images: [],
      description: "Direct Surat mill production lot. Premium finish with matching blouse / accessories.",
      stock: "100",
      unit: "piece",
      featured: true,
    });
    setNewImageUrlInput("");
    setShowUrlInput(false);
    setProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod._id);
    let initialImages = [];
    if (Array.isArray(prod.images)) {
      initialImages = prod.images.filter((img) => Boolean(img && typeof img === "string" && img.trim()));
    } else if (typeof prod.images === "string" && prod.images.trim()) {
      initialImages = prod.images.split("\n").map((u) => u.trim()).filter(Boolean);
    }

    setProductForm({
      name: prod.name || "",
      category: prod.category?._id || prod.category || categories[0]?._id || "",
      sku: prod.sku || "",
      wholesalePrice: prod.wholesalePrice || "",
      price: prod.price || "",
      minimumOrderQuantity: prod.minimumOrderQuantity || "10",
      fabric: prod.fabric || "",
      color: prod.color || "",
      images: initialImages,
      description: prod.description || "",
      stock: prod.stock || "100",
      unit: prod.unit || "piece",
      featured: prod.featured !== undefined ? prod.featured : true,
    });
    setNewImageUrlInput("");
    setShowUrlInput(false);
    setProductModalOpen(true);
  };

  // Upload Multiple Product Images from Device (Mobile / Desktop)
  const handleProductImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      setErrorMessage("Please select valid image files (JPG, PNG, WebP).");
      return;
    }

    const oversized = validFiles.find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      setErrorMessage(`Image "${oversized.name}" exceeds 10MB limit.`);
      return;
    }

    setUploadingProductImages(true);
    setErrorMessage("");

    const uploadedUrls = [];
    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setProductUploadProgress(`Uploading photo ${i + 1} of ${validFiles.length}: ${file.name}...`);

        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
          reader.readAsDataURL(file);
        });

        const res = await uploadApi.uploadImage(base64Data, file.name);
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
        } else {
          throw new Error(res.message || `Failed to upload ${file.name}`);
        }
      }

      setProductForm((prev) => {
        const current = Array.isArray(prev.images)
          ? prev.images
          : typeof prev.images === "string" && prev.images.trim()
          ? prev.images.split("\n").map((u) => u.trim()).filter(Boolean)
          : [];
        return {
          ...prev,
          images: [...current, ...uploadedUrls],
        };
      });

      setSuccessMessage(`${uploadedUrls.length} product image(s) uploaded successfully!`);
      setTimeout(() => setSuccessMessage(""), 3500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to upload one or more images.");
    } finally {
      setUploadingProductImages(false);
      setProductUploadProgress("");
      e.target.value = "";
    }
  };

  // Remove single image from productForm
  const handleRemoveProductImage = (indexToRemove) => {
    setProductForm((prev) => {
      const current = Array.isArray(prev.images) ? [...prev.images] : [];
      current.splice(indexToRemove, 1);
      return { ...prev, images: current };
    });
  };

  // Set selected image as Primary / Main thumbnail (index 0)
  const handleSetPrimaryProductImage = (index) => {
    setProductForm((prev) => {
      const current = Array.isArray(prev.images) ? [...prev.images] : [];
      if (index > 0 && index < current.length) {
        const [selected] = current.splice(index, 1);
        current.unshift(selected);
      }
      return { ...prev, images: current };
    });
  };

  // Add an image by direct web link / URL
  const handleAddProductImageUrl = (url) => {
    const trimmed = (url || "").trim();
    if (!trimmed) return;
    setProductForm((prev) => {
      const current = Array.isArray(prev.images) ? [...prev.images] : [];
      return { ...prev, images: [...current, trimmed] };
    });
    setNewImageUrlInput("");
    setShowUrlInput(false);
  };

  // Category file upload handler
  const handleCategoryFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Category image size should be less than 10MB.");
      return;
    }

    setUploadingCategoryImage(true);
    setErrorMessage("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await uploadApi.uploadImage(base64Data, file.name);
          if (res.success && res.url) {
            setCategoryForm((prev) => ({ ...prev, image: res.url }));
            setSuccessMessage("Category image uploaded successfully!");
            setTimeout(() => setSuccessMessage(""), 3500);
          } else {
            setErrorMessage(res.message || "Failed to upload image.");
          }
        } catch (uploadErr) {
          setErrorMessage(uploadErr.message || "Error uploading image.");
        } finally {
          setUploadingCategoryImage(false);
        }
      };
      reader.onerror = () => {
        setErrorMessage("Could not read image file.");
        setUploadingCategoryImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMessage(err.message || "Failed to read file.");
      setUploadingCategoryImage(false);
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    let imageList = [];
    if (Array.isArray(productForm.images)) {
      imageList = productForm.images.filter((url) => typeof url === "string" && url.trim().length > 0);
    } else if (typeof productForm.images === "string") {
      imageList = productForm.images
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);
    }

    if (imageList.length === 0) {
      setErrorMessage("Please upload at least 1 image for the wholesale product.");
      return;
    }

    const payload = {
      name: productForm.name,
      category: productForm.category,
      sku: productForm.sku,
      wholesalePrice: Number(productForm.wholesalePrice) || Number(productForm.price),
      price: Number(productForm.price) || Number(productForm.wholesalePrice),
      minimumOrderQuantity: Number(productForm.minimumOrderQuantity) || 1,
      fabric: productForm.fabric,
      color: productForm.color,
      images: imageList,
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

  // Category Handlers (Add, Edit, Delete)
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm({ name: "", image: "", description: "" });
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategoryId(cat._id);
    setCategoryForm({
      name: cat.name || "",
      image: cat.image || "",
      description: cat.description || "",
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    const payload = {
      name: categoryForm.name.trim(),
      image: categoryForm.image.trim() || "/images/selesproductsimages/7ff997fb-c6a3-4333-84d2-907a30cb30f9.avif",
      description: categoryForm.description.trim(),
    };

    try {
      if (editingCategoryId) {
        const res = await categoriesApi.update(editingCategoryId, payload);
        if (res.success) {
          setSuccessMessage("Category updated successfully!");
          setCategoryModalOpen(false);
          setEditingCategoryId(null);
          loadAllData();
        } else {
          setErrorMessage(res.message || "Failed to update category.");
        }
      } else {
        const res = await categoriesApi.create(payload);
        if (res.success) {
          setSuccessMessage("Category added successfully!");
          setCategoryModalOpen(false);
          setCategoryForm({ name: "", image: "", description: "" });
          loadAllData();
        } else {
          setErrorMessage(res.message || "Failed to create category.");
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save category.");
    }
  };

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

  // Customer Reviews Handlers (Add, Edit, Delete)
  const handleOpenAddReview = () => {
    setEditingReviewId(null);
    setReviewForm({
      name: "",
      business: "Retail Textile Merchant",
      rating: 5,
      time: "Verified Buyer",
      text: "",
      isLocalGuide: true,
      avatarBg: "bg-[#C00000]",
      active: true,
      order: reviews.length + 1,
    });
    setReviewModalOpen(true);
  };

  const handleOpenEditReview = (rev) => {
    setEditingReviewId(rev._id);
    setReviewForm({
      name: rev.name || "",
      business: rev.business || "",
      rating: rev.rating !== undefined ? rev.rating : 5,
      time: rev.time || "Verified Buyer",
      text: rev.text || "",
      isLocalGuide: Boolean(rev.isLocalGuide),
      avatarBg: rev.avatarBg || "bg-[#C00000]",
      active: rev.active !== undefined ? rev.active : true,
      order: rev.order !== undefined ? rev.order : 1,
    });
    setReviewModalOpen(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      setErrorMessage("Please enter both Reviewer Name and Review Text.");
      return;
    }

    try {
      if (editingReviewId) {
        const res = await reviewsApi.update(editingReviewId, reviewForm);
        if (res.success) {
          setSuccessMessage("Customer review updated successfully!");
          setReviewModalOpen(false);
          loadAllData();
        } else {
          setErrorMessage(res.message || "Failed to update review.");
        }
      } else {
        const res = await reviewsApi.create(reviewForm);
        if (res.success) {
          setSuccessMessage("Customer review added successfully!");
          setReviewModalOpen(false);
          loadAllData();
        } else {
          setErrorMessage(res.message || "Failed to create review.");
        }
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save review.");
    }
  };

  const handleDeleteReview = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await reviewsApi.delete(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setSuccessMessage("Customer review deleted.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete review.");
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
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors shrink-0 ${
            activeTab === "banner"
              ? "bg-navy-500 text-white border-b-2 border-gold-500"
              : "bg-white text-txt-secondary hover:text-navy-500 border border-border border-b-0"
          }`}
        >
          <ImageIcon className="w-4 h-4 text-gold-400" />
          <span>Banners ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors shrink-0 ${
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
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors shrink-0 ${
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
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors shrink-0 ${
            activeTab === "enquiries"
              ? "bg-navy-500 text-white border-b-2 border-gold-500"
              : "bg-white text-txt-secondary hover:text-navy-500 border border-border border-b-0"
          }`}
        >
          <Inbox className="w-4 h-4 text-gold-400" />
          <span>Buyer Enquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors shrink-0 ${
            activeTab === "reviews"
              ? "bg-navy-500 text-white border-b-2 border-gold-500"
              : "bg-white text-txt-secondary hover:text-navy-500 border border-border border-b-0"
          }`}
        >
          <Star className="w-4 h-4 text-gold-400" />
          <span>Customer Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-lg transition-colors shrink-0 ${
            activeTab === "settings"
              ? "bg-navy-500 text-white border-b-2 border-gold-500"
              : "bg-white text-txt-secondary hover:text-navy-500 border border-border border-b-0"
          }`}
        >
          <Store className="w-4 h-4 text-gold-400" />
          <span>Showroom Settings</span>
        </button>
      </div>

      {/* TAB 1: HERO & TRENDING BANNERS (CRUD) */}
      {activeTab === "banner" && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C00000]" />
                <span className="text-xs font-bold uppercase tracking-wider text-txt-secondary">
                  Homepage Carousels & Sliders
                </span>
              </div>
              <h2 className="text-xl font-heading font-extrabold text-navy-500 mt-0.5">
                Banners Management ({banners.length})
              </h2>
              <p className="text-xs text-txt-secondary mt-1">
                Add, edit, reorder, or delete Top Hero Carousels and Trending Now banners across the website.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddBanner}
              className="bg-[#C00000] hover:bg-[#A80000] text-white font-bold"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Banner
            </Button>
          </div>

          {/* Banner Type Filter Tabs */}
          <div className="flex items-center gap-2 pb-2 overflow-x-auto">
            <span className="text-xs font-bold text-txt-secondary shrink-0">Filter:</span>
            <button
              onClick={() => setBannerTypeFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shrink-0 ${
                bannerTypeFilter === "all"
                  ? "bg-navy-500 text-white"
                  : "bg-slate-100 text-txt-secondary hover:bg-slate-200"
              }`}
            >
              All Banners ({banners.length})
            </button>
            <button
              onClick={() => setBannerTypeFilter("hero")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shrink-0 ${
                bannerTypeFilter === "hero"
                  ? "bg-[#C00000] text-white"
                  : "bg-slate-100 text-txt-secondary hover:bg-slate-200"
              }`}
            >
              Hero Carousel ({banners.filter((b) => (b.type || "hero") === "hero").length})
            </button>
            <button
              onClick={() => setBannerTypeFilter("trending")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shrink-0 ${
                bannerTypeFilter === "trending"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 text-txt-secondary hover:bg-slate-200"
              }`}
            >
              Trending Slider ({banners.filter((b) => b.type === "trending").length})
            </button>
          </div>

          {/* Banners Grid */}
          {banners.filter((b) => bannerTypeFilter === "all" ? true : (b.type || "hero") === bannerTypeFilter).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners
                .filter((b) => bannerTypeFilter === "all" ? true : (b.type || "hero") === bannerTypeFilter)
                .map((b, idx) => (
                <div
                  key={b._id || idx}
                  className="relative rounded-2xl border border-border overflow-hidden bg-slate-50 flex flex-col justify-between hover:border-[#C00000]/60 transition-colors shadow-xs"
                >
                  {/* Banner Image Viewport */}
                  <div className="relative aspect-[21/9] w-full bg-navy-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent p-4 flex flex-col justify-between text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.type === "trending"
                            ? "bg-amber-500 text-navy-950"
                            : "bg-black/60 backdrop-blur-xs text-amber-400 border border-white/10"
                        }`}>
                          {b.type === "trending" ? "Trending Slider" : "Hero Carousel"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.active !== false
                              ? "bg-emerald-500/90 text-white"
                              : "bg-gray-600/90 text-gray-200"
                          }`}
                        >
                          {b.active !== false ? "Active" : "Disabled"}
                        </span>
                      </div>

                      {/* Responsive Device Indicators */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600/90 text-white shadow-xs">
                          <Monitor className="w-3 h-3" /> Desktop
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                          b.mobileImage ? "bg-emerald-600 text-white" : "bg-black/50 text-gray-300 border border-white/20"
                        }`}>
                          <Smartphone className="w-3 h-3" /> {b.mobileImage ? "Mobile Custom" : "Mobile (Desktop fallback)"}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold font-heading text-white line-clamp-1">
                          {b.title || `Graphic Banner (Slide #${b.order || idx + 1})`}
                        </h4>
                        {b.subtitle && (
                          <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">
                            {b.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Banner Footer Info & Actions */}
                  <div className="p-3.5 bg-white border-t border-border flex items-center justify-between gap-2">
                    <div className="text-[11px] text-txt-secondary space-y-0.5 truncate">
                      {b.btnText && (
                        <div>
                          <strong className="text-navy-500 font-semibold">Button:</strong>{" "}
                          <span>{b.btnText}</span>
                        </div>
                      )}
                      <div className="truncate">
                        <strong className="text-navy-500 font-semibold">Link:</strong>{" "}
                        <span className="font-mono text-[10px]">{b.link || "/products"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEditBanner(b)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteBanner(b._id, b.title)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-border rounded-xl p-8 space-y-3">
              <ImageIcon className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-bold text-base text-navy-500">No Banners Found</h3>
              <p className="text-xs text-txt-secondary">
                Click &quot;Add New Banner&quot; to create a banner slide for the website.
              </p>
              <Button variant="primary" size="sm" onClick={handleOpenAddBanner}>
                Add First Banner
              </Button>
            </div>
          )}
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
                          src={prod.images?.[0] || "/images/selesproductsimages/7ff997fb-c6a3-4333-84d2-907a30cb30f9.avif"}
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
              onClick={handleOpenAddCategory}
              className="bg-[#C00000] hover:bg-[#A80000] text-white font-bold"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Category
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 rounded-xl border border-border bg-sitebg flex items-center justify-between gap-3 hover:border-gold-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image || "/images/selesproductsimages/7ff997fb-c6a3-4333-84d2-907a30cb30f9.avif"}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded-lg border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-navy-500 text-sm truncate">{cat.name}</h4>
                    <span className="text-[11px] text-txt-secondary block truncate font-mono">slug: {cat.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditCategory(cat)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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

      {/* TAB 5: CUSTOMER REVIEWS & TESTIMONIALS (CRUD) */}
      {activeTab === "reviews" && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-txt-secondary">
                  Google & Verified Retailer Reviews
                </span>
              </div>
              <h2 className="text-xl font-heading font-extrabold text-navy-500 mt-0.5">
                Customer Reviews ({reviews.length})
              </h2>
              <p className="text-xs text-txt-secondary mt-1">
                Add, edit, or remove client reviews, retail showroom testimonials, and Google ratings.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddReview}
              className="bg-[#C00000] hover:bg-[#A80000] text-white font-bold"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Review
            </Button>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="rounded-xl border border-border p-4 bg-sitebg flex flex-col justify-between hover:border-gold-500 transition-colors space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full ${rev.avatarBg || "bg-[#C00000]"} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                        >
                          {(rev.name || "V").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-navy-500 text-xs sm:text-sm truncate">
                            {rev.name}
                          </h4>
                          <span className="text-[11px] text-txt-secondary block truncate">
                            {rev.business}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold">{rev.rating || 5}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-txt-primary line-clamp-3 italic">
                      &ldquo;{rev.text}&rdquo;
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-txt-secondary pt-1">
                      <span>{rev.time || "Verified Buyer"}</span>
                      {rev.isLocalGuide && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          ★ Local Guide
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rev.active !== false
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {rev.active !== false ? "Visible" : "Hidden"}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditReview(rev)}
                        className="p-1.5 rounded hover:bg-white text-blue-600 transition-colors"
                        title="Edit Review"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev._id, rev.name)}
                        className="p-1.5 rounded hover:bg-white text-red-600 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-border rounded-xl p-8 space-y-3">
              <Star className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-bold text-base text-navy-500">No Reviews Found</h3>
              <p className="text-xs text-txt-secondary">
                Click &quot;Add New Review&quot; to add client feedback or testimonials.
              </p>
              <Button variant="primary" size="sm" onClick={handleOpenAddReview}>
                Add First Review
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: STORE SHOWROOM & SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-heading font-bold text-navy-500">
              Wholesale Showroom Contact & Numbers
            </h2>
            <p className="text-xs text-txt-secondary mt-1">
              Update Darbhanga store phone numbers, WhatsApp order line, and official showroom address.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Sales Desk Call Phone"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+91 93080 66552"
              />

              <Input
                label="WhatsApp Order Number"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="+91 93080 66552"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Darbhanga Showroom Address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Kadirabad Road, Near Naka No. 2, Darbhanga, Bihar – 846004"
              />

              <Input
                label="Company GSTIN"
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                placeholder="24AAACD1234F1Z5"
              />
            </div>

            {/* Showroom / MegaMenu Promotional Banner */}
            <div className="p-4 rounded-2xl border-2 border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy-500">
                    Showroom / Mega Menu Promotional Banner
                  </label>
                  <span className="text-[11px] text-txt-secondary">
                    Displayed in the website navigation dropdown menu and store promotional cards
                  </span>
                </div>
                {settings.bannerImage && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wide">
                    Banner Active
                  </span>
                )}
              </div>

              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50/80 hover:bg-blue-50/20 transition-all">
                <input
                  type="file"
                  id="settingsBannerUploadInput"
                  accept="image/*"
                  onChange={handleSettingsBannerUpload}
                  className="hidden"
                  disabled={uploadingSettingsBanner}
                />

                {uploadingSettingsBanner ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2 text-blue-600">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p className="text-xs font-bold font-poppins">Uploading showroom banner from device...</p>
                    <p className="text-[11px] text-txt-secondary">Please wait a moment...</p>
                  </div>
                ) : settings.bannerImage ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[21/9] max-h-48 w-full rounded-xl overflow-hidden border border-border shadow-xs bg-navy-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.bannerImage}
                        alt="Showroom Banner Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <label
                        htmlFor="settingsBannerUploadInput"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Change Photo from Device</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, bannerImage: "" })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-red-100 text-red-600 text-xs font-bold transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <label
                      htmlFor="settingsBannerUploadInput"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Banner from Device</span>
                    </label>
                    <p className="text-[11px] text-txt-secondary">
                      Recommended: 1200x500 or 1600x600 px (JPG, PNG, WEBP)
                    </p>
                  </div>
                )}
              </div>

              {/* URL input fallback */}
              <details className="group pt-0.5">
                <summary className="text-[11px] text-txt-secondary hover:text-navy-500 cursor-pointer select-none font-medium">
                  ▸ Or enter Banner Image URL directly instead
                </summary>
                <div className="pt-2">
                  <Input
                    placeholder="https://... or /uploads/..."
                    value={settings.bannerImage}
                    onChange={(e) => setSettings({ ...settings, bannerImage: e.target.value })}
                  />
                </div>
              </details>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="font-bold bg-[#C00000] hover:bg-[#A80000] text-white"
                isLoading={loading}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Store Contact Settings
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProductId ? "Edit Wholesale Product" : "Add New Wholesale Product"}
        size="2xl"
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

          {/* PRODUCT IMAGES UPLOAD SECTION */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-500">
                Product Images (Upload from Device) *
              </label>
              <span className="text-[11px] font-medium text-txt-secondary">
                {Array.isArray(productForm.images) ? productForm.images.length : 0} image(s) selected
              </span>
            </div>

            {/* UPLOAD DROPZONE / BUTTON */}
            <div className="border-2 border-dashed border-slate-300 hover:border-gold-500 rounded-xl p-4 text-center bg-slate-50/70 hover:bg-gold-50/20 transition-all">
              <input
                type="file"
                id="productImageDeviceUpload"
                accept="image/*"
                multiple
                onChange={handleProductImageUpload}
                className="hidden"
                disabled={uploadingProductImages}
              />

              {uploadingProductImages ? (
                <div className="py-4 flex flex-col items-center justify-center space-y-2 text-gold-600">
                  <RefreshCw className="w-7 h-7 animate-spin text-amber-600" />
                  <p className="text-xs font-bold font-poppins text-navy-500">
                    {productUploadProgress || "Uploading images from device..."}
                  </p>
                  <p className="text-[11px] text-txt-secondary">Processing image files, please wait...</p>
                </div>
              ) : (
                <label
                  htmlFor="productImageDeviceUpload"
                  className="cursor-pointer flex flex-col items-center justify-center py-2.5 space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-navy-500 hover:text-gold-600 underline">
                      Choose images from your device (Computer / Phone)
                    </span>
                    <span className="text-xs text-txt-secondary block mt-0.5">
                      Select one or multiple photos (JPG, PNG, WEBP — Max 10MB each)
                    </span>
                  </div>
                </label>
              )}
            </div>

            {/* PREVIEW THUMBNAILS GRID */}
            {Array.isArray(productForm.images) && productForm.images.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-txt-secondary flex items-center justify-between">
                  <span>Uploaded Images (First image is primary thumbnail)</span>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, images: [] })}
                    className="text-red-500 hover:text-red-700 text-[11px] underline"
                  >
                    Remove all
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-lg">
                  {productForm.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-lg overflow-hidden border-2 bg-slate-100 aspect-square shadow-xs ${
                        idx === 0 ? "border-gold-500 ring-2 ring-gold-400/40" : "border-slate-200"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Product image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Main / Primary Indicator */}
                      {idx === 0 ? (
                        <span className="absolute top-1 left-1 bg-gold-500 text-navy-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow">
                          ★ Main
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryProductImage(idx)}
                          className="absolute top-1 left-1 bg-black/60 hover:bg-gold-500 hover:text-navy-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Set as Main Thumbnail"
                        >
                          Set Main
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveProductImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OPTIONAL ADD VIA URL OPTION */}
            <div className="pt-0.5">
              {!showUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" /> Or add image by URL / paste link
                </button>
              ) : (
                <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <Input
                    placeholder="https://... or /uploads/..."
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    className="text-xs flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddProductImageUrl(newImageUrlInput)}
                    className="text-xs font-semibold whitespace-nowrap"
                  >
                    Add URL
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlInput(false);
                      setNewImageUrlInput("");
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 px-1"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

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

      {/* ADD / EDIT CATEGORY MODAL */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategoryId(null);
        }}
        title={editingCategoryId ? "Edit Wholesale Category" : "Add Wholesale Category"}
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

          {/* CATEGORY IMAGE UPLOAD SECTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-navy-500">
                Category Image (Upload from Device)
              </label>
              {categoryForm.image && (
                <span className="text-[11px] font-semibold text-emerald-600">✓ Image Attached</span>
              )}
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-[#C00000] rounded-xl p-4 text-center bg-slate-50/80 hover:bg-red-50/20 transition-all">
              <input
                type="file"
                id="categoryImageUploadInput"
                accept="image/*"
                onChange={handleCategoryFileUpload}
                className="hidden"
                disabled={uploadingCategoryImage}
              />

              {uploadingCategoryImage ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2 text-[#C00000]">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <p className="text-xs font-bold font-poppins">Uploading category image from device...</p>
                  <p className="text-[11px] text-txt-secondary">Please wait a moment...</p>
                </div>
              ) : categoryForm.image ? (
                <div className="space-y-3">
                  <div className="relative aspect-[16/9] max-h-48 w-full rounded-xl overflow-hidden border border-border shadow-xs bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={categoryForm.image}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                        ✓ Current Image
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <label
                      htmlFor="categoryImageUploadInput"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Change Photo from Device</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, image: "" })}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-red-100 text-red-600 text-xs font-bold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C00000] flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <label
                    htmlFor="categoryImageUploadInput"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C00000] hover:bg-[#A80000] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Category Image from Device</span>
                  </label>
                  <p className="text-[11px] text-txt-secondary">
                    Supports JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* URL input fallback */}
            <details className="group pt-0.5">
              <summary className="text-[11px] text-txt-secondary hover:text-navy-500 cursor-pointer select-none font-medium">
                ▸ Or enter Category Image URL directly instead
              </summary>
              <div className="pt-2">
                <Input
                  placeholder="https://... or /uploads/..."
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                />
              </div>
            </details>
          </div>

          <Textarea
            label="Category Description"
            rows={2}
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            placeholder="Bulk wholesale lots directly from Surat mills..."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setCategoryModalOpen(false);
                setEditingCategoryId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-[#C00000] hover:bg-[#A80000] text-white font-bold"
            >
              {editingCategoryId ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ADD / EDIT HERO & TRENDING BANNER MODAL */}
      <Modal
        isOpen={bannerModalOpen}
        onClose={() => setBannerModalOpen(false)}
        title={editingBannerId ? "Edit Promotional Banner" : "Add New Promotional Banner"}
        size="2xl"
      >
        <form onSubmit={handleSaveBanner} className="space-y-4 pt-2">
          {/* Placement and Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Banner Placement / Slider *"
              value={bannerForm.type || "hero"}
              onChange={(e) => setBannerForm({ ...bannerForm, type: e.target.value })}
            >
              <option value="hero">Top Hero Carousel (Main Homepage Slider)</option>
              <option value="trending">Trending Now Slider (Middle Strip)</option>
            </Select>

            <Input
              label="Display Order (Slide Number)"
              type="number"
              value={bannerForm.order}
              onChange={(e) => setBannerForm({ ...bannerForm, order: e.target.value })}
              placeholder="1"
            />
          </div>

          {/* CATEGORY REDIRECT DROPDOWN (Click Destination) */}
          <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#C00000] flex items-center justify-center font-bold">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-500">
                  Banner Click Redirect (Category Selection) *
                </label>
                <span className="text-[11px] text-txt-secondary">
                  Customer is banner par click karega to kis category ya page par redirect hoga
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Select
                label="Choose Category / Destination *"
                value={
                  categories.some((c) => `/products?category=${c.slug}` === bannerForm.link)
                    ? bannerForm.link
                    : bannerForm.link === "/products" || !bannerForm.link
                    ? "/products"
                    : "custom"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "custom") {
                    setBannerForm({ ...bannerForm, link: val });
                  }
                }}
              >
                <option value="/products">🛒 All Products (/products)</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.slug} value={`/products?category=${cat.slug}`}>
                    📁 {cat.name} (/products?category={cat.slug})
                  </option>
                ))}
                <option value="custom">🔗 Custom Link / External URL</option>
              </Select>

              <Input
                label="Target Link / URL *"
                value={bannerForm.link || ""}
                onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                placeholder="/products?category=sarees"
                helperText="Category chunne par ye link apne aap set ho jayega"
              />
            </div>
          </div>

          {/* DUAL BANNER UPLOAD: 1. DESKTOP & 2. MOBILE SEPARATE FIELDS (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">

            {/* FIELD 1: DESKTOP BANNER IMAGE */}
            <div className="p-4 rounded-2xl border-2 border-slate-200 bg-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy-500">
                      1. Desktop Banner Image *
                    </label>
                    <span className="text-[11px] text-txt-secondary">
                      Computer / Laptop screen (Recommended: Landscape 21:9 or 16:9)
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wide">
                  Desktop Only (md+)
                </span>
              </div>

              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50/80 hover:bg-blue-50/20 transition-all">
                <input
                  type="file"
                  id="bannerDeviceUploadInputDesktop"
                  accept="image/*"
                  onChange={(e) => handleBannerFileUpload(e, "image")}
                  className="hidden"
                  disabled={uploadingBannerImage}
                />

                {uploadingBannerImage ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2 text-blue-600">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p className="text-xs font-bold font-poppins">Uploading desktop image from device...</p>
                    <p className="text-[11px] text-txt-secondary">Please wait a moment...</p>
                  </div>
                ) : bannerForm.image ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-border shadow-xs bg-navy-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerForm.image}
                        alt="Desktop Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-bold shadow-xs">
                          ✓ Desktop Ready
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <label
                        htmlFor="bannerDeviceUploadInputDesktop"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Change Desktop Photo</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, image: "" })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-red-100 text-red-600 text-xs font-bold transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <label
                      htmlFor="bannerDeviceUploadInputDesktop"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Desktop Image from Device</span>
                    </label>
                    <p className="text-[11px] text-txt-secondary">
                      Wide landscape format (e.g. 1920x800 or 1600x600 px)
                    </p>
                  </div>
                )}
              </div>

              {/* URL input fallback for desktop */}
              <details className="group">
                <summary className="text-[11px] text-txt-secondary hover:text-navy-500 cursor-pointer select-none font-medium">
                  ▸ Or enter Desktop Image URL directly instead
                </summary>
                <div className="pt-2">
                  <Input
                    placeholder="https://... or /images/..."
                    value={bannerForm.image}
                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  />
                </div>
              </details>
            </div>

            {/* FIELD 2: MOBILE BANNER IMAGE */}
            <div className="p-4 rounded-2xl border-2 border-slate-200 bg-white space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy-500">
                      2. Mobile Banner Image (Phone Screen)
                    </label>
                    <span className="text-[11px] text-txt-secondary">
                      Mobile phones only (Recommended: Vertical / Square 9:16, 4:5 or 1:1)
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Mobile Only (&lt; 768px)
                </span>
              </div>

              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 text-center bg-slate-50/80 hover:bg-emerald-50/20 transition-all">
                <input
                  type="file"
                  id="bannerDeviceUploadInputMobile"
                  accept="image/*"
                  onChange={(e) => handleBannerFileUpload(e, "mobileImage")}
                  className="hidden"
                  disabled={uploadingMobileBannerImage}
                />

                {uploadingMobileBannerImage ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2 text-emerald-600">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <p className="text-xs font-bold font-poppins">Uploading mobile image from device...</p>
                    <p className="text-[11px] text-txt-secondary">Please wait a moment...</p>
                  </div>
                ) : bannerForm.mobileImage ? (
                  <div className="space-y-3">
                    <div className="relative max-w-xs mx-auto aspect-[4/5] sm:aspect-[9/16] max-h-64 w-full rounded-xl overflow-hidden border border-border shadow-xs bg-navy-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerForm.mobileImage}
                        alt="Mobile Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                          ✓ Mobile Ready
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <label
                        htmlFor="bannerDeviceUploadInputMobile"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Change Mobile Photo</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, mobileImage: "" })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-red-100 text-red-600 text-xs font-bold transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <label
                      htmlFor="bannerDeviceUploadInputMobile"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Mobile Image from Device</span>
                    </label>
                    <p className="text-[11px] text-txt-secondary">
                      Select vertical or square photo (e.g. 1080x1350 or 1080x1080 px)
                    </p>
                  </div>
                )}
              </div>

              {/* URL input fallback for mobile */}
              <details className="group">
                <summary className="text-[11px] text-txt-secondary hover:text-navy-500 cursor-pointer select-none font-medium">
                  ▸ Or enter Mobile Image URL directly instead
                </summary>
                <div className="pt-2">
                  <Input
                    placeholder="https://... or /images/..."
                    value={bannerForm.mobileImage}
                    onChange={(e) => setBannerForm({ ...bannerForm, mobileImage: e.target.value })}
                  />
                </div>
              </details>
            </div>
          </div>



          {/* ACTIVE TOGGLE */}
          <div className="flex items-center gap-2 pt-1 pb-1">
            <input
              type="checkbox"
              id="bannerActiveCheckbox"
              checked={bannerForm.active}
              onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
              className="w-4 h-4 rounded text-[#C00000] focus:ring-[#C00000]"
            />
            <label htmlFor="bannerActiveCheckbox" className="text-xs font-bold text-navy-500 cursor-pointer">
              Active (Visible on homepage)
            </label>
          </div>



          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setBannerModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-[#C00000] hover:bg-[#A80000] text-white font-bold font-poppins"
              isLoading={loading}
              disabled={uploadingBannerImage}
            >
              {editingBannerId ? "Update Banner" : "Add Banner"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ADD / EDIT CUSTOMER REVIEW MODAL */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={editingReviewId ? "Edit Customer Review" : "Add New Customer Review"}
        size="md"
      >
        <form onSubmit={handleSaveReview} className="space-y-4 pt-2">
          <Input
            label="Customer / Buyer Name *"
            value={reviewForm.name}
            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
            placeholder="e.g. Rajesh Sharma"
            required
          />

          <Input
            label="Shop / Business Name & City"
            value={reviewForm.business}
            onChange={(e) => setReviewForm({ ...reviewForm, business: e.target.value })}
            placeholder="e.g. Sharma Saree Showroom, Patna, Bihar"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Rating (Stars) *"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
            >
              <option value={5}>5.0 Stars (★★★★★)</option>
              <option value={4}>4.0 Stars (★★★★☆)</option>
              <option value={3}>3.0 Stars (★★★☆☆)</option>
            </Select>

            <Input
              label="Time / Verification Tag"
              value={reviewForm.time}
              onChange={(e) => setReviewForm({ ...reviewForm, time: e.target.value })}
              placeholder="e.g. 2 days ago / Verified Buyer"
            />
          </div>

          <Textarea
            label="Review Text *"
            rows={3}
            value={reviewForm.text}
            onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
            placeholder="Write the customer feedback or testimonial..."
            required
          />

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-500">
              <input
                type="checkbox"
                checked={reviewForm.isLocalGuide}
                onChange={(e) => setReviewForm({ ...reviewForm, isLocalGuide: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span>★ Google Local Guide Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-500">
              <input
                type="checkbox"
                checked={reviewForm.active}
                onChange={(e) => setReviewForm({ ...reviewForm, active: e.target.checked })}
                className="w-4 h-4 rounded text-[#C00000] focus:ring-[#C00000]"
              />
              <span>Visible on Website</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-[#C00000] hover:bg-[#A80000] text-white font-bold"
              isLoading={loading}
            >
              {editingReviewId ? "Update Review" : "Save Review"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
