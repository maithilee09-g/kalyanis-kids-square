import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import Navbar from "./Navbar";
import Cart from "./Cart";
import Footer from "./Footer";
import Wishlist from "./Wishlist";
import StoreLocator from "./StoreLocator";
import Login from "./Login";
import Payment from "./Payment";
import Admin from "./Admin";
import Home from "./Home";

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("kks_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("kks_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 👤 Current Logged-in User State (Customer or Admin)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("kks_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("kks_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("kks_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("kks_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("kks_user");
    }
  }, [currentUser]);

  function addToCart(product) {
    setCart((prev) => [...prev, product]);
  }

  function removeFromCart(index) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
  }

  function addToWishlist(product) {
    setWishlist((prev) => {
      if (prev.some((p) => p._id === product._id)) return prev;
      return [...prev, product];
    });
  }

  function removeFromWishlist(index) {
    setWishlist((prev) => prev.filter((_, i) => i !== index));
  }

  function handleLogin(userObj) {
    setCurrentUser(userObj);
    if (userObj.role === "admin") {
      sessionStorage.setItem("kks_admin_auth", "true");
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    sessionStorage.removeItem("kks_admin_auth");
    localStorage.removeItem("kks_user");
  }

  return (
    <div>
      {/* 🔝 NAVBAR */}
      <Navbar
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 🔥 ROUTES */}
      <Routes>
        {/* 🏠 HOME → FEATURED LAYOUT */}
        <Route path="/" element={<Home addToCart={addToCart} />} />

        {/* 🛍 PRODUCTS PAGE */}
        <Route
          path="/products"
          element={
            <ProductList
              addToCart={addToCart}
              addToWishlist={addToWishlist}
            />
          }
        />

        {/* 📦 PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
              addToWishlist={addToWishlist}
            />
          }
        />

        {/* 🛒 CART */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              addToWishlist={addToWishlist}
            />
          }
        />

        {/* ❤️ WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              removeFromWishlist={removeFromWishlist}
              addToCart={addToCart}
            />
          }
        />

        {/* 📍 STORE LOCATOR */}
        <Route path="/store-locator" element={<StoreLocator />} />

        {/* 🔐 LOGIN & CUSTOMER ACCOUNT PORTAL */}
        <Route
          path="/login"
          element={
            <Login
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          }
        />

        {/* 💳 PAYMENT */}
        <Route
          path="/payment"
          element={
            <Payment
              cart={cart}
              clearCart={clearCart}
              currentUser={currentUser}
            />
          }
        />

        {/* 🛠 ADMIN DASHBOARD */}
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* 🔻 FOOTER */}
      <Footer />
    </div>
  );
}

export default App;