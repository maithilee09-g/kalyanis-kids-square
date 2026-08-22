import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Cart.css";
import API_URL from "./api";

function Cart({ cart, removeFromCart, addToWishlist }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const [couponError, setCouponError] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleMoveToWishlist = (item, index) => {
    if (addToWishlist) {
      addToWishlist(item);
    }
    if (removeFromCart) {
      removeFromCart(index);
    }
    setItemToRemove(null);
    showToast(`"${item.name}" moved to your Wishlist`);
  };

  const handleConfirmDelete = () => {
    if (itemToRemove !== null && removeFromCart) {
      const removedItem = cart[itemToRemove.index];
      removeFromCart(itemToRemove.index);
      setItemToRemove(null);
      showToast(`Removed "${removedItem?.name}" from cart`, "info");
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "KIDS20") {
      setDiscountPct(20);
      setCouponError("");
      showToast("Coupon KIDS20 applied: 20% discount added");
    } else if (couponCode.trim().toUpperCase() === "BABY10") {
      setDiscountPct(10);
      setCouponError("");
      showToast("Coupon BABY10 applied: 10% discount added");
    } else {
      setCouponError("Invalid promo code. Try KIDS20 for 20% OFF");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 70;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="cart-page-bg">
      {/* Toast Alert */}
      {toast && (
        <div className={`cart-toast ${toast.type || "success"}`}>
          {toast.msg}
        </div>
      )}

      <div className="cart-content-layout">
        {/* ================= LEFT: ITEMS LIST ================= */}
        <div className="cart-items-panel">
          <div className="cart-panel-header">
            <div>
              <h1 className="cart-panel-title">Shopping Cart</h1>
              <p className="cart-panel-subtitle">
                {cart.length > 0
                  ? `Review and manage your ${cart.length} item(s) before checkout`
                  : "Your cart is currently empty"}
              </p>
            </div>

            {cart.length > 0 && (
              <span className="cart-badge-count">{cart.length} Item(s)</span>
            )}
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="free-shipping-box">
              <div className="fs-header">
                {subtotal >= freeShippingThreshold ? (
                  <span className="fs-success-text">
                    You have unlocked <strong>FREE Express Delivery</strong>
                  </span>
                ) : (
                  <span>
                    Add <strong>₹{freeShippingThreshold - subtotal}</strong> more to qualify for <strong>FREE Delivery</strong>
                  </span>
                )}
                <span className="fs-pct">{progressToFreeShipping}%</span>
              </div>
              <div className="fs-track">
                <div
                  className="fs-fill"
                  style={{ width: `${progressToFreeShipping}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Empty Cart State */}
          {cart.length === 0 ? (
            <div className="empty-cart-card">
              <div className="empty-cart-svg-wrap">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
              </div>
              <h2>Your shopping bag is empty</h2>
              <p>Explore our curated apparel, toys, and nursery essentials to begin shopping.</p>
              <div className="empty-cart-actions">
                <Link to="/products" className="cart-primary-btn">
                  Explore Catalog
                </Link>
                <Link to="/wishlist" className="cart-secondary-btn">
                  View Saved Wishlist
                </Link>
              </div>
            </div>
          ) : (
            /* Items List */
            <div className="cart-items-list">
              {cart.map((item, index) => (
                <div className="cart-item-card" key={item._id || index}>
                  {/* Thumbnail */}
                  <div
                    className="cart-item-img-box"
                    onClick={() => navigate(`/product/${item._id}`)}
                    title="Click to view product details"
                  >
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `${API_URL}/uploads/${item.image}`
                      }
                      alt={item.name}
                      className="cart-thumb"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="cart-item-info">
                    <div className="item-category-tag">{item.category || "Kids"}</div>
                    <h3
                      className="cart-item-name"
                      onClick={() => navigate(`/product/${item._id}`)}
                    >
                      {item.name}
                    </h3>
                    <div className="cart-item-stock-tag">In Stock • Ready for Dispatch</div>

                    {/* Action Buttons */}
                    <div className="cart-item-actions-row">
                      <button
                        type="button"
                        className="item-action-link wishlist-action"
                        onClick={() => handleMoveToWishlist(item, index)}
                        title="Save this item to your Wishlist"
                      >
                        Save to Wishlist
                      </button>

                      <span className="action-divider">•</span>

                      <button
                        type="button"
                        className="item-action-link delete-action"
                        onClick={() => setItemToRemove({ item, index })}
                        title="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="cart-item-price-box">
                    <div className="item-price-current">₹{item.price}</div>
                    <div className="item-price-inclusive">Incl. all taxes</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT: ORDER SUMMARY ================= */}
        {cart.length > 0 && (
          <div className="cart-summary-panel">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>

              {/* Promo Code Box */}
              <form onSubmit={handleApplyCoupon} className="coupon-box">
                <div className="coupon-input-wrap">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. KIDS20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="apply-coupon-btn">
                    Apply
                  </button>
                </div>
                {couponError && <div className="coupon-err-text">{couponError}</div>}
                {discountPct > 0 && (
                  <div className="coupon-success-text">
                    {discountPct}% discount applied
                  </div>
                )}
              </form>

              {/* Price Lines */}
              <div className="summary-lines-list">
                <div className="summary-line">
                  <span>Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="summary-line discount">
                    <span>Discount ({discountPct}%)</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="summary-line">
                  <span>Shipping & Delivery</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: "#10b981" }}>FREE</strong> : `₹${shippingFee}`}</span>
                </div>

                <div className="summary-line">
                  <span>Estimated Tax (0%)</span>
                  <span>₹0</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-line total-line">
                  <span>Grand Total:</span>
                  <span className="grand-total-val">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="proceed-checkout-btn"
                onClick={() => navigate("/payment")}
              >
                Proceed to Checkout
              </button>

              <div className="checkout-trust-badges">
                <div className="trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  256-bit Secure Razorpay Checkout
                </div>
                <div className="trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  Express 2-3 Day Doorstep Dispatch
                </div>
                <div className="trust-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  100% Quality & Authenticity Guarantee
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          REMOVE CHOICE MODAL
          ========================================================================= */}
      {itemToRemove && (
        <div className="remove-modal-backdrop" onClick={() => setItemToRemove(null)}>
          <div className="remove-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="remove-modal-header">
              <h3>Save this item for later?</h3>
              <button className="remove-modal-close" onClick={() => setItemToRemove(null)}>✕</button>
            </div>

            <p className="remove-modal-desc">
              Would you like to move <strong>"{itemToRemove.item.name}"</strong> to your Wishlist to purchase later?
            </p>

            <div className="remove-modal-item-preview">
              <img
                src={
                  itemToRemove.item.image?.startsWith("http")
                    ? itemToRemove.item.image
                    : `${API_URL}/uploads/${itemToRemove.item.image}`
                }
                alt=""
                className="remove-modal-thumb"
              />
              <div>
                <strong>{itemToRemove.item.name}</strong>
                <div className="preview-price">₹{itemToRemove.item.price}</div>
              </div>
            </div>

            <div className="remove-modal-actions">
              <button
                className="modal-btn move-wishlist-btn"
                onClick={() => handleMoveToWishlist(itemToRemove.item, itemToRemove.index)}
              >
                Move to Wishlist
              </button>

              <button
                className="modal-btn delete-confirm-btn"
                onClick={handleConfirmDelete}
              >
                Remove from Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;