import API_URL from "./api";

function Wishlist({ wishlist }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>❤️ Wishlist</h2>

      {wishlist.length === 0 ? (
        <p style={{ textAlign: "center" }}>No items in wishlist 😢</p>
      ) : (
        wishlist.map((item, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            margin: "15px 0",
            padding: "10px",
            borderBottom: "1px solid #ddd"
          }}>

            <img
              src={item.image?.startsWith("http") ? item.image : `${API_URL}/uploads/${item.image}`}
              alt={item.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />

            <div>
              <h4>{item.name}</h4>
              <p style={{ color: "green" }}>₹{item.price}</p>
            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default Wishlist;