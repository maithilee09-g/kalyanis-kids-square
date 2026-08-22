import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartCount, wishlistCount, currentUser, onLogout }) {
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
    }
  }

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-container">
      {/* 🚩 TOP BANNER */}
      <div className="top-banner">
        Welcome to Kalyani's Kids Square — Curated Premium Kids Collection
      </div>

      {/* 🏛️ MAIN HEADER */}
      <div className="main-header">
        {/* Left Side: Search */}
        <div className="header-left">
          <form className="search-container" onSubmit={handleSearch}>
            <span className="nav-icon-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>

            <input
              type="text"
              className="search-input"
              placeholder="Search products, styles, toys..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Center: Logo */}
        <div className="header-center" onClick={() => navigate("/")}>
          <div className="logo-container">
            <img
              src="/logo.png"
              alt="Kalyani Kids Square"
              className="logo-img"
              onError={(e) => (e.target.style.display = "none")}
            />
            <span className="logo-text">Kalyani's Kids Square</span>
          </div>
        </div>

        {/* Right Side: Icons & Auth */}
        <div className="header-right">
          {/* USER / CUSTOMER ACCOUNT DROPDOWN */}
          <div className="user-nav-wrapper" ref={userMenuRef}>
            {currentUser ? (
              <div
                className="user-profile-chip"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title="Account Menu"
              >
                <div className="user-avatar-dot">
                  {(currentUser.name || "U").slice(0, 1).toUpperCase()}
                </div>
                <div className="user-chip-text">
                  <span className="user-chip-greet">Hi, {(currentUser.name || "User").split(" ")[0]}</span>
                  <span className="user-chip-role">
                    {currentUser.role === "admin" ? "Administrator" : "Customer"}
                  </span>
                </div>
                <span className="chip-arrow">▾</span>
              </div>
            ) : (
              <button
                className="nav-signin-btn"
                onClick={() => navigate("/login")}
                title="Sign In / Register"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {showUserMenu && currentUser && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-header">
                  <strong>{currentUser.name}</strong>
                  <div className="dropdown-email">{currentUser.email}</div>
                  <span className={`role-badge-tag ${currentUser.role}`}>
                    {currentUser.role === "admin" ? "Administrator" : "Retail Customer"}
                  </span>
                </div>

                <div className="user-dropdown-links">
                  {currentUser.role === "admin" ? (
                    <button
                      className="dropdown-item-btn admin-highlight"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/admin");
                      }}
                    >
                      <span>Admin Dashboard</span>
                    </button>
                  ) : (
                    <>
                      <button
                        className="dropdown-item-btn"
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/login");
                        }}
                      >
                        <span>My Orders & Profile</span>
                      </button>

                      <button
                        className="dropdown-item-btn"
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/admin");
                        }}
                      >
                        <span>Admin Management Portal</span>
                      </button>
                    </>
                  )}

                  <button
                    className="dropdown-item-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/wishlist");
                    }}
                  >
                    <span>My Wishlist ({wishlistCount})</span>
                  </button>

                  <button
                    className="dropdown-item-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/cart");
                    }}
                  >
                    <span>My Cart ({cartCount})</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item-btn logout"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                      navigate("/");
                    }}
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <div
            className="nav-icon"
            onClick={() => navigate("/wishlist")}
            title="Wishlist"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </div>

          {/* Cart Icon */}
          <div
            className="nav-icon"
            onClick={() => navigate("/cart")}
            title="Shopping Cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>

          {/* Admin Button */}
          <div
            className="nav-icon admin-icon"
            onClick={() => navigate("/admin")}
            title="Open Admin Management Portal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span className="admin-quick-text">Admin</span>
          </div>
        </div>
      </div>

      {/* 🧭 BOTTOM NAVIGATION (CATEGORIES) */}
      <div className="bottom-nav">
        <span className="nav-link" onClick={() => navigate("/products")}>All Styles</span>
        <span className="nav-link girls-link" onClick={() => navigate("/products?category=Girls")}>Girls</span>
        <span className="nav-link boys-link" onClick={() => navigate("/products?category=Boys")}>Boys</span>
        <span className="nav-link toys-link" onClick={() => navigate("/products?category=Toys")}>Toys</span>
        <span className="nav-link accessories-link" onClick={() => navigate("/products?category=Accessories")}>Accessories</span>
        <span className="nav-link footwear-link" onClick={() => navigate("/products?category=Footwear")}>Footwear</span>
        <span className="nav-link store-link" onClick={() => navigate("/store-locator")}>Find Store</span>
      </div>
    </nav>
  );
}

export default Navbar;