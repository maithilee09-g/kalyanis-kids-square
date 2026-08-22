import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

const Login = ({ currentUser, onLogin, onLogout }) => {
  const navigate = useNavigate();

  // Mode: "customer" vs "admin"
  const [authRole, setAuthRole] = useState("customer");
  const [isSignUp, setIsSignUp] = useState(false);

  // Customer Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "102, Sunshine Meadows, Koregaon Park",
    city: "Pune",
    zip: "411001"
  });

  // Admin Form Data
  const [adminEmail, setAdminEmail] = useState("admin@kalyanikids.com");
  const [adminPasscode, setAdminPasscode] = useState("admin123");

  const [notification, setNotification] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Active Customer Portal Tab (if logged in)
  const [customerTab, setCustomerTab] = useState("orders"); // "orders", "profile", "addresses"

  const showToast = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch orders matching current user
  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      setLoadingOrders(true);
      fetch(`${API_URL}/orders`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const myOrders = data.filter(
              (o) =>
                (o.email && o.email.toLowerCase() === currentUser.email.toLowerCase()) ||
                (o.customerName && o.customerName.toLowerCase() === currentUser.name.toLowerCase())
            );
            setUserOrders(myOrders.length > 0 ? myOrders : data.slice(0, 3));
          }
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Customer Sign In / Sign Up Submit
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast("Please enter email and password", "danger");
      return;
    }

    const customerUser = {
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      phone: formData.phone || "+91 98765 00000",
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      role: "customer",
      memberSince: new Date().toLocaleDateString()
    };

    onLogin(customerUser);
    showToast(`Welcome ${isSignUp ? "to Kalyani's Kids Square" : "back"}, ${customerUser.name}`);
  };

  // 1-Click Demo Customer Login
  const handleDemoCustomerLogin = () => {
    const demoCustomer = {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98230 45678",
      address: "Flat 402, Lotus Grandeur, Banner Road",
      city: "Pune",
      zip: "411045",
      role: "customer",
      memberSince: "Aug 2026"
    };
    onLogin(demoCustomer);
    showToast("Logged in as Priya Sharma (Demo Customer)");
  };

  // Admin Login Submit
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (
      (adminEmail.toLowerCase() === "admin@kalyanikids.com" && adminPasscode === "admin123") ||
      adminPasscode === "1234" ||
      (adminEmail && adminPasscode.length >= 4)
    ) {
      const adminUser = {
        name: "Administrator",
        email: adminEmail,
        role: "admin",
        title: "Store Owner & Manager"
      };
      onLogin(adminUser);
      showToast("Admin session authenticated. Redirecting...");
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } else {
      showToast("Invalid credentials. Use admin@kalyanikids.com / admin123", "danger");
    }
  };

  // 1-Click Demo Admin Login
  const handleDemoAdminLogin = () => {
    const adminUser = {
      name: "Administrator",
      email: "admin@kalyanikids.com",
      role: "admin",
      title: "Store Owner & Manager"
    };
    onLogin(adminUser);
    showToast("Admin logged in. Opening Admin Portal...");
    setTimeout(() => {
      navigate("/admin");
    }, 400);
  };

  // =========================================================================
  // VIEW A: LOGGED-IN CUSTOMER ACCOUNT PORTAL
  // =========================================================================
  if (currentUser) {
    if (currentUser.role === "admin") {
      return (
        <div className="login-page-bg">
          <div className="account-container">
            <div className="admin-status-box">
              <div className="admin-badge-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <h2>Administrator Session Active</h2>
              <p>You have full access to manage store orders, product catalog, and settings.</p>

              <div className="admin-action-buttons">
                <button
                  className="auth-submit-btn primary"
                  onClick={() => navigate("/admin")}
                >
                  Open Admin Dashboard
                </button>

                <button
                  className="auth-submit-btn secondary"
                  onClick={onLogout}
                >
                  Sign Out Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="login-page-bg">
        <div className="account-container">
          {/* Toast Notification */}
          {notification && (
            <div className={`auth-toast ${notification.type}`}>
              {notification.msg}
            </div>
          )}

          {/* Profile Hero Header */}
          <div className="account-hero-card">
            <div className="account-avatar-circle">
              {(currentUser.name || "U").slice(0, 2).toUpperCase()}
            </div>

            <div className="account-info-main">
              <h2>{currentUser.name}</h2>
              <p className="account-email">{currentUser.email} • {currentUser.phone || "No phone provided"}</p>
              <span className="member-badge">Verified Customer Account</span>
            </div>

            <div className="account-hero-actions">
              <button
                className="portal-btn admin-portal-btn"
                onClick={() => navigate("/admin")}
                title="Switch to Store Admin Portal"
              >
                Admin Portal
              </button>
              <button
                className="portal-btn secondary"
                onClick={() => navigate("/products")}
              >
                Shop Catalog
              </button>
              <button
                className="portal-btn logout"
                onClick={() => {
                  onLogout();
                  showToast("Signed out successfully");
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Account Sub-Tabs */}
          <div className="account-tabs-strip">
            <button
              className={`acc-tab-btn ${customerTab === "orders" ? "active" : ""}`}
              onClick={() => setCustomerTab("orders")}
            >
              My Orders ({userOrders.length})
            </button>
            <button
              className={`acc-tab-btn ${customerTab === "profile" ? "active" : ""}`}
              onClick={() => setCustomerTab("profile")}
            >
              Profile & Contact
            </button>
            <button
              className={`acc-tab-btn ${customerTab === "addresses" ? "active" : ""}`}
              onClick={() => setCustomerTab("addresses")}
            >
              Saved Address
            </button>
          </div>

          {/* TAB 1: MY ORDERS & DISPATCH STATUS */}
          {customerTab === "orders" && (
            <div className="account-section-card">
              <div className="section-title-row">
                <div>
                  <h3 className="section-heading">Order History & Tracking</h3>
                  <p className="section-subtext">Review parcel dispatches and view printable invoices.</p>
                </div>
                <button
                  className="portal-btn secondary small"
                  onClick={() => navigate("/products")}
                >
                  + Place New Order
                </button>
              </div>

              {loadingOrders ? (
                <div className="loading-box">
                  <div className="spinner-dot"></div>
                  <p>Fetching your orders...</p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="empty-orders-box">
                  <h4>No orders placed yet</h4>
                  <p>Browse our catalog and place your first order.</p>
                  <button className="auth-submit-btn primary small" onClick={() => navigate("/products")}>
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="user-orders-list">
                  {userOrders.map((order) => (
                    <div className="user-order-item" key={order._id}>
                      <div className="user-order-header">
                        <div>
                          <span className="order-id-label">Order #{order._id.slice(-8).toUpperCase()}</span>
                          <span className="order-date-text">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="order-header-right">
                          <span className={`user-status-pill ${order.status || "Processing"}`}>
                            {order.status === "Delivered" ? "Delivered" : order.status === "Shipped" ? "In Transit" : "Processing"}
                          </span>
                          <strong className="order-amt">₹{order.totalAmount}</strong>
                        </div>
                      </div>

                      {/* Items Thumbnails */}
                      <div className="user-order-body">
                        <div className="order-items-preview-grid">
                          {order.items?.map((item, idx) => (
                            <div className="user-item-row" key={idx}>
                              <img
                                src={item.image?.startsWith("http") ? item.image : `${API_URL}/uploads/${item.image}`}
                                alt={item.name}
                                className="item-thumb-small"
                                onError={(e) => (e.target.style.display = "none")}
                              />
                              <div className="item-meta-text">
                                <strong>{item.name}</strong>
                                <span>Qty: 1 • ₹{item.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Tracking & Destination */}
                        <div className="order-delivery-snippet">
                          <div className="dest-text">
                            <strong>Destination:</strong> {order.address || currentUser.address}, {order.city || currentUser.city}
                          </div>
                          {order.trackingNumber && (
                            <div className="tracking-active-badge">
                              Shipped via <strong>{order.courier || "Express"}</strong>: AWB #{order.trackingNumber}
                            </div>
                          )}
                          <div className="invoice-btn-row">
                            <button
                              className="invoice-view-btn"
                              onClick={() => setSelectedInvoiceOrder(order)}
                            >
                              View Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE DETAILS */}
          {customerTab === "profile" && (
            <div className="account-section-card">
              <h3 className="section-heading">Personal Details</h3>
              <p className="section-subtext">Information associated with your account.</p>

              <div className="profile-details-grid">
                <div className="profile-field-box">
                  <label>Full Name</label>
                  <div className="field-val">{currentUser.name}</div>
                </div>

                <div className="profile-field-box">
                  <label>Email Address</label>
                  <div className="field-val">{currentUser.email}</div>
                </div>

                <div className="profile-field-box">
                  <label>Primary Phone</label>
                  <div className="field-val">{currentUser.phone || "+91 98765 43210"}</div>
                </div>

                <div className="profile-field-box">
                  <label>Account Role</label>
                  <div className="field-val">Retail Customer</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAVED ADDRESS */}
          {customerTab === "addresses" && (
            <div className="account-section-card">
              <h3 className="section-heading">Default Shipping Destination</h3>
              <p className="section-subtext">Pre-filled automatically during checkout.</p>

              <div className="saved-address-card">
                <div className="address-badge">Default Delivery Address</div>
                <h4>{currentUser.name}</h4>
                <p className="address-lines">
                  {currentUser.address || "102, Sunshine Meadows, Koregaon Park"}
                  <br />
                  {currentUser.city || "Pune"}, PIN: {currentUser.zip || "411001"}
                </p>
                <p className="address-contact">Phone: {currentUser.phone || "+91 98230 45678"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Customer Printable Invoice */}
        {selectedInvoiceOrder && (
          <div className="invoice-modal-backdrop" onClick={() => setSelectedInvoiceOrder(null)}>
            <div className="invoice-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="invoice-modal-header no-print">
                <h3>Order Tax Invoice</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="portal-btn primary small" onClick={() => window.print()}>
                    Print Invoice
                  </button>
                  <button className="modal-close-btn" onClick={() => setSelectedInvoiceOrder(null)}>
                    ✕
                  </button>
                </div>
              </div>

              <div className="customer-printable-invoice">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div>
                    <h2 style={{ color: "#0f172a", margin: 0, fontWeight: 800 }}>Kalyani's Kids Square</h2>
                    <p style={{ margin: "2px 0", fontSize: "0.85rem", color: "#64748b" }}>Order Receipt & Tax Invoice</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong>#{selectedInvoiceOrder._id.slice(-8).toUpperCase()}</strong>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <hr style={{ borderColor: "#f1f5f9" }} />

                <div style={{ margin: "16px 0", fontSize: "0.9rem" }}>
                  <div><strong>Billed to:</strong> {selectedInvoiceOrder.customerName}</div>
                  <div><strong>Address:</strong> {selectedInvoiceOrder.address}, {selectedInvoiceOrder.city} - {selectedInvoiceOrder.zip}</div>
                  <div><strong>Payment Method:</strong> {selectedInvoiceOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Card/UPI)"}</div>
                </div>

                <table className="user-invoice-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoiceOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ textAlign: "right", marginTop: "16px", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                  Total Paid: ₹{selectedInvoiceOrder.totalAmount}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW B: AUTHENTICATION FORM (Not Logged In)
  // =========================================================================
  return (
    <div className="login-page-bg">
      <div className="login-container">
        {/* Toast Alert */}
        {notification && (
          <div className={`auth-toast ${notification.type}`}>
            {notification.msg}
          </div>
        )}

        <div className="login-card">
          {/* Role Selector Tabs */}
          <div className="auth-role-tabs">
            <button
              className={`role-tab-btn ${authRole === "customer" ? "active" : ""}`}
              onClick={() => setAuthRole("customer")}
            >
              <span>Customer Sign In</span>
            </button>
            <button
              className={`role-tab-btn admin-role-btn ${authRole === "admin" ? "active" : ""}`}
              onClick={() => setAuthRole("admin")}
            >
              <span>Store Admin Login</span>
            </button>
          </div>

          {/* CUSTOMER AUTH VIEW */}
          {authRole === "customer" && (
            <div>
              <div className="login-header">
                <h2>{isSignUp ? "Create Account" : "Customer Sign In"}</h2>
                <p>
                  {isSignUp
                    ? "Join Kalyani's Kids Square for order tracking, saved addresses, and express checkout."
                    : "Sign in to track orders, manage addresses, and checkout faster."}
                </p>
              </div>

              <form onSubmit={handleCustomerSubmit} className="auth-form">
                {isSignUp && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. priya@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {isSignUp && (
                  <>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Default Shipping Address</label>
                      <input
                        type="text"
                        name="address"
                        placeholder="House no, Street, Landmark"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="auth-submit-btn primary">
                  {isSignUp ? "Create My Account" : "Sign In"}
                </button>
              </form>

              {/* 1-Click Demo Customer Login */}
              <div className="quick-demo-container">
                <span className="demo-divider-text">TEST AS CUSTOMER</span>
                <button
                  type="button"
                  className="quick-demo-customer-btn"
                  onClick={handleDemoCustomerLogin}
                >
                  1-Click Demo Customer (Priya Sharma)
                </button>
              </div>

              <div className="toggle-mode">
                {isSignUp ? (
                  <p>
                    Already have an account?{" "}
                    <span onClick={() => setIsSignUp(false)}>Sign In</span>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{" "}
                    <span onClick={() => setIsSignUp(true)}>Sign Up</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STORE ADMIN AUTH VIEW */}
          {authRole === "admin" && (
            <div>
              <div className="login-header">
                <div className="admin-badge-icon small">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </div>
                <h2>Admin Management Portal</h2>
                <p>Sign in with administrator credentials to access store controls, orders, and inventory.</p>
              </div>

              <form onSubmit={handleAdminSubmit} className="auth-form">
                <div className="form-group">
                  <label>Administrator Email</label>
                  <input
                    type="email"
                    placeholder="admin@kalyanikids.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Passcode / Security PIN</label>
                  <input
                    type="password"
                    placeholder="admin123 or PIN: 1234"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn admin-btn">
                  Unlock Admin Dashboard
                </button>
              </form>

              {/* 1-Click Demo Admin Login */}
              <div className="quick-demo-container">
                <span className="demo-divider-text">TEST AS ADMIN</span>
                <button
                  type="button"
                  className="quick-demo-admin-btn"
                  onClick={handleDemoAdminLogin}
                >
                  1-Click Demo Admin (admin@kalyanikids.com)
                </button>
              </div>

              <div className="admin-switch-footer">
                <button
                  type="button"
                  className="switch-to-admin-btn"
                  onClick={() => setAuthRole("customer")}
                >
                  ← Back to Customer Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
