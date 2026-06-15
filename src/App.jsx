import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import ViewProducts from "./admin/pages/ViewProducts";
import Wishlist from "./pages/Wishlist";
import { ToastContainer } from "react-toastify";
import Cart from "./pages/Cart";
import "react-toastify/dist/ReactToastify.css";
import Categories from "./admin/pages/Categories";
import LowStock from "./admin/pages/LowStock";
import Customers from "./admin/pages/Customers";
import Reports from "./admin/pages/Reports";
import Settings from "./admin/pages/Settings";
const App = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
         <Route path="/view-products" element={<ViewProducts />} />
        <Route  path="/cart"  element={<Cart />}/>
        <Route  path="/categories"  element={<Categories />}/>
        <Route
  path="/reports"
  element={<Reports />}
/>
<Route
  path="/settings"
  element={<Settings />}
/>
        <Route
  path="/low-stock"
  element={<LowStock />}
/>
        <Route
  path="/wishlist"
  element={<Wishlist />}
/>
<Route
  path="/customers"
  element={<Customers />}
/>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

    </BrowserRouter>
  );
};

export default App;