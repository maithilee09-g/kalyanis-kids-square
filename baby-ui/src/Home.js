import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

const shopTheLookImages = [
  { img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80", title: "Luxe Knits" },
  { img: "https://thumbs.dreamstime.com/b/bath-time-bliss-colorful-ducks-bath-bombs-rest-pink-tray-bubbles-water-splashes-around-perfect-baby-relaxation-391321950.jpg?w=768", title: "Bath Time Bliss" },
  { img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80", title: "Wooden Play" },
  { img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80", title: "Summer Linen" },
  { img: "https://i.pinimg.com/736x/7e/8f/d9/7e8fd965fd437fa956e2886c3b752e0a.jpg", title: "Winter Velour" },
];

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const featured = products.filter(p => p.price > 800).slice(0, 4);
  const newArrivals = products.slice(-4);

  const banners = [
    {
      img: "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?q=80&w=2070",
      title: "The Newborn Edit",
      subtitle: "Softness and comfort for first moments"
    },
    {
      img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2070",
      title: "Pure Comfort",
      subtitle: "Delicate textures for sensitive skin"
    },
    {
      img: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=2070",
      title: "Boutique Style",
      subtitle: "Curated collections for every occasion"
    }
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: "100px", textAlign: "center", color: "var(--primary)" }}><h2>Preparing the magic... ✨</h2></div>;

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>

      {/* 🌟 AUTO-SLIDING HERO BANNER */}
      <div style={{
        height: "600px",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text)",
        textAlign: "center",
      }}>
        {banners.map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `linear-gradient(rgba(255,209,220,0.1), rgba(250,249,246,0.1)), url('${b.img}?auto=format&fit=crop&w=1600&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === currentBanner ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(12px)",
              padding: "50px 70px",
              borderRadius: "50px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.05)",
              border: "1px solid rgba(255,255,255,0.4)",
              transform: i === currentBanner ? "scale(1)" : "scale(0.9)",
              transition: "transform 1.5s ease-out"
            }}>
              <h1 style={{ fontSize: "2rem", marginBottom: "5px", color: "var(--primary)", letterSpacing: "1px", fontFamily: "'Outfit', sans-serif", fontWeight: "600" }}>{b.title}</h1>
              <p style={{ fontSize: "0.95rem", marginBottom: "25px", fontWeight: "400", color: "#888" }}>{b.subtitle}</p>
              <button
                onClick={() => navigate("/products")}
                style={{
                  padding: "12px 35px",
                  fontSize: "0.9rem",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "50px",
                  cursor: "pointer",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  boxShadow: "0 15px 30px rgba(249, 168, 212, 0.4)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.backgroundColor = "#F472B6"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = "var(--primary)"; }}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}

        {/* Banner Indicators */}
        <div style={{ position: "absolute", bottom: "30px", display: "flex", gap: "12px", zIndex: 10 }}>
          {banners.map((_, i) => (
            <div key={i} onClick={() => setCurrentBanner(i)} style={{
              width: i === currentBanner ? "30px" : "12px",
              height: "12px",
              borderRadius: "10px",
              backgroundColor: i === currentBanner ? "var(--primary)" : "rgba(255,255,255,0.8)",
              cursor: "pointer",
              transition: "all 0.4s ease"
            }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 20px" }}>

        {/* ✨ EDITOR'S CHOICE */}
        <div style={{ marginBottom: "100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--text)", fontWeight: "600" }}>Chosen for You</h2>
            <span onClick={() => navigate("/products")} style={{ color: "var(--primary)", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>View All →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
            {featured.map(p => (
              <ProductCard key={p._id} product={p} addToCart={addToCart} navigate={navigate} />
            ))}
          </div>
        </div>

        {/* 📸 SHOP THE LOOK */}
        <div style={{ padding: "60px 0", marginBottom: "100px", background: "var(--white)", borderRadius: "50px", boxShadow: "0 20px 60px var(--shadow)" }}>
          <h2 style={{ textAlign: "center", fontSize: "1.6rem", marginBottom: "30px", color: "var(--text)", fontWeight: "600" }}>
            The Lookbook
          </h2>
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="mySwiper"
            style={{ width: "100%", paddingBottom: "60px" }}
          >
            {shopTheLookImages.map((item, index) => (
              <SwiperSlide key={index} style={{
                width: "320px",
                height: "480px",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}>
                <img src={item.img} alt={item.title} style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }} />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                  padding: "40px 25px",
                  color: "white",
                  textAlign: "center"
                }}>
                  <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", marginBottom: "20px" }}>{item.title}</h3>
                  <button style={{
                    background: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(15px)",
                    color: "#fff",
                    border: "2px solid rgba(255,255,255,0.5)",
                    padding: "12px 30px",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    transition: "all 0.3s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "var(--primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
                  >View Look</button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 🎁 PROMO SECTION */}
        <div
          onClick={() => navigate("/products?category=Toys")}
          style={{
            minHeight: "400px",
            backgroundColor: "var(--primary)",
            borderRadius: "50px",
            display: "flex",
            overflow: "hidden",
            boxShadow: "0 30px 60px rgba(249, 168, 212, 0.4)",
            marginBottom: "100px",
            cursor: "pointer",
            transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            border: "1px solid rgba(255,255,255,0.3)"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03) translateY(-15px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1) translateY(0)"}
        >
          <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center", color: "white" }}>
            <span style={{ backgroundColor: "rgba(255,255,255,0.2)", width: "fit-content", padding: "5px 12px", borderRadius: "10px", fontWeight: "800", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: "10px" }}>Special Offer</span>
            <h2 style={{ fontSize: "2rem", margin: "0 0 12px 0", color: "white", lineHeight: "1.1", fontWeight: "700" }}>Playtime <br />Paradise</h2>
            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "25px", fontSize: "0.95rem", fontWeight: "300" }}>Get up to 50% off on all plushies and developmental toys.</p>
            <button
              style={{ width: "fit-content", padding: "12px 30px", backgroundColor: "white", color: "var(--primary)", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "800", fontSize: "0.9rem", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              Discover More
            </button>
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80" alt="Promo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to right, var(--primary), transparent)" }} />
          </div>
        </div>


        {/* 🆕 NEW ARRIVALS */}
        <div>
          <h2 style={{ textAlign: "center", marginBottom: "50px", fontSize: "3rem", color: "var(--secondary)" }}>Recently Added</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
            {newArrivals.map(p => (
              <ProductCard key={p._id} product={p} addToCart={addToCart} navigate={navigate} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function ProductCard({ product, addToCart, navigate }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "30px",
        overflow: "hidden",
        boxShadow: "0 15px 40px var(--shadow)",
        transition: "all 0.3s ease",
        position: "relative"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 25px 60px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 15px 40px var(--shadow)";
      }}
    >
      <div style={{ height: "300px", position: "relative", overflow: "hidden" }}>
        <img
          src={product.image?.startsWith("http") ? product.image : `${API_URL}/uploads/${product.image}`}
          alt={product.name}
          onClick={() => navigate(`/product/${product._id}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer", transition: "transform 0.5s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(5px)",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
          color: "var(--primary)"
        }}>
          ♥
        </div>
      </div>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", color: "var(--text)", fontWeight: "600" }}>{product.name}</h3>
        <p style={{ color: "#d63384", fontWeight: "700", fontSize: "1.1rem", margin: "0 0 15px 0" }}>₹{product.price}</p>
        <button
          onClick={() => addToCart(product)}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.75rem",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            transition: "all 0.3s",
            boxShadow: "0 8px 15px rgba(249, 168, 212, 0.2)"
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#F472B6"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(249, 168, 212, 0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 8px 15px rgba(249, 168, 212, 0.2)"; }}
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
}

export default Home;