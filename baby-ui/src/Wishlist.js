import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Wishlist.css";
import API_URL from "./api";

function Wishlist({ wishlist, removeFromWishlist, addToCart }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleMoveToCart = (item, index, e) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(item);
    }
    if (removeFromWishlist) {
      removeFromWishlist(index);
    }
    showToast(`Added "${item.name}" to your cart`);
  };

  const handleRemove = (index, e) => {
    e.stopPropagation();
    if (removeFromWishlist) {
      removeFromWishlist(index);
    }
    showToast("Item removed from wishlist");
  };

  const handleMoveAllToCart = () => {
    if (!wishlist || wishlist.length === 0) return;
    wishlist.forEach((item) => {
      if (addToCart) addToCart(item);
    });
    // Remove all from wishlist
    for (let i = wishlist.length - 1; i >= 0; i--) {
      if (removeFromWishlist) removeFromWishlist(i);
    }
    showToast("All items moved to shopping cart");
  };

  const totalValue = wishlist?.reduce((sum, item) => sum + (Number(item.price) || 0), 0) || 0;

  return (
    <div className="wishlist-page-container">
      {/* Toast Notification */}
      {toast && <div className="wishlist-toast">{toast}</div>}

      <div className="wishlist-content-wrapper">
        {/* Header Row */}
        <div className="wishlist-header-row">
          <div>
            <h1 className="wishlist-title">My Wishlist</h1>
            <p className="wishlist-subtitle">
              {wishlist && wishlist.length > 0
                ? `${wishlist.length} saved item(s) • Total value: ₹${totalValue.toLocaleString("en-IN")}`
                : "Your saved styles and curated products"}
            </p>
          </div>

          {wishlist && wishlist.length > 0 && (
            <div className="wishlist-header-actions">
              <button className="wishlist-btn primary" onClick={handleMoveAllToCart}>
                Move All to Cart
              </button>
              <button
                className="wishlist-btn secondary"
                onClick={() => navigate("/products")}
              >
                + Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Empty Wishlist State */}
        {!wishlist || wishlist.length === 0 ? (
          <div className="empty-wishlist-card">
            <div className="empty-clean-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>
              Save items you love while browsing our collections and they will appear here.
            </p>
            <Link to="/products" className="explore-catalog-btn">
              Explore Collections
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="wishlist-grid">
            {wishlist.map((item, index) => (
              <div
                key={item._id || index}
                className="wishlist-card"
                onClick={() => navigate(`/product/${item._id}`)}
                title={`View ${item.name}`}
              >
                {/* Image Container */}
                <div className="wishlist-image-wrap">
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${API_URL}/uploads/${item.image}`
                    }
                    alt={item.name}
                    className="wishlist-product-img"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400";
                    }}
                  />
                  {item.category && (
                    <span className="wishlist-category-badge">{item.category}</span>
                  )}
                  <button
                    className="wishlist-remove-btn"
                    title="Remove from Wishlist"
                    onClick={(e) => handleRemove(index, e)}
                  >
                    ✕
                  </button>
                </div>

                {/* Card Body */}
                <div className="wishlist-card-body">
                  {item.subcategory && (
                    <div className="wishlist-subcat">{item.subcategory}</div>
                  )}

                  <h3 className="wishlist-item-name">{item.name}</h3>

                  <div className="wishlist-price-row">
                    <span className="wishlist-price">₹{item.price}</span>
                    <span className="wishlist-stock-tag">In Stock</span>
                  </div>

                  {/* Actions */}
                  <div className="wishlist-card-actions">
                    <button
                      className="wishlist-add-cart-btn"
                      onClick={(e) => handleMoveToCart(item, index, e)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="wishlist-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item._id}`);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;