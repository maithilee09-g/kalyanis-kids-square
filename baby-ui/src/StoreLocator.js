import React from "react";

function StoreLocator() {
  return (
    <div style={{
      padding: "30px",
      backgroundColor: "#fff0f6",
      minHeight: "100vh"
    }}>

      <h2 style={{
        textAlign: "center",
        color: "#ff69b4",
        marginBottom: "30px"
      }}>
        📍 Find Our Store
      </h2>

      {/* 🔥 MAIN CONTAINER */}
      <div style={{
        display: "flex",
        gap: "30px",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start"
      }}>

        {/* 🏪 LEFT SIDE (IMAGE + DETAILS) */}
        <div style={{
          flex: "1",
          minWidth: "300px",
          maxWidth: "450px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
        }}>

          {/* IMAGE */}
          <div style={{ position: "relative", overflow: "hidden", borderRadius: "15px", marginBottom: "20px" }}>
            <img
              src="/storefront.jpg"
              alt="Kalyani Kids Square Storefront"
              style={{
                width: "100%",
                display: "block",
                transition: "transform 0.5s ease",
                cursor: "pointer"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
            <div style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              backgroundColor: "rgba(255, 105, 180, 0.9)",
              color: "white",
              padding: "5px 15px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              Main Branch
            </div>
          </div>



          {/* DETAILS */}
          <h3 style={{ color: "#ff69b4" }}>Kalyani's Kids Square</h3>

          <p><b>📍 Address:</b></p>
          <p>Bhavani Peth, near Sandhana Kanyaparshala</p>
          <p>Barshi, Dist - Solapur</p>

          <p><b>📞 Phone:</b> 9850279030</p>

          <p><b>🕒 Timing:</b> 11 AM – 10 PM</p>

          {/* BUTTONS */}
          <div style={{ marginTop: "15px" }}>

            <a
              href="tel:9850279030"
              style={{
                background: "#ff69b4",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                marginRight: "10px",
                textDecoration: "none"
              }}
            >
              📞 Call
            </a>

            <a
              href="https://www.google.com/maps?q=Bhavani+Peth+Barshi+Solapur"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#131921",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                textDecoration: "none"
              }}
            >
              🗺 Directions
            </a>

          </div>

        </div>

        {/* 🗺 RIGHT SIDE (MAP) */}
        <div style={{
          flex: "1",
          minWidth: "300px",
          maxWidth: "600px",
          background: "#fff",
          padding: "10px",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
        }}>

          <iframe
            src="https://www.google.com/maps?q=Bhavani+Peth+Barshi+Solapur&output=embed"
            width="100%"
            height="400"
            style={{
              border: "0",
              borderRadius: "10px"
            }}
            loading="lazy"
            title="Store Map"
          ></iframe>

        </div>

      </div>

    </div>
  );
}

export default StoreLocator;