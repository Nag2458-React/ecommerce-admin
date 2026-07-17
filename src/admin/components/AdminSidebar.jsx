import React from "react";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaTags,
  FaServer,
  FaExclamationTriangle,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");

    alert("Admin Logout Successfully");

    navigate("/login");
  };

  return (
    <div
      className="bg"
      
    >
      <div className="bgdark p-3 h-100">
        <h3 className="text-center mb-4 text-white">ADMIN PANEL</h3>

        <hr className="text-secondary" />

        <ul className="nav flex-column">
          {/* Dashboard */}

          <li className="nav-item mb-2">
            <Link to="/dashboard" className="nav-link text-white">
              <FaTachometerAlt />
              <span className="ms-2">Dashboard</span>
            </Link>
          </li>

          {/* Add Product */}

          <li className="nav-item mb-2">
            <Link to="/products" className="nav-link text-white">
              <FaBoxOpen />
              <span className="ms-2">Add Product</span>
            </Link>
          </li>

          {/* View Products */}

          <li className="nav-item mb-2">
            <Link to="/view-products" className="nav-link text-white">
              <FaBoxOpen />
              <span className="ms-2">View Products</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/top-selling-products" className="nav-link text-white">
              <FaBoxOpen />
              <span className="ms-2">Top Selling Products</span>
            </Link>
          </li>
       <li className="nav-item mb-2">
            <Link to="/admin/recent-products" className="nav-link text-white">
              <FaBoxOpen />
              <span className="ms-2">Recent Products</span>
            </Link>
          </li>
           <li className="nav-item mb-2">
            <Link to="/admin/orders" className="nav-link text-white">
              <FaShoppingCart />
              <span className="ms-2">Placed Orders</span>
            </Link>
          </li>
       <li className="nav-item mb-2">
            <Link to="/apicruds" className="nav-link text-white">
              <FaCog />
              <span className="ms-2">API Cruds</span>
            </Link>
          </li>
<li className="nav-item mb-2">
            <Link to="/cruds" className="nav-link text-white">
              <FaCog />
              <span className="ms-2">Cruds</span>
            </Link>
          </li>
          {/* Categories */}

          <li className="nav-item mb-2">
            <Link to="/categories" className="nav-link text-white">
              <FaTags />
              <span className="ms-2">Categories</span>
            </Link>
          </li>

          {/* Low Stock */}

          <li className="nav-item mb-2">
            <Link to="/low-stock" className="nav-link text-white">
              <FaExclamationTriangle />
              <span className="ms-2">Low Stock</span>
            </Link>
          </li>

          {/* Orders */}

         

          {/* Customers */}

          <li className="nav-item mb-2">
            <Link to="/customers" className="nav-link text-white">
              <FaUsers />
              <span className="ms-2">Customers</span>
            </Link>
          </li>

          {/* Reports */}

          <li className="nav-item mb-2">
            <Link to="/reports" className="nav-link text-white">
              <FaChartBar />
              <span className="ms-2">Reports</span>
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link to="/admin/system-status" className="nav-link text-white">
              <FaChartBar />
              <span className="ms-2"> System Status</span>
            </Link>
          </li>
          {/* Settings */}

          <li className="nav-item mb-2">
            <Link to="/settings" className="nav-link text-white">
              <FaCog />
              <span className="ms-2">Settings</span>
            </Link>
          </li>

          {/* Logout */}

          <li className="mt-3" style={{position:"sticky",bottom:"0"}}>
            <button type="submit" className="btn btndanger w-100" onClick={handleLogout}>
              <FaSignOutAlt />
              <span className="ms-2">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
