import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "./api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

const banners = [
  {
    img: "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=2070&q=80",
    title: "Pure Joy",
    subtitle: "Premium Essentials for Your Little Ones"
  },
  {
    img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070",
    title: "Timeless Style",
    subtitle: "Elegant Outfits for Every Occasion"
  },
  {
    img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2070",
    title: "Natural Play",
    subtitle: "Eco-Friendly & Safe Wooden Toys"
  },
  {
    img: "https://in.pinterest.com/pin/620652392405175537/",
    title: "Boutique Luxury",
    subtitle: "Curated Collections for Modern Families"
  }
];

const categoryBanners = {
  Girls: "https://img.freepik.com/premium-photo/cute-kids-girl-with-shopping-bag-pink-background_207225-1554.jpg",
  Boys: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
  Toys: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80",
  Accessories: "https://cdn.fcglcdn.com/brainbees/images/cattemplate/moas25_nonapp_desktop_page_081225_01.jpg",
  Footwear: "https://thumbs.dreamstime.com/b/baby-girls-junior-pink-shoes-banner-perfect-footwear-commercials-retail-offers-wide-poster-copyspace-created-345874992.jpg"
};

const shopTheLookImages = [
  { img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80", title: "Luxe Knits" },
  { img: "https://images.unsplash.com/photo-1544126592-807daa2b5650?auto=format&fit=crop&w=800&q=80", title: "Bath Time Bliss" },
  { img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80", title: "Wooden Play" },
  { img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80", title: "Summer Linen" },
  { img: "https://images.unsplash.com/photo-1471286174890-9c1122cd79fc?auto=format&fit=crop&w=800&q=80", title: "Winter Velour" },
];

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [currentBanner, setCurrentBanner] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get("search") || "";
  const urlCategory = new URLSearchParams(location.search).get("category");

  const isCategoryPage = !!urlCategory;

  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
      setSubcategory("All");
    } else {
      setCategory("All");
    }
  }, [urlCategory]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (!isCategoryPage) {
      const interval = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isCategoryPage]);

  const filteredProducts = (products || []).filter(p =>
    (category === "All" || p.category === category) &&
    (subcategory === "All" || p.subcategory === subcategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFly = (e) => {
    const img = e.currentTarget.parentElement.querySelector("img");
    if (!img) return;

    const flyingImg = img.cloneNode(true);
    const rect = img.getBoundingClientRect();

    flyingImg.style.position = "fixed";
    flyingImg.style.left = rect.left + "px";
    flyingImg.style.top = rect.top + "px";
    flyingImg.style.width = "100px";
    flyingImg.style.height = "100px";
    flyingImg.style.zIndex = "1000";
    flyingImg.style.transition = "all 1s ease-in-out";
    flyingImg.style.borderRadius = "50%";

    document.body.appendChild(flyingImg);

    setTimeout(() => {
      flyingImg.style.left = window.innerWidth - 80 + "px";
      flyingImg.style.top = "20px";
      flyingImg.style.width = "40px";
      flyingImg.style.height = "40px";
      flyingImg.style.opacity = "0.5";
    }, 10);

    setTimeout(() => {
      document.body.removeChild(flyingImg);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* HERO SECTION */}
      <div style={{
        width: "100%",
        height: "400px",
        position: "relative",
        overflow: "hidden",
        marginBottom: "40px",
        borderRadius: isCategoryPage ? "0 0 60px 60px" : "0",
        boxShadow: "0 15px 40px var(--shadow)"
      }}>
        {isCategoryPage ? (
          <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${categoryBanners[category] || banners[0].img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--white)",
          }}>
            <div style={{
              textAlign: "center",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              padding: "30px 60px",
              borderRadius: "30px"
            }}>
              <h1 style={{ fontSize: "2rem", margin: 0, color: "var(--text)", textTransform: "uppercase", letterSpacing: "2px", fontFamily: "'Playfair Display', serif" }}>{category}</h1>
              <p style={{ fontSize: "0.9rem", color: "#666", fontWeight: "400", marginTop: "5px" }}>Discover our delightful {category.toLowerCase()} collection</p>
            </div>
          </div>
        ) : (
          <>
            {banners.map((b, i) => (
              <div key={i} style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${b.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === currentBanner ? 1 : 0,
                transition: "opacity 1s ease-in-out",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{
                  textAlign: "center",
                  background: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                  padding: "20px 40px",
                  borderRadius: "20px",
                  maxWidth: "80%"
                }}>
                  <h1 style={{ fontSize: "1.8rem", margin: "0 0 5px 0", color: "var(--text)", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", letterSpacing: "1px" }}>{b.title}</h1>
                  <p style={{ fontSize: "0.95rem", color: "#444", margin: 0 }}>{b.subtitle}</p>
                </div>
              </div>
            ))}
            <div style={{
              position: "absolute",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "12px",
              zIndex: 10
            }}>
              {banners.map((_, i) => (
                <div key={i}
                  onClick={() => setCurrentBanner(i)}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: i === currentBanner ? "var(--primary)" : "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* SUBCATEGORY FILTERS */}
      <div style={{
        textAlign: "center",
        margin: "30px auto",
        maxWidth: "1000px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px"
      }}>
        <button onClick={() => setSubcategory("All")} style={btn(subcategory === "All")}>All items</button>
        {category === "Girls" && ["Frocks", "Tops", "Jeans", "Nightwear"].map(s => <button key={s} onClick={() => setSubcategory(s)} style={btn(subcategory === s)}>{s}</button>)}
        {category === "Boys" && ["Tshirts", "Shirts", "Jeans", "Nightwear"].map(s => <button key={s} onClick={() => setSubcategory(s)} style={btn(subcategory === s)}>{s}</button>)}
        {category === "Toys" && ["Soft Toys", "Cars", "Dolls"].map(s => <button key={s} onClick={() => setSubcategory(s)} style={btn(subcategory === s)}>{s}</button>)}
        {category === "Footwear" && ["Shoes", "Sandals", "Socks"].map(s => <button key={s} onClick={() => setSubcategory(s)} style={btn(subcategory === s)}>{s}</button>)}
      </div>

      {/* PRODUCT GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "35px",
        padding: "40px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px" }}>
            <h2 style={{ color: "var(--primary)", fontSize: "2.5rem" }}>Oops! No items found 🧸</h2>
            <p>Try exploring another category!</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} style={{
              position: "relative",
              background: "var(--white)",
              padding: "15px",
              borderRadius: "35px",
              textAlign: "center",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              boxShadow: "0 10px 30px var(--shadow)",
              border: "1px solid rgba(255,255,255,0.5)"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 10px 30px var(--shadow)";
              }}
            >
              <div style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                backgroundColor: product.price > 500 ? "var(--primary)" : "var(--accent)",
                color: "white",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
                zIndex: 5,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>
                {product.price > 500 ? "Best Value" : "Must Have"}
              </div>

              <div style={{ borderRadius: "25px", overflow: "hidden", height: "240px", marginBottom: "20px" }}>
                <img
                  src={product.image?.startsWith("http") ? product.image : `${API_URL}/uploads/${product.image}`}
                  alt={product.name}
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: "all 0.6s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>

              <h4 style={{ fontSize: "0.95rem", marginBottom: "8px", color: "var(--text)", fontWeight: "600" }}>{product.name}</h4>
              <p style={{ color: "#d63384", fontWeight: "700", fontSize: "1.1rem", marginBottom: "12px" }}>₹{product.price}</p>

              <button onClick={(e) => {
                addToCart(product);
                handleFly(e);
              }}
                style={{
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  width: "100%",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  boxShadow: "0 8px 15px rgba(255,192,203,0.3)"
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#ffb2c1"; e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--primary)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                Add to Cart 🛒
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const btn = (active) => ({
  margin: "5px",
  padding: "12px 28px",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  backgroundColor: active ? "var(--primary)" : "var(--white)",
  color: active ? "white" : "#666",
  fontWeight: "700",
  fontSize: "0.95rem",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  boxShadow: active ? "0 10px 20px rgba(255,183,197,0.4)" : "0 4px 10px var(--shadow)",
  outline: "none",
  transform: active ? "scale(1.05)" : "scale(1)"
});

export default ProductList;