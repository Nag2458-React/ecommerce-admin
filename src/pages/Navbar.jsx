// src/components/Navbar.jsx

import React, { useState, useEffect } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { Capacitor } from "@capacitor/core";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";
// import logo from "../../public/images/logo.png"
import {
  FaHome,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaSignOutAlt,
  FaDownload,
  FaBell,
  FaCog,
  FaGift,
  FaStar,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
const Navbar = () => {
  const navigate = useNavigate();
const { theme, toggleTheme } = useTheme();
  const user = localStorage.getItem("currentUser");
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const [showProfileMenu, setShowProfileMenu] = useState(false);
const [userName, setUserName] = useState("");
const [profileImage, setProfileImage] = useState("");
const [isNativeApp, setIsNativeApp] = useState(false);


  useEffect(() => {
    const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);

    setCartCount(totalQty);
  }, [cart]);
  useEffect(() => {
    setWishlistCount(wishlist.length);
  }, [wishlist]);

  useEffect(() => {
  if (!user) return;

  const q = query(
    collection(db, "notifications"),
    where("userEmail", "==", user),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNotifications(list);
  });

  return () => unsubscribe();
}, [user]);

useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
    if (!currentUser) return;

    const unsubscribeDoc = onSnapshot(
      doc(db, "users", currentUser.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          console.log("Navbar Data:", data);

          setUserName(data.name || "");
          setProfileImage(data.profileImage || "");
        }
      }
    );

    return () => unsubscribeDoc();
  });

  return () => unsubscribeAuth();
}, []);

useEffect(() => {
  setIsNativeApp(Capacitor.isNativePlatform());

  console.log("Native App:", Capacitor.isNativePlatform());
}, []);

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
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm p-0">
      <div className="container">
        <NavLink className="navbar-brand fw-bold p-0" to="/" style={{margin:"0 "}}>
        <img
  src="/images/logo.png"
  alt="Logo"
  style={{ width: "80px" }}
/>
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

            {/* <li className="nav-item">
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
            </li> */}
          
          </ul>

          <div className="d-flex align-items-center">
            {/* <span className="e-text me-3">{user}</span> */}
            <div className="position-relative me-3"  onMouseEnter={() => setShowProfileMenu(true)}
  onMouseLeave={() => setShowProfileMenu(false)}>

  <div
    className="d-flex align-items-center text-white"
    style={{ cursor: "pointer" }}
    // onClick={() => setShowProfileMenu(!showProfileMenu)}
  >
  {profileImage ? (
  <img
  key={profileImage}
  src={profileImage}
  alt="Profile"
  style={{
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #fff",
  }}
/>
) : (
  <div
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#fff",
      color: "#dc3545",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "18px",
    }}
  >
    {(userName || user)?.charAt(0).toUpperCase()}
  </div>
)}

    <div className="ms-2 d-none d-lg-block">
      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        {user?.split("@")[0]}
      </div>

      {/* <small>{user}</small> */}
    </div>

    <FaChevronDown className="ms-2" />
  </div>

  {showProfileMenu && (
    <div
      className="card shadow border-0 position-absolute"
      style={{
  right: 0,
  top: "20px",
  marginTop: "8px",
  width: "270px",
  zIndex: 9999,
  borderRadius: "15px",
  animation: "fadeIn .2s ease",
}}
    >

      <div className="card-body text-center">

      {profileImage ? (
  <img
    src={profileImage}
    alt="Profile"
    style={{
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #dc3545",
      margin: "auto",
      display: "block",
    }}
  />
) : (
  <div
    style={{
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      background: "#dc3545",
      color: "#fff",
      margin: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      fontWeight: "bold",
    }}
  >
    {(userName || user)?.charAt(0).toUpperCase()}
  </div>
)}

        <h6 className="mt-3 mb-0">
          {user?.split("@")[0]}
        </h6>

        <small className="text-muted">
          {user}
        </small>

      </div>

      <div className="list-group list-group-flush">

        <NavLink
          to="/profile"
          className="list-group-item list-group-item-action"
        >
          <FaUser className="me-2" />
          My Profile
        </NavLink>

        <NavLink
          to="/myorders"
          className="list-group-item list-group-item-action"
        >
          <FaClipboardList className="me-2" />
          My Orders
        </NavLink>

        <NavLink
          to="/wishlist"
          className="list-group-item list-group-item-action"
        >
          <FaHeart className="me-2 text-danger" />
          Wishlist
        </NavLink>

        <NavLink
          to="/profile"
          className="list-group-item list-group-item-action"
        >
          <FaMapMarkerAlt className="me-2 text-success" />
          Saved Address
        </NavLink>

        <NavLink
          to="/profile"
          className="list-group-item list-group-item-action"
        >
          <FaGift className="me-2 text-warning" />
          Coupons
        </NavLink>

        <NavLink
          to="/profile"
          className="list-group-item list-group-item-action"
        >
          <FaStar className="me-2 text-warning" />
          Reviews
        </NavLink>

        <NavLink
          to="/profile"
          className="list-group-item list-group-item-action"
        >
          <FaCog className="me-2" />
          Account Settings
        </NavLink>

        <button
          className="list-group-item list-group-item-action text-danger"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </button>

      </div>

    </div>
  )}

