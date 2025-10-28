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
      </Routes>
    </Router>
  );
}

export default App;
