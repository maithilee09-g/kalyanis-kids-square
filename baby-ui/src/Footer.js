import React from "react";

function Footer() {
  return (
    <footer style={{
      backgroundColor: "#ffffff",
      color: "#334155",
      textAlign: "center",
      padding: "60px 20px 40px",
      marginTop: "80px",
      borderTop: "1px solid #e2e8f0",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: "1.8rem", 
        fontWeight: "800",
        color: "#0f172a",
        letterSpacing: "1px",
        marginBottom: "8px" 
      }}>Kalyani's Kids Square</h3>
      <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "24px" }}>
        Premium Kids Fashion & Thoughtfully Crafted Baby Essentials
      </p>
      
      <div style={{ 
        margin: "20px 0", 
        display: "flex", 
        justifyContent: "center", 
        gap: "24px" 
      }}>
        {/* Instagram SVG */}
        <span style={{ cursor: "pointer", color: "#64748b", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#ec4899"} onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
        </span>
        {/* Facebook SVG */}
        <span style={{ cursor: "pointer", color: "#64748b", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#3b82f6"} onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </span>
        {/* Twitter/X SVG */}
        <span style={{ cursor: "pointer", color: "#64748b", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#0f172a"} onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
        </span>
      </div>

      <div style={{ maxWidth: "600px", margin: "30px auto 0", borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "0 0 6px 0" }}>© 2026 Kalyani's Kids Square. All rights reserved.</p>
        <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>Privacy Policy • Terms of Service • Contact Support</p>
      </div>
    </footer>
  );
}

export default Footer;