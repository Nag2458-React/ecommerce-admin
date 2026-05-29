import React from "react";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");

    alert("Admin Logout");

    navigate("/login");
  };

  return (
    <div
      className="
        bg-dark
        text-white
        p-3
      "
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <h3
        className="
          text-center
          mb-4
        "
      >
        ADMIN PANEL
      </h3>

      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link
            to="/dashboard"
            className="
              nav-link
              text-white
            "
          >
            <FaTachometerAlt />

            <span className="ms-2">Dashboard</span>
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link
            to="/products"
            className="
              nav-link
              text-white
            "
          >
            <FaBoxOpen />

            <span className="ms-2">Products</span>
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link
            to="/orders"
            className="
              nav-link
              text-white
            "
          >
            <FaShoppingCart />

            <span className="ms-2">Orders</span>
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link
            to="/customers"
            className="
              nav-link
              text-white
            "
          >
            <FaUsers />

            <span className="ms-2">Customers</span>
          </Link>
        </li>

        <li className="mt-5">
          <button
            className="
              btn
              btn-danger
              w-100
            "
            onClick={handleLogout}
          >
            <FaSignOutAlt />

            <span className="ms-2">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
