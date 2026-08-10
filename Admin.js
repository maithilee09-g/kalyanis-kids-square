import React, { useState, useEffect } from "react";
import "./Login.css"; // Reuse some styles or I'll add inline
import API_URL from "./api";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Product Form State
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Girls");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = () => {
    setLoadingOrders(true);
    fetch(`${API_URL}/orders`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingOrders(false);
      });
  };

  const fetchProducts = () => {
    setLoadingProducts(true);
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingProducts(false);
      });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Product deleted! 🗑️");
        fetchProducts(); // Refresh list
      }
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product added successfully! ✅");
        setProductName("");
        setSubcategory("");
        setPrice("");
        setImage(null);
        const fileInput = document.getElementById("productImage");
        if (fileInput) fileInput.value = "";
        fetchProducts(); // Refresh the list
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

  return (
    <div style={{ padding: "40px", backgroundColor: "#f4f7f6", minHeight: "100vh", fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "30px", color: "#333", fontSize: "2.5rem", fontWeight: "800" }}>Admin Dashboard</h1>

        {/* --- ADD PRODUCT SECTION --- */}
        <div style={{ 
          backgroundColor: "white", 
          padding: "30px", 
          borderRadius: "20px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          marginBottom: "40px"
        }}>
          <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Add New Product</h2>
          <form onSubmit={handleProductSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "#64748b" }}>Product Name</label>
              <input 
                type="text" 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                required 
                placeholder="e.g. Silk Party Gown"
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "#64748b" }}>Price (₹)</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
                placeholder="999"
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "#64748b" }}>Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }}
              >
                <option value="Girls">Girls</option>
                <option value="Boys">Boys</option>
                <option value="Toys">Toys</option>
                <option value="Accessories">Accessories</option>
                <option value="Footwear">Footwear</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "#64748b" }}>Subcategory</label>
              <input 
                type="text" 
                value={subcategory} 
                onChange={(e) => setSubcategory(e.target.value)} 
                required 
                placeholder="e.g. Frocks"
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", gridColumn: "span 2" }}>
              <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "#64748b" }}>Product Image</label>
              <input 
                id="productImage"
                type="file" 
                onChange={(e) => setImage(e.target.files[0])} 
                accept="image/*"
                required
                style={{ 
                  padding: "10px", 
                  borderRadius: "8px", 
                  border: "2px dashed #cbd5e1", 
                  backgroundColor: "#f8fafc",
                  cursor: "pointer"
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={uploading}
              style={{ 
                gridColumn: "span 2",
                padding: "15px", 
                backgroundColor: uploading ? "#94a3b8" : "#2563eb", 
                color: "white", 
                border: "none", 
                borderRadius: "12px", 
                fontWeight: "700", 
                fontSize: "1.1rem",
                cursor: uploading ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
            >
              {uploading ? "Uploading Product..." : "Add Product"}
            </button>
          </form>
        </div>

        {/* --- MANAGE PRODUCTS SECTION --- */}
        <div style={{ 
          backgroundColor: "white", 
          padding: "30px", 
          borderRadius: "20px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          marginBottom: "40px"
        }}>
          <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Manage Products</h2>
          {loadingProducts ? <p>Loading products...</p> : (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Image</th>
                    <th style={{ padding: "10px" }}>Name</th>
                    <th style={{ padding: "10px" }}>Category</th>
                    <th style={{ padding: "10px" }}>Price</th>
                    <th style={{ padding: "10px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "10px" }}>
                        <img 
                          src={p.image?.startsWith("http") ? p.image : `${API_URL}/uploads/${p.image}`} 
                          alt="" 
                          style={{ width: "40px", height: "40px", borderRadius: "5px", objectFit: "cover" }} 
                        />
                      </td>
                      <td style={{ padding: "10px" }}>{p.name}</td>
                      <td style={{ padding: "10px" }}>{p.category}</td>
                      <td style={{ padding: "10px" }}>₹{p.price}</td>
                      <td style={{ padding: "10px" }}>
                        <button 
                          onClick={() => handleDeleteProduct(p._id)}
                          style={{ 
                            background: "#fee2e2", 
                            color: "#ef4444", 
                            border: "none", 
                            padding: "5px 10px", 
                            borderRadius: "5px", 
                            cursor: "pointer" 
                          }}
                        >
                          Delete 🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- RECENT ORDERS SECTION --- */}
        <h2 style={{ marginBottom: "20px", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
          Recent Orders
          <button onClick={fetchOrders} style={{ 
            fontSize: "0.8rem", 
            padding: "5px 12px", 
            borderRadius: "20px", 
            border: "1px solid #e2e8f0",
            backgroundColor: "white",
            cursor: "pointer"
          }}>Refresh</button>
        </h2>
        
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "12px", textAlign: "center" }}>
            <h3>No orders found yet.</h3>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {orders.map((order) => (
              <div key={order._id} style={{ 
                backgroundColor: "white", 
                padding: "25px", 
                borderRadius: "16px", 
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "15px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                  <div>
                    <span style={{ color: "#888", fontSize: "0.9rem" }}>Order ID:</span>
                    <span style={{ fontWeight: "600", marginLeft: "8px" }}>#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div>
                    <span style={{ color: "#888", fontSize: "0.9rem" }}>Placed on:</span>
                    <span style={{ fontWeight: "600", marginLeft: "8px" }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ color: "#2563eb", fontWeight: "700", fontSize: "1.2rem" }}>
                    ₹{order.totalAmount}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>Customer Details</h4>
                    <p style={{ margin: "3px 0" }}><strong>{order.customerName}</strong></p>
                    <p style={{ margin: "3px 0", color: "#666" }}>{order.email}</p>
                    <p style={{ margin: "3px 0", color: "#666" }}>{order.address}, {order.city} - {order.zip}</p>
                    
                    <div style={{ marginTop: "15px" }}>
                      <span style={{ 
                        padding: "5px 12px", 
                        borderRadius: "20px", 
                        fontSize: "0.8rem", 
                        fontWeight: "600",
                        backgroundColor: order.paymentMethod === "cod" ? "#fff3e0" : "#e3f2fd",
                        color: order.paymentMethod === "cod" ? "#e65100" : "#1976d2",
                        border: `1px solid ${order.paymentMethod === "cod" ? "#ffe0b2" : "#bbdefb"}`
                      }}>
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid via Card"}
                      </span>
                    </div>
                  </div>

                  <div style={{ flex: 2, minWidth: "300px" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>Items Purchased</h4>
                    <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ textAlign: "center", minWidth: "80px" }}>
                          <img 
                            src={item.image?.startsWith("http") ? item.image : `${API_URL}/uploads/${item.image}`}
                            alt={item.name} 
                            style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", border: "1px solid #eee" }} 
                          />
                          <p style={{ fontSize: "0.7rem", margin: "5px 0", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
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

export default Admin;