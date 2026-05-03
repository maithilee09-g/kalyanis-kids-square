import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartCount, wishlistCount }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/products?search=${search}`);
  }

  return (
    <nav className="navbar-container">
      {/* 🚩 TOP BANNER */}
      <div className="top-banner">
        Welcome to Kalyani's Kids Square - The Best for Your Little Ones
      </div>

      {/* 🏛️ MAIN HEADER */}
      <div className="main-header">
        {/* Left Side: Search */}
        <div className="header-left">
          <form className="search-container" onSubmit={handleSearch}>
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>

            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        {/* Center: Logo */}
        <div className="header-center" onClick={() => navigate("/")}>
          <div className="logo-container">
            {/* The elephant logo image */}
            <img
              src="/logo.png"
              alt="Kalyani Kids Square"
              className="logo-img"
              onError={(e) => e.target.style.display = 'none'}
            />
            <span className="logo-text">Kalyani's Kids Square</span>
          </div>
        </div>

        {/* Right Side: Icons */}
        <div className="header-right">
          <div className="nav-icon" onClick={() => navigate("/login")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>

          <div className="nav-icon" onClick={() => navigate("/wishlist")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </div>

          <div className="nav-icon" onClick={() => navigate("/cart")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>

          <div className="nav-icon admin-icon" onClick={() => navigate("/admin")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
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