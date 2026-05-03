import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function Cart({ cart, removeFromCart }) {
  const navigate = useNavigate();


  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ backgroundColor: "#EAEDED", minHeight: "100vh", padding: "20px" }}>

      <div style={{
        display: "flex",
        gap: "20px",
        maxWidth: "1200px",
        margin: "auto"
      }}>

        {/* 🛒 LEFT: ITEMS */}
        <div style={{
          flex: 3,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px"
        }}>

          <h2 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            Shopping Cart
          </h2>

          {cart.length === 0 ? (
            <p>Your cart is empty 😢</p>
          ) : (
            cart.map((item, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "20px",
                padding: "15px 0",
                borderBottom: "1px solid #eee"
              }}>

                {/* IMAGE */}
                <img
                  src={item.image?.startsWith("http") ? item.image : `${API_URL}/uploads/${item.image}`}
                  alt={item.name}
                  onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                />

                {/* DETAILS */}
                <div style={{ flex: 1 }}>

                  <h3 style={{ margin: "0 0 5px 0" }}>{item.name}</h3>

                  <p style={{ color: "green", margin: "5px 0" }}>
                    In stock
                  </p>

                  {/* SIZE */}
                  {item.size && (
                    <p style={{ margin: "5px 0" }}>
                      Size: <b>{item.size}</b>
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => removeFromCart(i)}
                      style={{
                        border: "none",
                        background: "none",
                        color: "#007185",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>

                </div>

                {/* PRICE */}
                <div>
                  <h3>₹{item.price}</h3>
                </div>

              </div>
            ))
          )}
        </div>

        {/* 💰 RIGHT: SUMMARY */}
        <div style={{
          flex: 1,
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          height: "fit-content"
        }}>

          <h3>
            Subtotal ({cart.length} items): 
            <span style={{ fontWeight: "bold" }}> ₹{total}</span>
          </h3>

          <button 
            onClick={() => navigate("/payment")}
            style={{
              width: "100%",
              backgroundColor: "#FFD814",
              border: "1px solid #FCD200",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "15px",
              fontWeight: "bold"
            }}
          >
            Proceed to Buy
          </button>


        </div>

      </div>
    </div>
  );
}

export default Cart;