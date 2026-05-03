function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--bg)",
      color: "var(--text)",
      textAlign: "center",
      padding: "80px 20px",
      marginTop: "100px",
      borderTop: "2px solid var(--shadow)",
      fontFamily: "'Nunito', sans-serif"
    }}>
      <h3 style={{ 
        fontFamily: "'Baloo 2', cursive", 
        fontSize: "2.2rem", 
        color: "var(--primary)",
        marginBottom: "10px" 
      }}>Kalyani's Kids Square</h3>
      <p style={{ fontSize: "1.1rem", color: "#888", marginBottom: "30px" }}>Creating magical moments for your little ones since 2010 ✨</p>
      
      <div style={{ 
        margin: "30px 0", 
        fontSize: "2rem", 
        display: "flex", 
        justifyContent: "center", 
        gap: "40px" 
      }}>
        <span style={{ cursor: "pointer", transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>📸</span> 
        <span style={{ cursor: "pointer", transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>📘</span> 
        <span style={{ cursor: "pointer", transition: "transform 0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.3)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>🐦</span>
      </div>

      <div style={{ maxWidth: "600px", margin: "40px auto", borderTop: "1px solid #eee", paddingTop: "30px" }}>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>© 2026 Kalyani's Kids Square Premium Baby Store. All rights reserved.</p>
        <p style={{ fontSize: "0.8rem", color: "#ccc", marginTop: "10px" }}>Privacy Policy | Terms of Service | Contact Us</p>
      </div>
    </footer>
  );
}

export default Footer;