import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "./api";

function ProductDetails({ addToCart, addToWishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [advisorData, setAdvisorData] = useState({ age: "", height: "", weight: "" });
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isAiCalculating, setIsAiCalculating] = useState(false);

  const [matchingProducts, setMatchingProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const item = data.find(p => p._id === id);
        setProduct(item);
        
        // Smart Matching Logic
        if (item && (item.subcategory === "Frocks" || item.category === "Girls")) {
          const matching = data.filter(p => p.category === "Footwear").slice(0, 2);
          setMatchingProducts(matching);
        } else if (item && item.category === "Boys") {
          const matching = data.filter(p => p.category === "Footwear" && p.name.toLowerCase().includes("boy")).slice(0, 2);
          if (matching.length === 0) {
            setMatchingProducts(data.filter(p => p.category === "Footwear").slice(0, 2));
          } else {
            setMatchingProducts(matching);
          }
        }
      })
      .catch(err => console.error("Error fetching product details:", err));
  }, [id]);

  const predictSize = () => {
    setIsAiCalculating(true);
    setAiRecommendation(null);

    // Simulate "AI" thinking
    setTimeout(() => {
      const { age, height, weight } = advisorData;
      const h = parseFloat(height);
      const w = parseFloat(weight);
      const a = parseFloat(age);

      let recommended = "M"; // Default

      if (h < 75 || w < 9 || a < 12) {
        recommended = "S";
      } else if (h > 95 || w > 14 || a > 36) {
        recommended = "L";
      } else {
        recommended = "M";
      }

      setAiRecommendation(recommended);
      setIsAiCalculating(false);
      setSize(recommended); // Auto-select the size
    }, 1500);
  };

  if (!product) return <div style={{ textAlign: "center", padding: "100px" }}><h2 style={{ color: "var(--primary)" }}>Gathering details... ✨</h2></div>;

  return (
    <div style={{ padding: "30px 20px", backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        display: "flex",
        gap: "30px",
        backgroundColor: "var(--white)",
        padding: "25px",
        borderRadius: "35px",
        boxShadow: "0 20px 60px var(--shadow)",
        flexWrap: "wrap"
      }}>

        {/* IMAGE */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <img
            src={product.image?.startsWith("http") ? product.image : `${API_URL}/uploads/${product.image}`}
            alt={product.name}
            style={{
              width: "100%",
              height: "350px",
              objectFit: "cover",
              borderRadius: "25px",
              boxShadow: "0 10px 25px var(--shadow)"
            }}
          />
        </div>

        {/* DETAILS */}
        <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <h1 style={{ fontSize: "1.5rem", color: "var(--text)", fontFamily: "'Outfit', sans-serif", margin: 0 }}>{product.name}</h1>
            <button
              onClick={() => addToWishlist(product)}
              style={{
                background: "white",
                border: "2px solid #eee",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                fontSize: "1.2rem",
                color: "#ff6b81"
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff0f3"; e.currentTarget.style.borderColor = "#ffccd5"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.borderColor = "#eee"; }}
            >
              ❤
            </button>
          </div>
          <p style={{ color: "#d63384", fontSize: "1.3rem", fontWeight: "800", marginBottom: "20px" }}>
            ₹{product.price}
          </p>

          {["Girls", "Boys", "Footwear"].includes(product.category) && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.75rem", margin: 0 }}>Select Size</h4>
                <button
                  onClick={() => setShowAdvisor(!showAdvisor)}
                  style={{ background: "none", border: "none", color: "#333", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                >
                  {showAdvisor ? "Close Advisor" : "AI Size Advisor "}
                </button>
              </div>

              {showAdvisor && (
                <div style={{ backgroundColor: "#fdf8f9", padding: "20px", borderRadius: "18px", marginBottom: "15px", border: "1px dashed #333" }}>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                    <input
                      placeholder="Age (Months)"
                      type="number"
                      value={advisorData.age}
                      onChange={e => setAdvisorData({ ...advisorData, age: e.target.value })}
                      style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #eee", fontSize: "0.85rem" }}
                    />
                    <input
                      placeholder="Height (cm)"
                      type="number"
                      value={advisorData.height}
                      onChange={e => setAdvisorData({ ...advisorData, height: e.target.value })}
                      style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #eee", fontSize: "0.85rem" }}
                    />
                    <input
                      placeholder="Weight (kg)"
                      type="number"
                      value={advisorData.weight}
                      onChange={e => setAdvisorData({ ...advisorData, weight: e.target.value })}
                      style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #eee", fontSize: "0.85rem" }}
                    />
                  </div>
                  <button
                    onClick={predictSize}
                    disabled={isAiCalculating || !advisorData.age || !advisorData.height || !advisorData.weight}
                    style={{ width: "100%", padding: "12px", background: "#333", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem" }}
                  >
                    {isAiCalculating ? "AI is Analyzing..." : "Get Recommended Size 🔥"}
                  </button>

                  {aiRecommendation && (
                    <div style={{ marginTop: "15px", textAlign: "center", color: "var(--text)", fontSize: "0.95rem", fontWeight: "600" }}>
                      AI Suggests Size: <span style={{ color: "#333", fontSize: "1.2rem" }}>{aiRecommendation}</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", gap: "8px" }}>
                {["S", "M", "L"].map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      transition: "all 0.3s",
                      border: size === s ? "2px solid var(--primary)" : "2px solid #eee",
                      backgroundColor: size === s ? "#333" : "var(--white)",
                      color: size === s ? "white" : "#666",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.75rem" }}>Quantity</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ width: "35px", height: "35px", borderRadius: "50%", border: "2px solid #eee", backgroundColor: "white", cursor: "pointer", fontSize: "1rem", fontWeight: "700", color: "#666" }}
              >-</button>
              <span style={{ fontSize: "1.2rem", fontWeight: "700", width: "25px", textAlign: "center" }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{ width: "35px", height: "35px", borderRadius: "50%", border: "2px solid #eee", backgroundColor: "white", cursor: "pointer", fontSize: "1rem", fontWeight: "700", color: "#666" }}
              >+</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => addToCart({ ...product, size, quantity })}
              style={{
                flex: 1,
                padding: "15px",
                backgroundColor: "#333",
                color: "white",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.9rem",
                transition: "all 0.3s",
                boxShadow: "0 8px 15px rgba(0,0,0,0.15)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Add to Cart 🛒
            </button>

            <button
              onClick={() => navigate("/payment", { state: { buyNowItem: { ...product, size, quantity } } })}
              style={{
                flex: 1,
                padding: "15px",
                backgroundColor: "var(--warm)",
                color: "#2c3e50",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.9rem",
                transition: "all 0.3s",
                boxShadow: "0 8px 15px rgba(255,218,185,0.4)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Buy Now ⚡
            </button>
          </div>

        </div>
      </div>

      {/* SMART MATCHING SECTION */}
      {matchingProducts.length > 0 && (
        <div style={{ maxWidth: "700px", margin: "40px auto 0 auto" }}>
          <h3 style={{ fontSize: "1.1rem", color: "var(--text)", marginBottom: "20px", fontFamily: "'Outfit', sans-serif", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
            Complete the Look ✨ <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: "normal" }}>(Smart Match)</span>
          </h3>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {matchingProducts.map(match => (
              <div key={match._id} style={{ 
                flex: 1, 
                minWidth: "150px", 
                background: "white", 
                padding: "12px", 
                borderRadius: "20px", 
                boxShadow: "0 10px 25px var(--shadow)",
                textAlign: "center"
              }}>
                <img 
                  src={match.image?.startsWith("http") ? match.image : `${API_URL}/uploads/${match.image}`}
                  alt={match.name}
                  style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "15px", marginBottom: "10px", cursor: "pointer" }}
                  onClick={() => navigate(`/product/${match._id}`)}
                />
                <p style={{ fontSize: "0.8rem", fontWeight: "600", marginBottom: "5px", color: "var(--text)" }}>{match.name}</p>
                <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--primary)", marginBottom: "10px" }}>₹{match.price}</p>
                <button 
                  onClick={() => addToCart({...match, size: "M", quantity: 1})}
                  style={{ width: "100%", padding: "8px", background: "#333", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "700" }}
                >
                  Add Matching 🛒
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;