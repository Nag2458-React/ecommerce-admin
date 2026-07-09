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
import UserProtectedRoute from "./UserProtectedRoute";
import SessionManager from "./SessionManager";
import MyOrders from "./pages/MyOrders";
import Cruds from "./Cruds";
import ApiCruds from "./ApiCruds";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders.jsx";
import ProductDetails from "./pages/ProductDetails";
import AdminOrders from "./admin/pages/AdminOrders";
import TopSellingProducts from "./admin/pages/TopSellingProducts";
import RecentProducts from "./admin/pages/RecentProducts";
import Footer from "./pages/Footer";
import SystemStatus from "./admin/pages/SystemStatus";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import WhatsappOrder from "./pages/WhatsappOrder";


const App = () => {
  return (
     <WishlistProvider>
       <CartProvider>
    <BrowserRouter>
      <div className="main flex-grow-1">
        <SessionManager />
        <Routes>
          <Route
            path="/"
            element={
              <UserProtectedRoute>
                <Home />
              </UserProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/view-products" element={<ViewProducts />} />
          <Route
  path="/whatsapp-order"
  element={<WhatsappOrder />}
/>
          <Route
            path="/cart"
            element={
              <UserProtectedRoute>
                <Cart />
              </UserProtectedRoute>
            }
          />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cruds" element={<Cruds />} />
          <Route path="/apicruds" element={<ApiCruds />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/low-stock" element={<LowStock />} />
          <Route
            path="/wishlist"
            element={
              <UserProtectedRoute>
                <Wishlist />
              </UserProtectedRoute>
            }
          />
          <Route path="/customers" element={<Customers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/system-status" element={<SystemStatus />} />
          <Route
            path="/admin/top-selling-products"
            element={<TopSellingProducts />}
          />
          <Route path="/admin/recent-products" element={<RecentProducts />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </div>
      <Footer />
    </BrowserRouter>
    </CartProvider>
    </WishlistProvider>
  );
};

export default App;
