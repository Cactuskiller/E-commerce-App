import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Onboarding from "./pages/Onboarding";
import AuthForm from "./pages/AuthForm";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import ProductPage from "./pages/product";
import Checkout from "./pages/Checkout";
import ShoppingCart from "./pages/shopingCart";
import ProductListPage from "./pages/ProductListPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id?" element={<ProductPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/products/:type/:id" element={<ProductListPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
