import React from "react";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaTags,
  FaExclamationTriangle,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import {
  Link,
  useNavigate,
} from "react-router-dom";

const AdminSidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("admin");

    alert("Admin Logout Successfully");

    navigate("/login");
  };

  return (

    <div
      className="bg-dark text-white p-3"
      style={{
        width: "260px",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
      }}
    >

      <h3 className="text-center mb-4">
        ADMIN PANEL
      </h3>

      <hr className="text-secondary" />

      <ul className="nav flex-column">

        {/* Dashboard */}

        <li className="nav-item mb-2">
          <Link
            to="/dashboard"
            className="nav-link text-white"
          >
            <FaTachometerAlt />
            <span className="ms-2">
              Dashboard
            </span>
          </Link>
        </li>

        {/* Add Product */}

        <li className="nav-item mb-2">
          <Link
            to="/products"
            className="nav-link text-white"
          >
            <FaBoxOpen />
            <span className="ms-2">
              Add Product
            </span>
          </Link>
        </li>

        {/* View Products */}

        <li className="nav-item mb-2">
          <Link
            to="/view-products"
            className="nav-link text-white"
          >
            <FaBoxOpen />
            <span className="ms-2">
              View Products
            </span>
          </Link>
        </li>

        {/* Categories */}

        <li className="nav-item mb-2">
          <Link
            to="/categories"
            className="nav-link text-white"
          >
            <FaTags />
            <span className="ms-2">
              Categories
            </span>
          </Link>
        </li>

        {/* Low Stock */}

        <li className="nav-item mb-2">
          <Link
            to="/low-stock"
            className="nav-link text-white"
          >
            <FaExclamationTriangle />
            <span className="ms-2">
              Low Stock
            </span>
          </Link>
        </li>

        {/* Orders */}

        <li className="nav-item mb-2">
          <Link
            to="/orders"
            className="nav-link text-white"
          >
            <FaShoppingCart />
            <span className="ms-2">
              Orders
            </span>
          </Link>
        </li>

        {/* Customers */}

        <li className="nav-item mb-2">
          <Link
            to="/customers"
            className="nav-link text-white"
          >
            <FaUsers />
            <span className="ms-2">
              Customers
            </span>
          </Link>
        </li>

        {/* Reports */}

        <li className="nav-item mb-2">
          <Link
            to="/reports"
            className="nav-link text-white"
          >
            <FaChartBar />
            <span className="ms-2">
              Reports
            </span>
          </Link>
        </li>

        {/* Settings */}

        <li className="nav-item mb-2">
          <Link
            to="/settings"
            className="nav-link text-white"
          >
            <FaCog />
            <span className="ms-2">
              Settings
            </span>
          </Link>
        </li>

        {/* Logout */}

        <li className="mt-5">
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span className="ms-2">
              Logout
            </span>
          </button>
        </li>

      </ul>

    </div>
  );
};

export default AdminSidebar;