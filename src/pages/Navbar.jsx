// src/components/Navbar.jsx

import React, {
  useState,
  useEffect,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "../firebase/firebase";

import {
  FaHome,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {

  const navigate =
    useNavigate();

  const user =
    localStorage.getItem(
      "currentUser"
    );

  const [cartCount,
    setCartCount] =
    useState(0);

  useEffect(() => {

    const loadCart = () => {

      const cart =
        JSON.parse(
          localStorage.getItem(
            `cart_${user}`
          )
        ) || [];

      const totalQty =
        cart.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.qty || 1
            ),
          0
        );

      setCartCount(
        totalQty
      );
    };

    loadCart();

    window.addEventListener(
      "cartUpdated",
      loadCart
    );

    return () => {

      window.removeEventListener(
        "cartUpdated",
        loadCart
      );

    };

  }, [user]);

  const handleLogout = async () => {
  try {

    await signOut(auth);

    localStorage.removeItem("currentUser");
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

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">

      <div className="container">

        <Link
          className="navbar-brand fw-bold"
          to="/"
        >
          Shop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >

          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link
                to="/"
                className="nav-link"
              >
                <FaHome className="me-1" />
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/wishlist"
                className="nav-link"
              >
                <FaHeart className="me-1" />
                Wishlist
              </Link>
            </li>

            <li className="nav-item">

              <Link
                to="/cart"
                className="nav-link position-relative"
              >

                <FaShoppingCart className="me-1" />

                Cart

                {cartCount > 0 && (

                  <span
                    className="
                    position-absolute
                    
                    start-100
                    translate-middle
                    badge
                    rounded-pill
                    bg-danger
                    badg
                    "
                  >
                    {cartCount}
                  </span>

                )}

              </Link>

            </li>

            <li className="nav-item">
              <Link
                to="/myorders"
                className="nav-link"
              >
                <FaClipboardList className="me-1" />
                My Orders
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/profile"
                className="nav-link"
              >
                <FaUser className="me-1" />
                Profile
              </Link>
            </li>

          </ul>

          <div className="d-flex align-items-center">

            <span className="text-white me-3">
              {user}
            </span>

            <button
              type="button"
              className="btn btn-danger"
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