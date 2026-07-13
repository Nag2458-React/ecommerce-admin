import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { FaShoppingCart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [sizeError, setSizeError] = useState({});

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const { addToCart } = useCart();

  // -----------------------------
  // Fetch Products
  // -----------------------------

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);

      const defaultColors = {};

      data.forEach((item) => {
        if (item.colors?.length) {
          defaultColors[item.id] = item.colors[0];
        }
      });

      setSelectedColors(defaultColors);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // -----------------------------
  // Size Change
  // -----------------------------

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));

    setSizeError((prev) => ({
      ...prev,
      [productId]: false,
    }));
  };

  // -----------------------------
  // Wishlist Check
  // -----------------------------

  const isProductWishlisted = (productId) => {
    const size = selectedSizes[productId] || "";

    const color = selectedColors[productId]?.name || "";

    return wishlist.some(
      (item) =>
        item.productId === productId &&
        (item.selectedSize || "") === size &&
        (item.selectedColor?.name || "") === color,
    );
  };

  // -----------------------------
  // Wishlist Toggle
  // -----------------------------

  const toggleWishlist = async (product) => {
    const selectedSize = selectedSizes[product.id] || "";

    const selectedColor = selectedColors[product.id];

    const alreadyWishlisted = isProductWishlisted(product.id);

    // REMOVE

    if (alreadyWishlisted) {
      await removeFromWishlist(product.id, selectedSize, selectedColor?.name);

      return;
    }

    // SIZE REQUIRED

    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please Select Size");

      setSizeError((prev) => ({
        ...prev,
        [product.id]: true,
      }));

      return;
    }

    // COLOR REQUIRED

    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please Select Color");
      return;
    }

    await addToWishlist(product, selectedSize, selectedColor);
  };

  // -----------------------------
  // Delivery Date
  // -----------------------------

  const getDeliveryDate = () => {
    const today = new Date();

    const random = Math.floor(Math.random() * 5) + 3;

    today.setDate(today.getDate() + random);

    return today.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };
  // -----------------------------
  // Buy Now
  // -----------------------------