</div>
          <div className="position-relative me-3">

  <FaBell
    size={22}
    style={{ cursor: "pointer", color: "#fff" }}
    onClick={() =>
      setShowNotifications(!showNotifications)
    }
  />

  {notifications.filter((n) => !n.isRead).length > 0 && (

    <span
      className="badge bg-danger position-absolute"
      style={{
        top: "-8px",
        right: "-8px",
      }}
    >
      {notifications.filter((n) => !n.isRead).length}
    </span>

  )}
{showNotifications && (
  <div
    className="card shadow position-absolute"
    style={{
      width: "320px",
      right: "0",
      top: "35px",
      zIndex: 9999,
      maxHeight: "400px",
      overflowY: "auto",
    }}
  >
    <div className="card-header fw-bold">
      🔔 Notifications
    </div>

    <div className="card-body p-0">
      {notifications.length === 0 ? (
        <p className="text-center p-3 mb-0">
          No Notifications
        </p>
      ) : (
        notifications.map((item) => (
         <div
  key={item.id}
  className="border-bottom p-3 d-flex align-items-center"
  style={{
    background: item.isRead ? "#fff" : "#f8f9fa",
  }}
>
  <img
    src={item.productImage}
    alt=""
    style={{
      width: "50px",
      height: "50px",
      borderRadius: "8px",
      objectFit: "cover",
      marginRight: "10px",
    }}
  />

  <div style={{ flex: 1 }}>
    <div className="fw-bold">
      {item.productName}
    </div>

    <small>{item.message}</small>

    <br />

    <small className="text-muted">
      Order ID : {item.orderId.slice(0, 8)}
    </small>
  </div>
</div>
        ))
      )}
    </div>
  </div>
)}
</div>
            {/* <button
              type="button"
              className="btn btn-danger btn-log"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-1" />
              Logout
            </button> */}
            <button
  type="button"
  onClick={toggleTheme}
  className="btn btn-sm btn-outline-light me-2"
  title={theme === "light" ? "Dark Mode" : "Light Mode"}
  style={{
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  {theme === "light" ? <FaMoon /> : <FaSun />}
</button>
             {/* <a
    href="https://github.com/Nag2458-React/ecommerce-admin/releases/latest/download/app-debug.apk"
    target="_blank"
    rel="noopener noreferrer"
    className="download-app-btn ms-2"
  >
    <FaDownload className="me-1 download-icon" />
    Download App
  </a> */}
  {!isNativeApp && (
  <a
    href="https://github.com/Nag2458-React/ecommerce-admin/releases/latest/download/app-debug.apk"
    target="_blank"
    rel="noopener noreferrer"
    className="download-app-btn ms-2"
  >
    <FaDownload className="me-1 download-icon" />
    Download App
  </a>
)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
