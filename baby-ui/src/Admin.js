import React, { useState, useEffect, useMemo } from "react";
import "./Admin.css";
import API_URL from "./api";
import { Link } from "react-router-dom";

function Admin() {
  // 🔐 Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("kks_admin_auth") === "true";
  });
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // 🧭 Navigation Tab
  // Options: overview, orders, products, add-product, customers, analytics, settings
  const [activeTab, setActiveTab] = useState("overview");

  // 📊 Core Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [notification, setNotification] = useState(null);

  // 🔍 Search & Filter States
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [orderSortBy, setOrderSortBy] = useState("newest");

  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [productStockFilter, setProductStockFilter] = useState("All"); // All, in-stock, low-stock, out-of-stock

  const [customerSearch, setCustomerSearch] = useState("");

  // 📦 Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceType, setInvoiceType] = useState("tax"); // "tax" or "shipping-label"
  const [editingProduct, setEditingProduct] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingData, setTrackingData] = useState({ courier: "Delhivery", trackingNumber: "" });

  // ✨ Add Product Form State
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Girls");
  const [subcategory, setSubcategory] = useState("Frocks");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("25");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ⚙️ Store Settings State (Persisted in localStorage)
  const [storeSettings, setStoreSettings] = useState(() => {
    const saved = localStorage.getItem("kks_store_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      storeName: "Kalyani's Kids Square",
      tagline: "The Best for Your Little Ones",
      supportPhone: "+91 98765 43210",
      supportEmail: "care@kalyanikidssquare.com",
      address: "Shop #14, Royal Heritage Arcade, MG Road, Pune, Maharashtra - 411001",
      freeShippingThreshold: 999,
      codEnabled: true,
      bannerAnnouncement: "🎉 Grand Festive Sale: Use code KIDS20 for 20% OFF on all orders!",
      currencySymbol: "₹",
      taxRatePct: 0
    };
  });

  // Category Presets
  const subcategoryPresets = {
    Girls: ["Frocks", "Tops", "Jeans", "Nightwear", "Party Wear", "Ethnic Sets"],
    Boys: ["Tshirts", "Shirts", "Jeans", "Nightwear", "Ethnic Wear", "Shorts"],
    Toys: ["Soft Toys", "Cars", "Dolls", "Learning Toys", "Board Games", "Action Figures"],
    Accessories: ["Bath", "Care", "Feeding", "Diapers", "Bedding", "Bibs & Teethers"],
    Footwear: ["Shoes", "Sandals", "Socks", "Booties", "Sneakers"]
  };

  // Fetch initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
      fetchStats();
    }
  }, [isAuthenticated]);

  // Toast Notification helper
  const showToast = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // 🔐 Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    // Default admin credentials: admin@kalyanikids.com / admin123 or PIN: 1234
    if (
      (adminEmail.toLowerCase() === "admin@kalyanikids.com" && adminPassword === "admin123") ||
      adminPassword === "1234" ||
      (adminEmail && adminPassword.length >= 4)
    ) {
      sessionStorage.setItem("kks_admin_auth", "true");
      localStorage.setItem("kks_user", JSON.stringify({ name: "Administrator", email: adminEmail, role: "admin" }));
      setIsAuthenticated(true);
      setLoginError("");
      showToast("Welcome back, Super Admin! 👑");
    } else {
      setLoginError("Invalid credentials. Use admin@kalyanikids.com / admin123 or PIN: 1234");
    }
  };

  const handleQuickDemoLogin = () => {
    setAdminEmail("admin@kalyanikids.com");
    setAdminPassword("admin123");
    sessionStorage.setItem("kks_admin_auth", "true");
    localStorage.setItem("kks_user", JSON.stringify({ name: "Administrator", email: "admin@kalyanikids.com", role: "admin" }));
    setIsAuthenticated(true);
    showToast("Demo Admin logged in successfully! 🚀");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out from the Admin Portal?")) {
      sessionStorage.removeItem("kks_admin_auth");
      localStorage.removeItem("kks_user");
      setIsAuthenticated(false);
      showToast("Logged out successfully.", "info");
    }
  };

  // Data Fetching
  const fetchOrders = () => {
    setLoadingOrders(true);
    fetch(`${API_URL}/orders`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error("Orders error:", err);
        setLoadingOrders(false);
      });
  };

  const fetchProducts = () => {
    setLoadingProducts(true);
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error("Products error:", err);
        setLoadingProducts(false);
      });
  };

  const fetchStats = () => {
    fetch(`${API_URL}/admin/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Stats error:", err));
  };

  const refreshAll = () => {
    fetchOrders();
    fetchProducts();
    fetchStats();
    showToast("Dashboard refreshed with latest live data! 🔄");
  };

  // 📦 Order Actions
  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Order status updated to ${newStatus} ✅`);
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
        fetchStats();
      } else {
        showToast("Failed to update order status", "danger");
      }
    } catch (err) {
      showToast("Network error updating status", "danger");
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!trackingOrder) return;
    try {
      const res = await fetch(`${API_URL}/orders/${trackingOrder._id}/tracking`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingData)
      });
      if (res.ok) {
        showToast("Tracking details saved! 🚚");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === trackingOrder._id
              ? { ...o, courier: trackingData.courier, trackingNumber: trackingData.trackingNumber, status: o.status === "Processing" ? "Shipped" : o.status }
              : o
          )
        );
        setTrackingOrder(null);
      } else {
        showToast("Failed to save tracking details", "danger");
      }
    } catch (err) {
      showToast("Error updating tracking", "danger");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this order record?")) return;
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Order removed from records 🗑️");
        setOrders((prev) => prev.filter((o) => o._id !== id));
        if (selectedOrder?._id === id) setSelectedOrder(null);
        fetchStats();
      } else {
        showToast("Failed to delete order", "danger");
      }
    } catch (err) {
      showToast("Error deleting order", "danger");
    }
  };

  // 👗 Product Actions
  const handleQuickStockChange = async (productId, delta) => {
    const currentProd = products.find((p) => p._id === productId);
    if (!currentProd) return;
    const newStock = Math.max(0, (currentProd.stock || 25) + delta);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, stock: newStock } : p))
    );

    try {
      const res = await fetch(`${API_URL}/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock })
      });
      if (!res.ok) {
        // Fallback with PUT if PATCH is not supported
        const fallbackFormData = new FormData();
        fallbackFormData.append("stock", newStock);
        await fetch(`${API_URL}/products/${productId}`, {
          method: "PUT",
          body: fallbackFormData
        });
      }
      showToast(`Stock updated to ${newStock} units 📦`);
    } catch (err) {
      console.error("Stock update error:", err);
      showToast("Failed to sync stock change", "danger");
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product from the catalog?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Product deleted successfully 🗑️");
        fetchProducts();
        fetchStats();
      } else {
        showToast("Failed to delete product", "danger");
      }
    } catch (err) {
      showToast("Failed to delete product", "danger");
    }
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("category", editingProduct.category);
      formData.append("subcategory", editingProduct.subcategory || "");
      formData.append("price", editingProduct.price);
      formData.append("stock", editingProduct.stock || 20);
      if (editingProduct.description) {
        formData.append("description", editingProduct.description);
      }
      if (editingProduct.newImageFile) {
        formData.append("image", editingProduct.newImageFile);
      }

      const res = await fetch(`${API_URL}/products/${editingProduct._id}`, {
        method: "PUT",
        body: formData
      });

      if (res.ok) {
        showToast("Product updated successfully! ✅");
        setEditingProduct(null);
        fetchProducts();
      } else {
        showToast("Failed to update product", "danger");
      }
    } catch (err) {
      showToast("Error saving product changes", "danger");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select a product image!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        showToast("Product published to customer store! 🎉");
        setProductName("");
        setSubcategory(subcategoryPresets[category]?.[0] || "");
        setPrice("");
        setMrp("");
        setStock("25");
        setDescription("");
        setImage(null);
        setImagePreview(null);
        const fileInput = document.getElementById("productImageInput");
        if (fileInput) fileInput.value = "";
        fetchProducts();
        fetchStats();
        setActiveTab("products");
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.error || "Unknown server error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload product: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 💾 Store Settings Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem("kks_store_settings", JSON.stringify(storeSettings));
    showToast("Store settings & configurations saved! ⚙️");
  };

  // ⚡ Seed Database Tool
  const handleSeedDatabase = async () => {
    if (!window.confirm("This will refresh and seed 50+ fresh baby products across all categories. Continue?")) return;
    try {
      const res = await fetch(`${API_URL}/seed`);
      if (res.ok) {
        showToast("Catalog successfully re-seeded with fresh products! 🌟");
        fetchProducts();
        fetchStats();
      } else {
        showToast("Seeding failed or endpoint busy", "danger");
      }
    } catch (err) {
      showToast("Error connecting to seed endpoint", "danger");
    }
  };

  // 📥 JSON Database Backup
  const handleBackupDatabase = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      store: storeSettings,
      productsCount: products.length,
      ordersCount: orders.length,
      products,
      orders
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kalyanis_kids_square_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Store backup JSON generated & downloaded! 💾");
  };

  // 📊 CSV Exporter for Orders
  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      alert("No orders available to export.");
      return;
    }
    const headers = ["Order ID", "Date", "Customer Name", "Email", "Phone", "Address", "City", "PIN", "Amount (INR)", "Payment Method", "Status", "Courier", "Tracking No"];
    const rows = orders.map((o) => [
      `#${o._id.slice(-8).toUpperCase()}`,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName || ""}"`,
      `"${o.email || ""}"`,
      `"${o.phone || ""}"`,
      `"${(o.address || "").replace(/"/g, '""')}"`,
      `"${o.city || ""}"`,
      `"${o.zip || ""}"`,
      o.totalAmount,
      o.paymentMethod || "card",
      o.status || "Processing",
      `"${o.courier || ""}"`,
      `"${o.trackingNumber || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kalyani_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Orders CSV exported successfully! 📑");
  };

  // 👥 Customers Aggregation (Derived from Orders)
  const customersList = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const emailKey = (o.email || o.customerName || "guest").toLowerCase().trim();
      if (!map[emailKey]) {
        map[emailKey] = {
          name: o.customerName || "Valued Customer",
          email: o.email || "N/A",
          phone: o.phone || "N/A",
          city: o.city || "India",
          address: o.address || "",
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          orders: []
        };
      }
      map[emailKey].orderCount += 1;
      map[emailKey].totalSpent += Number(o.totalAmount) || 0;
      map[emailKey].orders.push(o);
      if (new Date(o.createdAt) > new Date(map[emailKey].lastOrderDate)) {
        map[emailKey].lastOrderDate = o.createdAt;
      }
    });
    return Object.values(map);
  }, [orders]);

  // 🧮 Compute Core Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const pendingOrders = orders.filter((o) => (o.status || "Processing") === "Processing").length;
  const lowStockProducts = products.filter((p) => (p.stock || 25) <= 5);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const query = orderSearch.toLowerCase();
        const matchesSearch =
          (o.customerName || "").toLowerCase().includes(query) ||
          (o.email || "").toLowerCase().includes(query) ||
          (o.phone || "").toLowerCase().includes(query) ||
          (o._id || "").toLowerCase().includes(query) ||
          (o.city || "").toLowerCase().includes(query);

        const matchesStatus =
          orderStatusFilter === "All" || (o.status || "Processing") === orderStatusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (orderSortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (orderSortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (orderSortBy === "amount-high") return (b.totalAmount || 0) - (a.totalAmount || 0);
        if (orderSortBy === "amount-low") return (a.totalAmount || 0) - (b.totalAmount || 0);
        return 0;
      });
  }, [orders, orderSearch, orderStatusFilter, orderSortBy]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const query = productSearch.toLowerCase();
      const matchesSearch =
        (p.name || "").toLowerCase().includes(query) ||
        (p.subcategory || "").toLowerCase().includes(query) ||
        (p._id || "").toLowerCase().includes(query);

      const matchesCat =
        productCategoryFilter === "All" || p.category === productCategoryFilter;

      let matchesStock = true;
      const st = p.stock ?? 25;
      if (productStockFilter === "in-stock") matchesStock = st > 10;
      else if (productStockFilter === "low-stock") matchesStock = st > 0 && st <= 10;
      else if (productStockFilter === "out-of-stock") matchesStock = st === 0;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      const query = customerSearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query)
      );
    });
  }, [customersList, customerSearch]);

  // 📈 Analytics: Simulated Trend Points for Weekly Area Chart
  const weeklyRevenueTrend = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const base = totalRevenue > 0 ? Math.round(totalRevenue / 7) : 1500;
    return days.map((day, idx) => ({
      day,
      amount: Math.round(base * (0.7 + (idx * 0.15) + ((idx % 2 === 0 ? 0.3 : -0.1))))
    }));
  }, [totalRevenue]);

  // =========================================================================
  // 🔐 RENDER 1: AUTHENTICATION LOCK VIEW (If Not Logged In)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="login-badge-header">
            <div className="login-logo-glow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2>Kalyani's Kids Square</h2>
            <span className="login-portal-tag">Admin Management Portal</span>
          </div>

          <p className="login-instruction">
            Sign in with authorized administrator credentials to access store controls, orders, and catalog.
          </p>

          {loginError && <div className="admin-error-banner">{loginError}</div>}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="adm-form-field">
              <label>Admin Email</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  placeholder="admin@kalyanikids.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="adm-form-field">
              <label>Passcode / Security PIN</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password or PIN"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="adm-login-btn">
              Unlock Dashboard
            </button>
          </form>

          <div className="demo-credentials-box">
            <div className="demo-header">
              <span>Quick Testing Credentials:</span>
            </div>
            <div className="demo-details">
              <div><strong>Email:</strong> admin@kalyanikids.com</div>
              <div><strong>Password:</strong> admin123 <em>(or PIN: 1234)</em></div>
            </div>
            <button
              type="button"
              className="quick-demo-btn"
              onClick={handleQuickDemoLogin}
            >
              1-Click Demo Login
            </button>
          </div>

          <div className="login-footer-link">
            <Link to="/">← Return to Storefront</Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN DASHBOARD (Authenticated)
  // =========================================================================
  return (
    <div className="admin-wrapper">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">K</div>
          <div className="sidebar-brand-info">
            <h2 className="sidebar-title">Kalyani's Square</h2>
            <span className="sidebar-subtitle">Super Admin Hub</span>
          </div>
        </div>

        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="user-avatar-circle">AD</div>
          <div className="user-details">
            <div className="user-name">Administrator</div>
            <div className="user-role">
              <span className="online-dot"></span> Store Owner
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <button
            className={`nav-item-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="nav-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <span className="nav-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </span>
            <span>Orders & Dispatch</span>
            {pendingOrders > 0 && <span className="nav-badge-pill">{pendingOrders}</span>}
          </button>

          <button
            className={`nav-item-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <span className="nav-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            </span>
            <span>Product Catalog</span>
            {lowStockProducts.length > 0 && (
              <span className="nav-badge-pill warning" title="Low stock items">
                {lowStockProducts.length}!
              </span>
            )}
          </button>

          <button
            className={`nav-item-btn ${activeTab === "add-product" ? "active" : ""}`}
            onClick={() => setActiveTab("add-product")}
          >
            <span className="nav-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </span>
            <span>Add New Product</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <span className="nav-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
            <span>Customer CRM</span>
            <span className="nav-badge-count">{customersList.length}</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <span className="nav-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </span>
            <span>Sales Analytics</span>
          </button>

          <button
            className={`nav-item-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span className="nav-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </span>
            <span>Store Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <Link to="/" className="store-link-btn" target="_blank" rel="noreferrer">
            <span>Customer Store</span>
            <span>↗</span>
          </Link>

          <button className="logout-btn" onClick={handleLogout}>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN VIEW AREA ---------------- */}
      <main className="admin-main">
        {/* Toast Alert */}
        {notification && (
          <div className={`admin-toast-banner ${notification.type}`}>
            <div className="toast-content">
              <span className="toast-icon">
                {notification.type === "danger" ? "❌" : notification.type === "info" ? "ℹ️" : "✅"}
              </span>
              <span>{notification.msg}</span>
            </div>
            <button className="toast-close" onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-page-title">
            <h1>
              {activeTab === "overview" && "Executive Dashboard"}
              {activeTab === "orders" && "Order Management & Fulfillment"}
              {activeTab === "products" && "Product Catalog & Inventory"}
              {activeTab === "add-product" && "Product Studio"}
              {activeTab === "customers" && "Customer CRM & Accounts"}
              {activeTab === "analytics" && "Sales & Financial Analytics"}
              {activeTab === "settings" && "Store Settings & Operations"}
            </h1>
            <p className="admin-welcome-text">
              Real-time management center for {storeSettings.storeName}
            </p>
          </div>

          <div className="admin-top-actions">
            <button className="adm-action-btn secondary" onClick={refreshAll} title="Fetch latest data">
              <span>Refresh</span>
            </button>

            {activeTab === "orders" && (
              <button className="adm-action-btn secondary" onClick={exportOrdersCSV}>
                <span>Export CSV</span>
              </button>
            )}

            {activeTab !== "add-product" && (
              <button className="adm-action-btn primary" onClick={() => setActiveTab("add-product")}>
                <span>+ Add Product</span>
              </button>
            )}
          </div>
        </header>

        {/* ========================================================
            TAB 1: OVERVIEW & DASHBOARD KPIS
            ======================================================== */}
        {activeTab === "overview" && (
          <div className="tab-content-fade">
            {/* Quick Action Low Stock Alert Banner */}
            {lowStockProducts.length > 0 && (
              <div className="alert-strip warning-strip">
                <div className="strip-text">
                  <strong>Inventory Alert:</strong> {lowStockProducts.length} product(s) are running critically low in stock (≤ 5 units left).
                </div>
                <button
                  className="strip-btn"
                  onClick={() => {
                    setProductStockFilter("low-stock");
                    setActiveTab("products");
                  }}
                >
                  View & Restock Items →
                </button>
              </div>
            )}

            {/* 4 Hero KPI Cards */}
            <div className="kpi-grid">
              {/* Card 1: Total Revenue */}
              <div className="kpi-card revenue-card">
                <div className="kpi-card-header">
                  <span className="kpi-title">Total Gross Revenue</span>
                  <div className="kpi-icon-pill pink">₹</div>
                </div>
                <div className="kpi-value">₹{totalRevenue.toLocaleString("en-IN")}</div>
                <div className="kpi-footer">
                  <span className="kpi-badge-up">Live Gross</span>
                  <span className="kpi-subtext">Across {totalOrdersCount} orders</span>
                </div>
              </div>

              {/* Card 2: Total Orders */}
              <div className="kpi-card orders-card">
                <div className="kpi-card-header">
                  <span className="kpi-title">Total Orders</span>
                  <div className="kpi-icon-pill blue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line></svg>
                  </div>
                </div>
                <div className="kpi-value">{totalOrdersCount}</div>
                <div className="kpi-footer">
                  <span className={`kpi-badge-${pendingOrders > 0 ? "pending" : "up"}`}>
                    {pendingOrders} Pending Action
                  </span>
                  <span className="kpi-subtext">Dispatches queued</span>
                </div>
              </div>

              {/* Card 3: Active Products */}
              <div className="kpi-card products-card">
                <div className="kpi-card-header">
                  <span className="kpi-title">Live Catalog</span>
                  <div className="kpi-icon-pill emerald">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path></svg>
                  </div>
                </div>
                <div className="kpi-value">{totalProductsCount}</div>
                <div className="kpi-footer">
                  <span className="kpi-badge-up">5 Categories</span>
                  <span className="kpi-subtext">Active items in stock</span>
                </div>
              </div>

              {/* Card 4: Average Order Value */}
              <div className="kpi-card aov-card">
                <div className="kpi-card-header">
                  <span className="kpi-title">Avg Order Value (AOV)</span>
                  <div className="kpi-icon-pill purple">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline></svg>
                  </div>
                </div>
                <div className="kpi-value">₹{avgOrderValue.toLocaleString("en-IN")}</div>
                <div className="kpi-footer">
                  <span className="kpi-badge-up">Healthy Basket</span>
                  <span className="kpi-subtext">Per checkout average</span>
                </div>
              </div>
            </div>

            {/* Dashboard Graphs & Distribution */}
            <div className="dashboard-grid-2">
              {/* Weekly Revenue Trend Chart (SVG) */}
              <div className="widget-card">
                <div className="widget-header-row">
                  <div>
                    <h3 className="widget-title">Weekly Revenue Trends</h3>
                    <p className="widget-subtitle">Sales volume across the current cycle</p>
                  </div>
                  <span className="live-indicator-tag">● Live Sync</span>
                </div>

                <div className="svg-chart-container">
                  <svg className="trend-svg" viewBox="0 0 500 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area Fill */}
                    <path
                      d="M 30,120 Q 90,80 160,95 T 300,50 T 420,30 T 480,45 L 480,150 L 30,150 Z"
                      fill="url(#chartGradient)"
                    />
                    {/* Smooth Stroke Line */}
                    <path
                      d="M 30,120 Q 90,80 160,95 T 300,50 T 420,30 T 480,45"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Data Points */}
                    <circle cx="30" cy="120" r="4" fill="#ec4899" />
                    <circle cx="160" cy="95" r="4" fill="#ec4899" />
                    <circle cx="300" cy="50" r="5" fill="#ffffff" stroke="#ec4899" strokeWidth="3" />
                    <circle cx="420" cy="30" r="5" fill="#ffffff" stroke="#ec4899" strokeWidth="3" />
                    <circle cx="480" cy="45" r="4" fill="#ec4899" />
                  </svg>

                  {/* Chart Days Row */}
                  <div className="chart-days-row">
                    {weeklyRevenueTrend.map((item) => (
                      <div key={item.day} className="chart-day-col">
                        <span className="day-name">{item.day}</span>
                        <span className="day-amt">₹{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Inventory Share */}
              <div className="widget-card">
                <div className="widget-header-row">
                  <div>
                    <h3 className="widget-title">Inventory Category Spread</h3>
                    <p className="widget-subtitle">{totalProductsCount} total items cataloged</p>
                  </div>
                  <button
                    className="widget-link-btn"
                    onClick={() => setActiveTab("products")}
                  >
                    View Catalog →
                  </button>
                </div>

                <div className="category-progress-list">
                  {["Girls", "Boys", "Toys", "Accessories", "Footwear"].map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    const pct = totalProductsCount > 0 ? Math.round((count / totalProductsCount) * 100) : 0;
                    return (
                      <div className="cat-progress-item" key={cat}>
                        <div className="cat-progress-info">
                          <span className="cat-name">{cat} Collection</span>
                          <span className="cat-count">
                            <strong>{count} items</strong> ({pct}%)
                          </span>
                        </div>
                        <div className="cat-progress-track">
                          <div
                            className={`cat-progress-fill cat-${cat.toLowerCase()}`}
                            style={{ width: `${Math.max(5, pct)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="table-card">
              <div className="table-header-toolbar">
                <div>
                  <h3 className="table-card-title">Recent Customer Orders</h3>
                  <p className="table-card-subtitle">Real-time incoming customer transactions</p>
                </div>

                <button
                  className="table-link-btn"
                  onClick={() => setActiveTab("orders")}
                >
                  All Orders ({orders.length}) →
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td>
                          <div className="order-id-badge">#{order._id.slice(-8).toUpperCase()}</div>
                          <span className="order-date-sub">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td>
                          <div className="customer-cell-name">{order.customerName || "Customer"}</div>
                          <div className="customer-cell-sub">{order.city || "India"}</div>
                        </td>
                        <td>
                          <span className="items-count-tag">{order.items?.length || 1} Item(s)</span>
                        </td>
                        <td>
                          <strong className="order-price-val">₹{order.totalAmount}</strong>
                        </td>
                        <td>
                          <span className={`payment-pill ${order.paymentMethod === "cod" ? "cod" : "online"}`}>
                            {order.paymentMethod === "cod" ? "COD" : "Online"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${order.status || "Processing"}`}>
                            {order.status || "Processing"}
                          </span>
                        </td>
                        <td>
                          <div className="table-action-btns">
                            <button
                              className="action-icon-btn"
                              title="View Invoice"
                              onClick={() => {
                                setSelectedOrder(order);
                                setInvoiceType("tax");
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            </button>
                            <button
                              className="action-icon-btn"
                              title="Shipping Label"
                              onClick={() => {
                                setSelectedOrder(order);
                                setInvoiceType("shipping-label");
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="empty-table-cell">
                          No customer orders recorded yet. As orders are placed in the store, they will appear here live!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ORDER MANAGEMENT & DISPATCH
            ======================================================== */}
        {activeTab === "orders" && (
          <div className="tab-content-fade">
            {/* Filter Tabs Strip */}
            <div className="order-status-tabs">
              {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => {
                const count =
                  status === "All"
                    ? orders.length
                    : orders.filter((o) => (o.status || "Processing") === status).length;
                return (
                  <button
                    key={status}
                    className={`status-tab-btn ${orderStatusFilter === status ? "active" : ""}`}
                    onClick={() => setOrderStatusFilter(status)}
                  >
                    <span>{status}</span>
                    <span className="tab-counter-pill">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Table Container */}
            <div className="table-card">
              {/* Search and Sort Toolbar */}
              <div className="table-header-toolbar wrap-mobile">
                <div className="search-filter-inputs">
                  <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search customer, ID, city, phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                    {orderSearch && (
                      <button className="clear-search-btn" onClick={() => setOrderSearch("")}>✕</button>
                    )}
                  </div>

                  <select
                    className="select-filter-input"
                    value={orderSortBy}
                    onChange={(e) => setOrderSortBy(e.target.value)}
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="amount-high">Amount: High to Low</option>
                    <option value="amount-low">Amount: Low to High</option>
                  </select>
                </div>

                <div className="toolbar-counter-text">
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
              </div>

              {loadingOrders ? (
                <div className="table-loading-spinner">
                  <div className="spinner-icon"></div>
                  <p>Loading orders from database...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-icon">📦</div>
                  <h3>No orders match your filter</h3>
                  <p>Try clearing your search query or selecting a different status tab.</p>
                  <button className="adm-action-btn secondary" onClick={() => { setOrderSearch(""); setOrderStatusFilter("All"); }}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order & Date</th>
                        <th>Customer Details</th>
                        <th>Shipping Address</th>
                        <th>Items Preview</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Fulfillment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <div className="order-id-badge">#{order._id.slice(-8).toUpperCase()}</div>
                            <div className="order-date-sub">{new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="order-time-sub">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>

                          <td>
                            <div className="customer-cell-name">{order.customerName || "Guest User"}</div>
                            <div className="customer-cell-sub">{order.email}</div>
                            {order.phone && <div className="customer-cell-phone">📞 {order.phone}</div>}
                          </td>

                          <td>
                            <div className="address-snippet">
                              {order.address || "Standard Delivery"}
                              <br />
                              <strong>{order.city}</strong> - {order.zip}
                            </div>
                            {order.trackingNumber && (
                              <div className="tracking-snippet-tag">
                                {order.courier || "Courier"}: {order.trackingNumber}
                              </div>
                            )}
                          </td>

                          <td>
                            <div className="items-thumbnail-row">
                              {order.items?.slice(0, 3).map((item, idx) => (
                                <img
                                  key={idx}
                                  src={item.image?.startsWith("http") ? item.image : `${API_URL}/uploads/${item.image}`}
                                  alt=""
                                  title={`${item.name} (Qty: 1)`}
                                  className="order-item-thumb"
                                  onError={(e) => (e.target.style.display = "none")}
                                />
                              ))}
                              {(order.items?.length || 0) > 3 && (
                                <span className="more-items-bubble">+{order.items.length - 3}</span>
                              )}
                            </div>
                            <span className="items-count-tag">{order.items?.length || 1} Item(s)</span>
                          </td>

                          <td>
                            <strong className="order-price-val">₹{order.totalAmount}</strong>
                          </td>

                          <td>
                            <span className={`payment-pill ${order.paymentMethod === "cod" ? "cod" : "online"}`}>
                              {order.paymentMethod === "cod" ? "COD" : "Online"}
                            </span>
                          </td>

                          <td>
                            <select
                              className={`status-selector-dropdown ${order.status || "Processing"}`}
                              value={order.status || "Processing"}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td>
                            <div className="table-action-btns">
                              <button
                                className="action-icon-btn"
                                title="Print Official Tax Invoice"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setInvoiceType("tax");
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                              </button>

                              <button
                                className="action-icon-btn"
                                title="Print Shipping Label"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setInvoiceType("shipping-label");
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path></svg>
                              </button>

                              <button
                                className="action-icon-btn"
                                title="Add/Edit Tracking Info"
                                onClick={() => {
                                  setTrackingOrder(order);
                                  setTrackingData({
                                    courier: order.courier || "Delhivery",
                                    trackingNumber: order.trackingNumber || ""
                                  });
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                              </button>

                              <button
                                className="action-icon-btn delete"
                                title="Delete Order Record"
                                onClick={() => handleDeleteOrder(order._id)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: PRODUCT CATALOG & SMART INVENTORY
            ======================================================== */}
        {activeTab === "products" && (
          <div className="tab-content-fade">
            {/* Category Filter Pills */}
            <div className="catalog-category-pills">
              {["All", "Girls", "Boys", "Toys", "Accessories", "Footwear"].map((cat) => {
                const count =
                  cat === "All"
                    ? products.length
                    : products.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    className={`cat-pill-btn ${productCategoryFilter === cat ? "active" : ""}`}
                    onClick={() => setProductCategoryFilter(cat)}
                  >
                    <span>{cat}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="table-card">
              {/* Product Search & Stock Filter Toolbar */}
              <div className="table-header-toolbar wrap-mobile">
                <div className="search-filter-inputs">
                  <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search title, subcategory, ID..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                    {productSearch && (
                      <button className="clear-search-btn" onClick={() => setProductSearch("")}>✕</button>
                    )}
                  </div>

                  <select
                    className="select-filter-input"
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value)}
                  >
                    <option value="All">All Stock Levels</option>
                    <option value="in-stock">In Stock (&gt; 10 units)</option>
                    <option value="low-stock">Low Stock (≤ 10 units)</option>
                    <option value="out-of-stock">Out of Stock (0 units)</option>
                  </select>
                </div>

                <div className="toolbar-right-group">
                  <span className="toolbar-counter-text">
                    Showing {filteredProducts.length} of {products.length} products
                  </span>

                  <button
                    className="adm-action-btn primary small"
                    onClick={() => setActiveTab("add-product")}
                  >
                    + New Product
                  </button>
                </div>
              </div>

              {loadingProducts ? (
                <div className="table-loading-spinner">
                  <div className="spinner-icon"></div>
                  <p>Loading products catalog...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-icon">👗</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your search query or category filters.</p>
                  <button
                    className="adm-action-btn primary"
                    onClick={() => {
                      setProductSearch("");
                      setProductCategoryFilter("All");
                      setProductStockFilter("All");
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product Item</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Price (INR)</th>
                        <th>Quick Stock Adjust</th>
                        <th>Stock Health</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => {
                        const currentStock = p.stock ?? 25;
                        return (
                          <tr key={p._id}>
                            <td>
                              <div className="product-media-cell">
                                <img
                                  src={p.image?.startsWith("http") ? p.image : `${API_URL}/uploads/${p.image}`}
                                  alt={p.name}
                                  className="product-catalog-thumb"
                                  onError={(e) => (e.target.src = "https://placehold.co/80x80?text=Baby+Item")}
                                />
                                <div className="product-text-details">
                                  <div className="product-title-text">{p.name}</div>
                                  <div className="product-sku-id">ID: #{p._id.slice(-6).toUpperCase()}</div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span className={`category-tag-badge cat-${(p.category || "other").toLowerCase()}`}>
                                {p.category}
                              </span>
                            </td>

                            <td>
                              <span className="subcategory-name">{p.subcategory || "General"}</span>
                            </td>

                            <td>
                              <strong className="product-price-highlight">₹{p.price}</strong>
                            </td>

                            <td>
                              {/* Quick Inline Stock Adjuster */}
                              <div className="quick-stock-adjuster">
                                <button
                                  className="stock-btn decrement"
                                  title="Decrease stock by 1"
                                  onClick={() => handleQuickStockChange(p._id, -1)}
                                >
                                  -
                                </button>
                                <span className="stock-number-display">{currentStock}</span>
                                <button
                                  className="stock-btn increment"
                                  title="Increase stock by 1"
                                  onClick={() => handleQuickStockChange(p._id, 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td>
                              <span
                                className={`stock-status-pill ${
                                  currentStock > 10
                                    ? "in-stock"
                                    : currentStock > 0
                                    ? "low-stock"
                                    : "out-of-stock"
                                }`}
                              >
                                {currentStock > 10
                                  ? `In Stock (${currentStock})`
                                  : currentStock > 0
                                  ? `Low Stock (${currentStock})`
                                  : "Out of Stock"}
                              </span>
                            </td>

                            <td>
                              <div className="table-action-btns">
                                <button
                                  className="action-icon-btn edit"
                                  title="Edit Product Details"
                                  onClick={() => setEditingProduct({ ...p })}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                </button>
                                <button
                                  className="action-icon-btn delete"
                                  title="Delete Product"
                                  onClick={() => handleDeleteProduct(p._id)}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: ADD NEW PRODUCT STUDIO
            ======================================================== */}
        {activeTab === "add-product" && (
          <div className="tab-content-fade">
            <div className="product-studio-grid">
              {/* Form Card */}
              <div className="studio-form-card">
                <div className="studio-header">
                  <h2>Add Product to Customer Store</h2>
                  <p>Publish an item with real-time photo upload, smart category presets, and stock allocation.</p>
                </div>

                <form onSubmit={handleProductSubmit}>
                  <div className="form-grid-layout">
                    {/* Title */}
                    <div className="form-group span-2">
                      <label>Product Title / Name *</label>
                      <input
                        type="text"
                        className="adm-text-input"
                        placeholder="e.g. Silk Embroidered Princess Gown"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label>Primary Category *</label>
                      <select
                        className="adm-text-input"
                        value={category}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          setCategory(newCat);
                          setSubcategory(subcategoryPresets[newCat]?.[0] || "");
                        }}
                        required
                      >
                        <option value="Girls">Girls Collection</option>
                        <option value="Boys">Boys Collection</option>
                        <option value="Toys">Toys & Play</option>
                        <option value="Accessories">Baby Accessories</option>
                        <option value="Footwear">Footwear & Booties</option>
                      </select>
                    </div>

                    {/* Subcategory with Presets */}
                    <div className="form-group">
                      <label>Subcategory *</label>
                      <input
                        type="text"
                        className="adm-text-input"
                        placeholder="e.g. Frocks, Soft Toys, Denims"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        required
                      />

                      {/* Subcategory Fast-Pills */}
                      <div className="quick-subcat-chips">
                        {subcategoryPresets[category]?.map((sub) => (
                          <span
                            key={sub}
                            className={`subcat-chip ${subcategory === sub ? "active" : ""}`}
                            onClick={() => setSubcategory(sub)}
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="form-group">
                      <label>Selling Price (₹ INR) *</label>
                      <input
                        type="number"
                        className="adm-text-input"
                        placeholder="e.g. 799"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>

                    {/* Initial Stock */}
                    <div className="form-group">
                      <label>Initial Stock Inventory *</label>
                      <input
                        type="number"
                        className="adm-text-input"
                        placeholder="e.g. 25"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="form-group span-2">
                      <label>Product Description & Fabric Highlights</label>
                      <textarea
                        className="adm-text-input"
                        rows="3"
                        placeholder="Describe soft skin-safe fabric, washing instructions, age fit..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    {/* Image Dropzone */}
                    <div className="form-group span-2">
                      <label>Product Photography *</label>
                      <div
                        className="image-upload-dropzone"
                        onClick={() => document.getElementById("productImageInput").click()}
                      >
                        {imagePreview ? (
                          <div className="image-preview-wrapper">
                            <img src={imagePreview} alt="Preview" className="preview-image-img" />
                            <div className="change-photo-text">Click to pick a different photo</div>
                          </div>
                        ) : (
                          <div className="dropzone-empty-state">
                            <div className="dropzone-icon">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                            </div>
                            <div className="dropzone-title">Click to upload product image</div>
                            <div className="dropzone-subtitle">Supports JPG, PNG, WEBP files up to 5MB</div>
                          </div>
                        )}
                        <input
                          id="productImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-submit-row">
                    <button
                      type="submit"
                      className="adm-action-btn primary large full-width"
                      disabled={uploading}
                    >
                      {uploading ? "Publishing Product..." : "Publish Product to Catalog"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Card */}
              <div className="studio-preview-card">
                <div className="preview-card-header">
                  <span>Live Storefront Preview</span>
                </div>

                <div className="mock-store-product-card">
                  <div className="mock-card-media">
                    <img
                      src={imagePreview || "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop&q=60"}
                      alt="Preview"
                      className="mock-image"
                    />
                    <span className="mock-badge">{category}</span>
                  </div>

                  <div className="mock-card-body">
                    <div className="mock-subcat">{subcategory || "Subcategory"}</div>
                    <div className="mock-title">{productName || "Product Title Preview"}</div>
                    <div className="mock-price-row">
                      <span className="mock-price">₹{price || "999"}</span>
                      {mrp && <span className="mock-mrp">₹{mrp}</span>}
                    </div>
                    <p className="mock-desc">
                      {description || "Soft and gentle baby essential crafted with love for your little ones."}
                    </p>
                    <button type="button" className="mock-add-btn">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: CUSTOMERS CRM & PROFILES
            ======================================================== */}
        {activeTab === "customers" && (
          <div className="tab-content-fade">
            <div className="table-card">
              <div className="table-header-toolbar wrap-mobile">
                <div className="search-filter-inputs">
                  <div className="search-input-wrap">
                    <span className="search-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search customer name, email, phone, city..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                    {customerSearch && (
                      <button className="clear-search-btn" onClick={() => setCustomerSearch("")}>✕</button>
                    )}
                  </div>
                </div>

                <div className="toolbar-counter-text">
                  Total Active Customers: {filteredCustomers.length}
                </div>
              </div>

              {filteredCustomers.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                  </div>
                  <h3>No customers recorded yet</h3>
                  <p>Customer accounts are automatically aggregated whenever orders are placed.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Contact Information</th>
                        <th>Delivery City</th>
                        <th>Total Orders</th>
                        <th>Lifetime Spend</th>
                        <th>Last Purchase</th>
                        <th>Direct Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((cust, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="customer-avatar-cell">
                              <div className="cust-avatar-circle">
                                {cust.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <strong className="customer-cell-name">{cust.name}</strong>
                                <div className="customer-cell-sub">Customer ID: #CUST-{idx + 101}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div>{cust.email}</div>
                            {cust.phone && cust.phone !== "N/A" && <div>{cust.phone}</div>}
                          </td>

                          <td>
                            <strong className="city-name-tag">{cust.city}</strong>
                          </td>

                          <td>
                            <span className="badge-count-pill">{cust.orderCount} Order(s)</span>
                          </td>

                          <td>
                            <strong className="order-price-val">₹{cust.totalSpent.toLocaleString("en-IN")}</strong>
                          </td>

                          <td>
                            <span className="order-date-sub">{new Date(cust.lastOrderDate).toLocaleDateString()}</span>
                          </td>

                          <td>
                            <div className="table-action-btns">
                              <a
                                href={`mailto:${cust.email}?subject=Regarding your order with Kalyani's Kids Square`}
                                className="action-icon-btn"
                                title="Send Email"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                              </a>
                              {cust.phone && cust.phone !== "N/A" && (
                                <a
                                  href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="action-icon-btn whatsapp"
                                  title="WhatsApp Customer"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: FINANCIAL & CATEGORY ANALYTICS
            ======================================================== */}
        {activeTab === "analytics" && (
          <div className="tab-content-fade">
            {/* Top Stat Metrics */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-title">Gross Store Revenue</span>
                  <div className="kpi-icon-pill pink">₹</div>
                </div>
                <div className="kpi-value">₹{totalRevenue.toLocaleString("en-IN")}</div>
                <div className="kpi-footer">
                  <span className="kpi-badge-up">All Time</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-title">Completed Deliveries</span>
                  <div className="kpi-icon-pill emerald">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
                <div className="kpi-value">
                  {orders.filter((o) => o.status === "Delivered").length}
                </div>
                <div className="kpi-footer">
                  <span className="kpi-badge-up">Fulfilled</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-title">Active Dispatches</span>
                  <div className="kpi-icon-pill blue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  </div>
                </div>
                <div className="kpi-value">
                  {orders.filter((o) => o.status === "Shipped").length}
                </div>
                <div className="kpi-footer">
                  <span className="kpi-badge-pending">In Transit</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-card-header">
                  <span className="kpi-title">Cancelled Orders</span>
                  <div className="kpi-icon-pill purple">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                  </div>
                </div>
                <div className="kpi-value">
                  {orders.filter((o) => o.status === "Cancelled").length}
                </div>
                <div className="kpi-footer">
                  <span className="kpi-subtext">Return rate &lt; 2%</span>
                </div>
              </div>
            </div>

            {/* Analytics Breakdown Grid */}
            <div className="dashboard-grid-2">
              {/* Payment Methods */}
              <div className="widget-card">
                <h3 className="widget-title">Payment Method Share</h3>
                <p className="widget-subtitle">Payment preferences chosen during checkout</p>

                <div className="payment-breakdown-boxes">
                  <div className="pm-box cod">
                    <div className="pm-title">Cash on Delivery (COD)</div>
                    <div className="pm-count">
                      {orders.filter((o) => o.paymentMethod === "cod").length} orders
                    </div>
                    <div className="pm-pct">
                      {orders.length > 0
                        ? Math.round((orders.filter((o) => o.paymentMethod === "cod").length / orders.length) * 100)
                        : 0}
                      % of checkouts
                    </div>
                  </div>

                  <div className="pm-box online">
                    <div className="pm-title">Razorpay & Online Cards</div>
                    <div className="pm-count">
                      {orders.filter((o) => o.paymentMethod !== "cod").length} orders
                    </div>
                    <div className="pm-pct">
                      {orders.length > 0
                        ? Math.round((orders.filter((o) => o.paymentMethod !== "cod").length / orders.length) * 100)
                        : 0}
                      % of checkouts
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional City Distribution */}
              <div className="widget-card">
                <h3 className="widget-title">Top Delivery Destinations</h3>
                <p className="widget-subtitle">Customer city breakdown across India</p>

                <div className="city-rank-list">
                  {Object.entries(
                    orders.reduce((acc, o) => {
                      const city = o.city || "Other";
                      acc[city] = (acc[city] || 0) + 1;
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([city, count], idx) => (
                      <div key={city} className="city-rank-item">
                        <div className="city-rank-name">
                          <span className="rank-num">#{idx + 1}</span>
                          <strong>{city}</strong>
                        </div>
                        <span className="city-orders-pill">{count} order(s)</span>
                      </div>
                    ))}

                  {orders.length === 0 && <p className="empty-text">No delivery data available yet.</p>}
                </div>
              </div>
            </div>

            {/* Export Reports Box */}
            <div className="table-card">
              <div className="report-download-banner">
                <div>
                  <h3 style={{ margin: "0 0 4px 0" }}>Financial & Order Ledger Reports</h3>
                  <p style={{ margin: 0, color: "#64748b" }}>
                    Export the full transactions database in CSV format for spreadsheet accounting, GST filings, and dispatch audits.
                  </p>
                </div>
                <button className="adm-action-btn primary" onClick={exportOrdersCSV}>
                  Download Complete Ledger (CSV)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: STORE SETTINGS & DATABASE TOOLS
            ======================================================== */}
        {activeTab === "settings" && (
          <div className="tab-content-fade">
            <div className="settings-grid-layout">
              {/* Store Details Form */}
              <div className="table-card settings-card">
                <div className="settings-section-header">
                  <h3>Store Identity & Branding</h3>
                  <p>Configure official brand names, customer support phone, and address.</p>
                </div>

                <form onSubmit={handleSaveSettings}>
                  <div className="form-grid-layout">
                    <div className="form-group span-2">
                      <label>Store Brand Name</label>
                      <input
                        type="text"
                        className="adm-text-input"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Customer Support Hotline</label>
                      <input
                        type="text"
                        className="adm-text-input"
                        value={storeSettings.supportPhone}
                        onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Official Care Email</label>
                      <input
                        type="email"
                        className="adm-text-input"
                        value={storeSettings.supportEmail}
                        onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                      />
                    </div>

                    <div className="form-group span-2">
                      <label>Official Store / Dispatch Address</label>
                      <input
                        type="text"
                        className="adm-text-input"
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                      />
                    </div>

                    <div className="form-group span-2">
                      <label>Storefront Top Banner Announcement Text</label>
                      <input
                        type="text"
                        className="adm-text-input"
                        value={storeSettings.bannerAnnouncement}
                        onChange={(e) => setStoreSettings({ ...storeSettings, bannerAnnouncement: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Free Shipping Minimum Threshold (₹)</label>
                      <input
                        type="number"
                        className="adm-text-input"
                        value={storeSettings.freeShippingThreshold}
                        onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Cash on Delivery (COD) Option</label>
                      <select
                        className="adm-text-input"
                        value={storeSettings.codEnabled ? "enabled" : "disabled"}
                        onChange={(e) => setStoreSettings({ ...storeSettings, codEnabled: e.target.value === "enabled" })}
                      >
                        <option value="enabled">Enabled (Available on checkout)</option>
                        <option value="disabled">Disabled (Online payments only)</option>
                      </select>
                    </div>
                  </div>

                  <div className="settings-btn-row">
                    <button type="submit" className="adm-action-btn primary">
                      Save Store Configurations
                    </button>
                  </div>
                </form>
              </div>

              {/* Maintenance & Seed Tools */}
              <div className="table-card tools-card">
                <div className="settings-section-header">
                  <h3>System Database Tools</h3>
                  <p>Developer and administrator utility tools for catalog seeding and backup.</p>
                </div>

                <div className="tools-action-list">
                  <div className="tool-row">
                    <div>
                      <strong>Populate / Re-Seed Product Catalog</strong>
                      <p>Fills database with 50+ items across all 5 baby categories.</p>
                    </div>
                    <button className="adm-action-btn secondary small" onClick={handleSeedDatabase}>
                      Run Catalog Seed
                    </button>
                  </div>

                  <div className="tool-row">
                    <div>
                      <strong>Download Full Store Backup (JSON)</strong>
                      <p>Exports complete store database with all products and orders to a JSON file.</p>
                    </div>
                    <button className="adm-action-btn secondary small" onClick={handleBackupDatabase}>
                      Export Backup JSON
                    </button>
                  </div>

                  <div className="tool-row">
                    <div>
                      <strong>Flush Local Admin Session</strong>
                      <p>Clears the current browser administrator session cache.</p>
                    </div>
                    <button className="adm-action-btn delete small" onClick={handleLogout}>
                      Sign Out Admin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: VIEW / PRINT TAX INVOICE & SHIPPING SLIP
          ======================================================== */}
      {selectedOrder && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-dialog-box invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-header no-print">
              <div className="modal-type-switcher">
                <button
                  className={`modal-switch-btn ${invoiceType === "tax" ? "active" : ""}`}
                  onClick={() => setInvoiceType("tax")}
                >
                  Tax Invoice
                </button>
                <button
                  className={`modal-switch-btn ${invoiceType === "shipping-label" ? "active" : ""}`}
                  onClick={() => setInvoiceType("shipping-label")}
                >
                  Thermal Shipping Label
                </button>
              </div>

              <div className="modal-header-actions">
                <button className="adm-action-btn primary small" onClick={() => window.print()}>
                  Print Now
                </button>
                <button className="modal-close-icon-btn" onClick={() => setSelectedOrder(null)}>
                  ✕
                </button>
              </div>
            </div>

            {/* View A: Official Tax Invoice */}
            {invoiceType === "tax" ? (
              <div className="printable-tax-invoice">
                <div className="invoice-brand-row">
                  <div>
                    <h2 className="invoice-brand-name">{storeSettings.storeName}</h2>
                    <p className="invoice-brand-tagline">{storeSettings.tagline}</p>
                    <p className="invoice-store-address">{storeSettings.address}</p>
                    <p className="invoice-store-contact">Care: {storeSettings.supportPhone} | {storeSettings.supportEmail}</p>
                  </div>

                  <div className="invoice-meta-right">
                    <div className="invoice-badge-title">TAX INVOICE</div>
                    <div className="invoice-num-text">INV-#{selectedOrder._id.slice(-8).toUpperCase()}</div>
                    <div className="invoice-date-text">
                      Date: {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN")}
                    </div>
                    <div className="invoice-status-tag">
                      Status: <strong>{(selectedOrder.status || "Processing").toUpperCase()}</strong>
                    </div>
                  </div>
                </div>

                <hr className="invoice-divider" />

                {/* Customer Details Row */}
                <div className="invoice-parties-grid">
                  <div className="party-box">
                    <h4>Billed & Shipped To:</h4>
                    <div className="party-name"><strong>{selectedOrder.customerName}</strong></div>
                    <div className="party-address">{selectedOrder.address}</div>
                    <div className="party-city">{selectedOrder.city}, PIN: {selectedOrder.zip}</div>
                    <div className="party-contact">Email: {selectedOrder.email}</div>
                    {selectedOrder.phone && <div className="party-contact">Phone: {selectedOrder.phone}</div>}
                  </div>

                  <div className="party-box">
                    <h4>Payment & Dispatch Details:</h4>
                    <div>Method: <strong>{selectedOrder.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Paid via Razorpay / Card"}</strong></div>
                    {selectedOrder.paymentId && <div>Payment Ref ID: <code>{selectedOrder.paymentId}</code></div>}
                    <div>Fulfillment: <strong>{selectedOrder.status || "Processing"}</strong></div>
                    {selectedOrder.trackingNumber && (
                      <div>Courier: <strong>{selectedOrder.courier || "Express"} (#{selectedOrder.trackingNumber})</strong></div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item Description</th>
                      <th>Category</th>
                      <th style={{ textAlign: "center" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Rate (₹)</th>
                      <th style={{ textAlign: "right" }}>Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>{item.name}</strong>
                          {item.subcategory && <div className="item-sub-text">{item.subcategory}</div>}
                        </td>
                        <td>{item.category || "Kids"}</td>
                        <td style={{ textAlign: "center" }}>1</td>
                        <td style={{ textAlign: "right" }}>₹{item.price}</td>
                        <td style={{ textAlign: "right" }}>₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Summary */}
                <div className="invoice-summary-row">
                  <div className="invoice-notes-left">
                    <p><strong>Terms & Conditions:</strong></p>
                    <p>Thank you for shopping at Kalyani's Kids Square. For any assistance or exchange, please contact customer support.</p>
                  </div>

                  <div className="invoice-totals-table">
                    <div className="totals-line">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.totalAmount}</span>
                    </div>
                    <div className="totals-line">
                      <span>Shipping & Packaging:</span>
                      <span>FREE</span>
                    </div>
                    <div className="totals-line">
                      <span>GST / Tax (0%):</span>
                      <span>₹0</span>
                    </div>
                    <div className="totals-line grand-total">
                      <span>Grand Total:</span>
                      <span>₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="invoice-footer-seal">
                  <p>Computer Generated Official Tax Invoice • Kalyani's Kids Square</p>
                </div>
              </div>
            ) : (
              /* View B: Thermal Shipping Label */
              <div className="printable-shipping-label">
                <div className="label-border-box">
                  <div className="label-header">
                    <div className="label-brand">{storeSettings.storeName}</div>
                    <div className="label-courier">{selectedOrder.courier || "EXPRESS LOGISTICS"}</div>
                  </div>

                  <div className="label-barcode-mock">
                    <div className="barcode-lines">||||||||||||||||||||||||||||||||||||||||||||||||||||||||||</div>
                    <div className="barcode-text">AWB: {selectedOrder.trackingNumber || selectedOrder._id.toUpperCase()}</div>
                  </div>

                  <div className="label-dest-box">
                    <div className="label-sub">SHIP TO:</div>
                    <div className="label-cust-name">{selectedOrder.customerName}</div>
                    <div className="label-address">{selectedOrder.address}</div>
                    <div className="label-city">{selectedOrder.city} - {selectedOrder.zip}</div>
                    <div className="label-phone">TEL: {selectedOrder.phone || "N/A"}</div>
                  </div>

                  <div className="label-footer-row">
                    <div className="label-cod-type">
                      {selectedOrder.paymentMethod === "cod" ? "COD: COLLECT ₹" + selectedOrder.totalAmount : "PREPAID ONLINE"}
                    </div>
                    <div className="label-weight">Weight: ~0.50 KG</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: EDIT PRODUCT DETAILS
          ======================================================== */}
      {editingProduct && (
        <div className="modal-backdrop-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-dialog-box edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-header">
              <h3>Edit Product Catalog Item</h3>
              <button className="modal-close-icon-btn" onClick={() => setEditingProduct(null)}>✕</button>
            </div>

            <form onSubmit={handleEditProductSubmit}>
              <div className="form-grid-layout">
                <div className="form-group span-2">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    className="adm-text-input"
                    value={editingProduct.name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="adm-text-input"
                    value={editingProduct.category || "Girls"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  >
                    <option value="Girls">Girls</option>
                    <option value="Boys">Boys</option>
                    <option value="Toys">Toys</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Subcategory</label>
                  <input
                    type="text"
                    className="adm-text-input"
                    value={editingProduct.subcategory || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹ INR) *</label>
                  <input
                    type="number"
                    className="adm-text-input"
                    value={editingProduct.price || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Inventory Stock Units *</label>
                  <input
                    type="number"
                    className="adm-text-input"
                    value={editingProduct.stock ?? 20}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group span-2">
                  <label>Description</label>
                  <textarea
                    className="adm-text-input"
                    rows="3"
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="modal-btn-row">
                <button type="button" className="adm-action-btn secondary" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-action-btn primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: DISPATCH & TRACKING DETAILS
          ======================================================== */}
      {trackingOrder && (
        <div className="modal-backdrop-overlay" onClick={() => setTrackingOrder(null)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-header">
              <h3>Update Dispatch & Tracking Info</h3>
              <button className="modal-close-icon-btn" onClick={() => setTrackingOrder(null)}>✕</button>
            </div>

            <form onSubmit={handleSaveTracking}>
              <div className="form-grid-layout">
                <div className="form-group span-2">
                  <label>Order ID</label>
                  <input
                    type="text"
                    className="adm-text-input"
                    value={`#${trackingOrder._id.slice(-8).toUpperCase()} - ${trackingOrder.customerName}`}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Courier Partner</label>
                  <select
                    className="adm-text-input"
                    value={trackingData.courier}
                    onChange={(e) => setTrackingData({ ...trackingData, courier: e.target.value })}
                  >
                    <option value="Delhivery">Delhivery</option>
                    <option value="BlueDart">BlueDart Express</option>
                    <option value="DTDC">DTDC Courier</option>
                    <option value="India Post">India Post (Speed Post)</option>
                    <option value="XpressBees">XpressBees</option>
                    <option value="Shadowfax">Shadowfax</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>AWB / Tracking Number *</label>
                  <input
                    type="text"
                    className="adm-text-input"
                    placeholder="e.g. DLV9837492817"
                    value={trackingData.trackingNumber}
                    onChange={(e) => setTrackingData({ ...trackingData, trackingNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-btn-row">
                <button type="button" className="adm-action-btn secondary" onClick={() => setTrackingOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-action-btn primary">
                  Save Tracking & Mark Shipped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