const buyNow = (product) => {
  const selectedSize = selectedSizes[product.id] || "";
  const selectedColor = selectedColors[product.id];

  if (product.sizes?.length > 0 && !selectedSize) {
    alert("Please Select Size");

    setSizeError((prev) => ({
      ...prev,
      [product.id]: true,
    }));

    return;
  }

  navigate("/whatsapp-order", {
    state: {
      buyNow: true,
      product: {
        ...product,
        qty: 1,
        selectedSize,
        selectedColor,
      },
    },
  });
};

  return (
    <div className="">
      {/* ================= NAVBAR ================= */}

      <div>
        <Navbar />
      </div>

      {/* ================= PRODUCTS ================= */}

      <div className="products">
        <div className="container">
          <h4 className="m-3 text-black">Latest Products</h4>

          {loading && <p>Loading...</p>}

          {!loading && products.length === 0 && <p>No Products Found</p>}

          <div className="row">
            {products.map((item, index) => {
              const alreadyWishlisted = isProductWishlisted(item.id);

              return (
                <motion.div
                  key={item.id}
                  className="col-md-3 mb-4"
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                >
                  <div
                    className="card shadow dashboard-card"
                    onClick={() => {
                      navigate(`/product/${item.id}`, {
                        state: {
                          selectedColor: selectedColors[item.id],
                        },
                      });
                    }}
                  >
                    {/* WISHLIST */}

                    <button
                      className={`btn ${
                        alreadyWishlisted ? "btn-danger" : "btn-outline-danger"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();

                        toggleWishlist(item);
                      }}
                      style={{
                        width: "42px",

                        height: "42px",

                        position: "absolute",

                        right: "10px",

                        top: "10px",

                        zIndex: 10,

                        borderRadius: "50%",
                      }}
                    >
                      {alreadyWishlisted ? "❤️" : "🤍"}
                    </button>

                    {/* IMAGE */}

                    <div
                      style={{
                        background: "#eee",
                      }}
                    >
                      <img
                        src={selectedColors[item.id]?.image || item.imagePath}
                        alt={item.productName}
                        className="card-img-top"
                        style={{
                          height: "170px",

                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/images/no-image.png";
                        }}
                      />
                    </div>

                    <div className="card-body text-center">
                      <h6 className="fw-bold mb-1">{item.category}</h6>

                      <p
                        className="text-muted"
                        style={{
                          fontSize: "12px",

                          display: "-webkit-box",

                          WebkitLineClamp: 1,

                          WebkitBoxOrient: "vertical",

                          overflow: "hidden",
                        }}
                      >
                        {item.description}
                      </p>

                      {/* PART-2 START HERE */}
                      {/* SIZE + COLOR */}

                      <div className="d-flex gap-2">
                        {/* SIZE */}

                        <div style={{ width: "48%" }}>
                          {item.sizes?.length > 0 && (
                            <select
                              className={`form-select form-select-sm ${
                                sizeError[item.id]
                                  ? "border border-danger border-3"
                                  : ""
                              }`}
                              value={selectedSizes[item.id] || ""}
                              disabled={alreadyWishlisted}
                              style={{
                                backgroundColor: alreadyWishlisted
                                  ? "#f5f5f5"
                                  : "",

                                cursor: alreadyWishlisted
                                  ? "not-allowed"
                                  : "pointer",
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

                        {/* COLOR */}

                        <div style={{ width: "48%" }}>
                          {item.colors?.length > 0 && (
                            <select
                              className="form-select form-select-sm"
                              value={selectedColors[item.id]?.name || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const color = item.colors.find(
                                  (c) => c.name === e.target.value,
                                );

                                setSelectedColors((prev) => ({
                                  ...prev,

                                  [item.id]: color,
                                }));
                              }}
                            >
                              <option value="">Select Color</option>

                              {item.colors.map((color) => (
                                <option key={color.name} value={color.name}>
                                  {color.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      {/* MATERIAL */}

                      <div className="mt-2">
                        <label className="fw-semibold small">Material</label>

                        <p className="small text-muted mb-1">
                          {item.material || "Premium Quality"}
                        </p>
                      </div>

                      {/* PRICE */}

                      <div className="price-section ">
                        {item.discountPrice ? (
                          <>
                            <span className="text-danger fw-bold fs-5">
                              ₹{item.discountPrice}
                            </span>

                            <span className="text-decoration-line-through text-muted ms-2">
                              ₹{item.price}
                            </span>

                            <span className="badge bg-success ms-2">
                              {Math.round(
                                ((item.price - item.discountPrice) /
                                  item.price) *
                                  100,
                              )}
                              % OFF
                            </span>

                            <div className="small text-success mt-1">
                              You save ₹{item.price - item.discountPrice}
                            </div>
                          </>
                        ) : (
                          <span className="fw-bold fs-5">₹{item.price}</span>
                        )}
                      </div>

                      {/* DELIVERY DATE */}

                      <div className="mt-2">
                        <span className="small text-success">
                          🚚 Delivery by {getDeliveryDate()}
                        </span>
                      </div>

                      {/* PART-3 START HERE */}
                      {/* ACTION BUTTONS */}

                      <div className="d-flex gap-2 mt-3">
                        {/* ADD CART */}

                       <button
  className="btn btn-warning btn-sm flex-fill"
  onClick={(e) => {
    e.stopPropagation();

    const selectedSize = selectedSizes[item.id] || "";
    const selectedColor = selectedColors[item.id];

    // Size validation
    if (item.sizes?.length > 0 && !selectedSize) {
      alert("Please Select Size");

      setSizeError((prev) => ({
        ...prev,
        [item.id]: true,
      }));

      return;
    }

    // Color validation
    if (item.colors?.length > 0 && !selectedColor) {
      alert("Please Select Color");
      return;
    }

    addToCart(
      item,
      selectedSize,
      selectedColor
    );
  }}
>
  <FaShoppingCart className="me-1" />
  Cart
</button>

                        {/* BUY NOW */}

                        <button
                          className="btn btn-info btn-sm flex-fill"
                          onClick={(e) => {
                            e.stopPropagation();

                            buyNow(item);
                          }}
                        >
                          Buy Now
                        </button>
                      </div>

                      {/* VIEW DETAILS */}

                      <Link
                        to={`/product/${item.id}`}
                        className="btn btn-outline-dark btn-sm w-100 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                      </Link>
                    </div>
                    {/* card-body close */}
                  </div>
                  {/* card close */}
                </motion.div>
              );
            })}
          </div>
          {/* row close */}
        </div>
        {/* container close */}
      </div>
      {/* products close */}
    </div>
  );
};

export default Home;
