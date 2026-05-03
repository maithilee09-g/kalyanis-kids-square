import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";
import API_URL from "./api";

const Payment = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const buyNowItem = location.state?.buyNowItem;
  const displayItems = buyNowItem ? [buyNowItem] : cart;

  const subtotal = displayItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === "expiry") {
      const formatted = value.replace(/\D/g, "").replace(/(.{2})/, "$1/").trim().slice(0, 5);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === "cvv") {
      const formatted = value.replace(/\D/g, "").slice(0, 3);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
      return;
    }

    setLoading(true);

    const orderData = {
      customerName: formData.name,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      totalAmount: total,
      items: displayItems,
      paymentMethod: paymentMethod
    };

    try {
      const response = await fetch("${API_URL}/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          if (!buyNowItem) clearCart();
          navigate("/");
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Order failed: ${errorData.error || "Please try again."}`);
        setLoading(false);
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Network error: Could not connect to the server. Please ensure the backend is running on port 5005.");
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const orderRes = await fetch("${API_URL}/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total })
      });
      const orderData = await orderRes.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_SjMKDR5SbjVogc", 
        amount: orderData.amount,
        currency: "INR",
        name: "Kalyani's Kids Square",
        description: "Payment for your order",
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify payment on backend
          const verifyRes = await fetch("${API_URL}/razorpay-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                customerName: formData.name,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                zip: formData.zip,
                totalAmount: total,
                items: displayItems,
              }
            })
          });

          if (verifyRes.ok) {
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => {
              if (!buyNowItem) clearCart();
              navigate("/");
            }, 3000);
          } else {
            alert("Payment verification failed!");
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#FFC0CB",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      alert("Error initializing Razorpay payment.");
      setLoading(false);
    }
  };



  if (displayItems.length === 0 && !showSuccess) {
    return (
      <div className="payment-container" style={{ textAlign: "center", paddingTop: "100px" }}>
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate("/")} className="pay-button" style={{ width: "200px" }}>Go Shopping</button>
      </div>
    );
  }

  return (
    <div className="payment-container">
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-icon">✓</div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your order. Redirecting you to home...</p>
        </div>
      )}

      <div className="payment-wrapper">
        {/* LEFT SIDE - FORMS */}
        <div className="payment-left">
          <form onSubmit={handlePayment}>
            <div className="payment-card">
              <h2>Payment Method</h2>
              <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                <div 
                  onClick={() => setPaymentMethod("razorpay")}
                  style={{
                    flex: 1,
                    padding: "15px",
                    border: paymentMethod === "razorpay" ? "2px solid var(--primary)" : "1px solid #ddd",
                    borderRadius: "12px",
                    cursor: "pointer",
                    textAlign: "center",
                    backgroundColor: paymentMethod === "razorpay" ? "#f5f5f5" : "transparent",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === "razorpay" ? "#333" : "#999"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                  <span style={{ fontWeight: "600", color: paymentMethod === "razorpay" ? "#333" : "#666" }}>Razorpay (Secure)</span>
                </div>
                <div 
                  onClick={() => setPaymentMethod("cod")}
                  style={{
                    flex: 1,
                    padding: "15px",
                    border: paymentMethod === "cod" ? "2px solid #333" : "1px solid #eee",
                    borderRadius: "12px",
                    cursor: "pointer",
                    textAlign: "center",
                    backgroundColor: paymentMethod === "cod" ? "#f5f5f5" : "transparent",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={paymentMethod === "cod" ? "#333" : "#999"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </div>
                  <span style={{ fontWeight: "600", color: paymentMethod === "cod" ? "#333" : "#666" }}>Cash on Delivery</span>
                </div>
              </div>
            </div>

            <div className="payment-card">
              <h2>Shipping Address</h2>

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Shipping Address</label>
                <input 
                  type="text" 
                  name="address" 
                  required 
                  placeholder="123 Street, Area" 
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="row">
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    name="city" 
                    required 
                    placeholder="Mumbai" 
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input 
                    type="text" 
                    name="zip" 
                    required 
                    placeholder="400001" 
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="payment-card">
                <p>Card payment is currently disabled. Please use Razorpay for secure checkout.</p>
              </div>
            )}
            
            {paymentMethod === "cod" && (
              <div className="payment-card" style={{ backgroundColor: "#fff9f0", border: "1px dashed #ff9800" }}>
                <h3 style={{ color: "#e65100", margin: "0 0 10px 0" }}>Cash on Delivery Selected</h3>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                  You will pay the total amount in cash when your order is delivered.
                </p>
              </div>
            )}

            
            <button 
              type="submit" 
              className="pay-button" 
              disabled={loading}
            >
              {loading ? "Processing..." : paymentMethod === "cod" ? `Place Order (COD) - ₹${total}` : `Pay ₹${total}`}
            </button>

          </form>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div className="payment-right">
          <div className="payment-card">
            <h2>Order Summary</h2>
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
              {displayItems.map((item, index) => (
                <div key={index} className="summary-item" style={{ marginBottom: "15px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} 
                    />
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{item.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#888" }}>Qty: {item.quantity || 1}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: "600" }}>₹{item.price * (item.quantity || 1)}</div>
                </div>
              ))}
            </div>
            
            <div className="summary-item">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
