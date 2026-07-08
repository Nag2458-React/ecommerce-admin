import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaShoppingCart,
  FaHome,
  FaThLarge,
  FaBoxOpen,
  FaPhone,
  FaUserCircle,
  FaUser,
  FaClipboardList,
} from "react-icons/fa";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // logout ayyaka , back arrow press chesthe back avvakunda ee kinda code use chestam
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, []);
  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  const [selectedColors, setSelectedColors] = useState({});

  const [products, setProducts] = useState([]);

  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sizeError, setSizeError] = useState({});
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size,
    });

    // Remove highlight after selecting
    setSizeError((prev) => ({
      ...prev,
      [productId]: false,
    }));
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);

      const defaultColors = {};

      data.forEach((item) => {
        if (item.colors && item.colors.length > 0) {
          defaultColors[item.id] = item.colors[0];
        }
      });

      setSelectedColors(defaultColors);
    } catch (error) {
      console.log("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      alert("Please Login First");

      navigate("/login");

      return;
    }

    const selectedSize = selectedSizes[product.id];

    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please Select Size");

      setSizeError((prev) => ({
        ...prev,
        [product.id]: true,
      }));

      document.getElementById(`sizes-${product.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

    const existing = cart.find(
      (item) => item.id === product.id && item.selectedSize === selectedSize,
    );

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        ...product,
        selectedSize: selectedSize || "",
        selectedColor: selectedColors[product.id] || null,
        qty: 1,
      });
    }

    localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Added To Cart");
  };

  useEffect(() => {
    fetchProducts();

    const user = localStorage.getItem("currentUser");

    const savedWishlist =
      JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];

    setWishlist(savedWishlist.map((item) => item.id));

    setWishlistItems(savedWishlist);

    // Load Saved Size & Color
    const savedSizes = {};
    const savedColors = {};

    savedWishlist.forEach((item) => {
      if (item.selectedSize) {
        savedSizes[item.id] = item.selectedSize;
      }

      if (item.selectedColor) {
        savedColors[item.id] = item.selectedColor;
      }
    });

    setSelectedSizes(savedSizes);

    setSelectedColors((prev) => ({
      ...prev,
      ...savedColors,
    }));
  }, []);
  const toggleWishlist = (product) => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      alert("Please Login");

      navigate("/login");

      return;
    }

    const selectedSize = selectedSizes[product.id];

    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please Select Size");

      setSizeError((prev) => ({
        ...prev,
        [product.id]: true,
      }));

      document.getElementById(`sizes-${product.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];

    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      wishlist = wishlist.filter((item) => item.id !== product.id);
    } else {
      wishlist.push({
        ...product,
        selectedSize,
        selectedColor: selectedColors[product.id] || null,
      });
    }

    localStorage.setItem(`wishlist_${user}`, JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    setWishlist(wishlist.map((item) => item.id));
    setWishlistItems(wishlist);
  };

  const gotoLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    localStorage.removeItem("admin");

    localStorage.removeItem("adminData");

    localStorage.removeItem("currentUser");

    navigate("/login", {
      replace: true,
    });
  };

  const getDeliveryDate = () => {
    const today = new Date();

    const randomDays = Math.floor(Math.random() * 5) + 3;

    today.setDate(today.getDate() + randomDays);

    return today.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };
  return (
    <div className="">
      {/* ================= SIDEBAR ================= */}
      <div>
        <Navbar />
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="products">
        <div className="container">
          <h4 className="m-3 text-black">Latest Products</h4>

          {loading && <p>Loading...</p>}

          {!loading && products.length === 0 && <p>No products found</p>}

          <div className="row">
  {products.map((item, index) => (
    <motion.div
      key={item.id}
      className="col-md-3 mb-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
    >
      <div
        className="card shadow dashboard-card"
        onClick={() =>
          navigate(`/product/${item.id}`, {
            state: {
              selectedColor: selectedColors[item.id],
            },
          })
        }
      >
                  <button
                    className={`btn ${
                      wishlist.includes(item.id)
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    style={{
                      width: "12%",
                      position: "absolute",
                      right: "0",
                      margin: "15px",
                    }}
                  >
                    ❤️
                  </button>
                  {/* IMAGE SAFE BLOCK */}

                  <div style={{ background: "#eee" }}>
                    <img
                      src={selectedColors[item.id]?.image || item.imagePath}
                      alt={item.productName}
                      className="card-img-top"
                      style={{
                        height: "150px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                      onError={(e) => {
                        e.target.src = "/images/no-image.png";
                      }}
                    />
                  </div>

                  <div className="card-body text-center">
                    <div className="mb-2">
                      <span
                        className="fw-bold"
                        style={{ color: "#000" }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p
                      className="text-muted mb-2"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "12px",
                      }}
                    >
                      {item.description}
                    </p>
                    {/* Size Dropdown */}
                    <div className="d-flex gap-2">
                      <div style={{ width: "48%" }}>
                        {item.sizes?.length > 0 && (
                          <select
                            className={`form-select form-select-sm mb-2 ${
                              sizeError[item.id]
                                ? "border border-danger border-3"
                                : ""
                            }`}
                            value={selectedSizes[item.id] || ""}
                            disabled={isWishlisted(item.id)}
                            style={{
                              backgroundColor: isWishlisted(item.id)
                                ? "#f5f5f5"
                                : sizeError[item.id]
                                  ? "#fff5f5"
                                  : "",
                              cursor: isWishlisted(item.id)
                                ? "not-allowed"
                                : "pointer",
                              boxShadow: sizeError[item.id]
                                ? "0 0 10px red"
                                : "none",
                              animation: sizeError[item.id]
                                ? "shake 0.4s"
                                : "none",
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleSizeSelect(item.id, e.target.value)
                            }
                          >
                            <option value="">Select Size</option>

                            {item.sizes.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div style={{ width: "48%" }}>
                        {item.colors?.length > 0 && (
                          <div
                            className="d-flex align-items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              className="form-select form-select-sm"
                              value={selectedColors[item.id]?.name || ""}
                              disabled={isWishlisted(item.id)}
                              style={{
                                backgroundColor: isWishlisted(item.id)
                                  ? "#f5f5f5"
                                  : "",
                                cursor: isWishlisted(item.id)
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const colorObj = item.colors.find(
                                  (clr) => clr.name === e.target.value,
                                );

                                setSelectedColors({
                                  ...selectedColors,
                                  [item.id]: colorObj,
                                });
                              }}
                            >
                              {item.colors.map((color) => (
                                <option key={color.name} value={color.name}>
                                  {color.name}
                                </option>
                              ))}
                            </select>

                            {/* Selected Color Preview */}
                            <div
                              style={{
                                width: "25px",
                                height: "25px",
                                borderRadius: "6px",
                                background: selectedColors[item.id]?.code,
                                border: "1px solid #ccc",
                                flexShrink: 0,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {item.discountPrice ? (
                      <>
                        <h4 className="mb-1" style={{ fontSize: "14px" }}>
                          <span className="text-danger">
                            {Math.round(
                              ((item.price - item.discountPrice) / item.price) *
                                100,
                            )}
                            % OFF
                          </span>{" "}
                          &nbsp;&nbsp;
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                              fontSize: "18px",
                            }}
                          >
                            ₹{item.price}
                          </span>
                        </h4>

                        <div className="d-flex justify-content-center gap-2 mb-2">
                          {/* 
        <span className="text-danger">
          {Math.round(
            ((item.price - item.discountPrice) /
              item.price) *
              100
          )}
          % OFF
        </span> */}
                          <span className="text-success fw-bold ms-2">
                            ₹{item.discountPrice}
                          </span>
                          {/* <span className="text-primary">
          Save ₹
          {item.price - item.discountPrice}
        </span> */}
                        </div>

                        <div
                          className="mt-2"
                          style={{
                            background: "#3e25c3",
                            border: "1px solid #d4edda",
                            borderRadius: "6px",
                            padding: "4px",
                            fontSize: "12px",
                            color: "#fff",
                            fontWeight: "600",
                          }}
                        >
                          🚚 FREE Delivery by {getDeliveryDate(item.id)}
                        </div>
                      </>
                    ) : (
                      <h4 className="text-success mb-2">₹{item.price}</h4>
                    )}
                  </div>
                </div>
                 </motion.div>
             
             
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
