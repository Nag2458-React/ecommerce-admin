// src/components/Navbar.jsx

import React, { useState, useEffect } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";

import { auth } from "../firebase/firebase";

import {
  FaHome,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaSignOutAlt,
  FaDownload,
} from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
const Navbar = () => {
  const navigate = useNavigate();

  const user = localStorage.getItem("currentUser");
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  useEffect(() => {
    const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);

    setCartCount(totalQty);
  }, [cart]);
  useEffect(() => {
    setWishlistCount(wishlist.length);
  }, [wishlist]);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserUid"); // <-- Add this

      localStorage.removeItem("user");
      localStorage.removeItem("admin");
      localStorage.removeItem("adminData");
      localStorage.removeItem("loginTime");

      navigate("/login", {
        replace: true,
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          Shop
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link text-danger fw-bold" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link position-relative text-danger fw-bold"
                    : "nav-link position-relative"
                }
              >
                Wishlist
                <span
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginLeft: "4px",
                  }}
                >
                  <FaHeart
                    style={{
                      fontSize: "22px",
                      color: wishlistCount > 0 ? "#ff1744" : "white",
                    }}
                  />

                  {wishlistCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-10px",
                        background: "#fff",
                        color: "#ff1744",
                        borderRadius: "50%",
                        fontSize: "10px",
                        fontWeight: "bold",
                        minWidth: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #ff1744",
                      }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link position-relative text-danger fw-bold"
                    : "nav-link position-relative"
                }
              >
                <FaShoppingCart className="me-1" />
                Cart
                {cartCount > 0 && (
                  <span
                    className="
                    position-absolute
                    
                    
                    translate-middle
                    badge
                    rounded-pill
                    
                    badg
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/myorders"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link position-relative text-danger fw-bold"
                    : "nav-link position-relative"
                }
              >
                <FaClipboardList className="me-1" />
                My Orders
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link position-relative text-danger fw-bold"
                    : "nav-link position-relative"
                }
              >
                <FaUser className="me-1" />
                Profile
              </NavLink>
            </li>
            <li>
           <a
  href="https://github.com/Nag2458-React/ecommerce-admin/releases/latest/download/app-debug.apk"
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-success ms-2"
>
  <FaDownload className="me-1" />
  Download App
</a>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <span className="e-text me-3">{user}</span>

            <button
              type="button"
              className="btn btn-danger btn-log"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
