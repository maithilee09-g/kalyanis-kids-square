import { useState } from "react";
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

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  function addToCart(product) {
    setCart(prev => [...prev, product]);
  }

  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
  }


  function addToWishlist(product) {
    setWishlist(prev => [...prev, product]);
  }

  function removeFromWishlist(index) {
    setWishlist(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div>

      {/* 🔝 NAVBAR */}
      <Navbar 
        cartCount={cart.length} 
        wishlistCount={wishlist.length}
      />

      {/* 🔥 ROUTES */}
      <Routes>

        {/* 🏠 HOME → FEATURED LAYOUT */}
        <Route 
          path="/" 
          element={
            <Home 
              addToCart={addToCart}
            />
          } 
        />


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
            <ProductDetails addToCart={addToCart} addToWishlist={addToWishlist} />
          } 
        />

        {/* 🛒 CART */}
        <Route 
          path="/cart" 
          element={
            <Cart 
              cart={cart}
              removeFromCart={removeFromCart}
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
            />
          } 
        />

        {/* 📍 STORE LOCATOR */}
        <Route 
          path="/store-locator" 
          element={<StoreLocator />} 
        />

        {/* 🔐 LOGIN */}
        <Route 
          path="/login" 
          element={<Login />} 
        />

        {/* 💳 PAYMENT */}
        <Route 
          path="/payment" 
          element={
            <Payment 
              cart={cart} 
              clearCart={clearCart} 
            />
          } 
        />

        {/* 🛠 ADMIN */}
        <Route 
          path="/admin" 
          element={<Admin />} 
        />



      </Routes>


      {/* 🔻 FOOTER */}
      <Footer />

    </div>
  );
}

export default App; 