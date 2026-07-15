import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { FaShoppingCart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarRating from "../admin/pages/StarRating";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingWishlist, setAnimatingWishlist] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [sizeError, setSizeError] = useState({});

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [priceFilter, setPriceFilter] = useState("All");

  const [ratingFilter, setRatingFilter] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");
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
      const productsWithRatings = await Promise.all(
        data.map(async (product) => {
          const reviewQuery = query(
            collection(db, "reviews"),
            where("productId", "==", product.id),
          );

          const reviewSnap = await getDocs(reviewQuery);

          const reviews = reviewSnap.docs.map((d) => d.data());

          const reviewCount = reviews.length;

let finalRating = product.rating || 0;
let finalReviewCount = product.reviewCount || 0;

if (reviewCount > 0) {
  finalRating =
    reviews.reduce(
      (sum, r) => sum + Number(r.rating),
      0
    ) / reviewCount;

  finalReviewCount = reviewCount;
}

return {
  ...product,
  rating: Number(finalRating.toFixed(1)),
  reviewCount: finalReviewCount,
};
        }),
      );

      setProducts(productsWithRatings);
      

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
  const categories = ["All", ...new Set(products.map((p) => p.category))];
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
    return wishlist.some((item) => item.productId === productId);
  };

  // -----------------------------
  // Wishlist Toggle
  // -----------------------------

  const toggleWishlist = async (product) => {
    const selectedSize = selectedSizes[product.id] || "";

    const selectedColor = selectedColors[product.id];

    const alreadyWishlisted = isProductWishlisted(product.id);

    // ---------------- REMOVE ----------------

    if (alreadyWishlisted) {
      await removeFromWishlist(product.id);

      toast.info("🗑 Removed from Wishlist");

      return;
    }

    // ---------------- SIZE VALIDATION ----------------

    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please Select Size");

      setSizeError((prev) => ({
        ...prev,
        [product.id]: true,
      }));

      return;
    }

    // ---------------- COLOR VALIDATION ----------------

    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please Select Color");

      return;
    }

    // ---------------- ADD ----------------

    await addToWishlist(product, selectedSize, selectedColor);

    toast.success("❤️ Added to Wishlist");

    setAnimatingWishlist((prev) => ({
      ...prev,
      [product.id]: true,
    }));

    setTimeout(() => {
      setAnimatingWishlist((prev) => ({
        ...prev,
        [product.id]: false,
      }));
    }, 700);
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
  const filteredProducts = products.filter((item) => {
    const matchSearch =
      item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    const price = Number(item.discountPrice || item.price);

    let matchPrice = true;

    if (priceFilter === "0-500") matchPrice = price <= 500;

    if (priceFilter === "500-1000") matchPrice = price > 500 && price <= 1000;

    if (priceFilter === "1000+") matchPrice = price > 1000;

    return matchSearch && matchCategory && matchPrice;
  });
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
          <div
            className="card shadow-sm border-0 p-3 mb-4"
            style={{
              borderRadius: "15px",
              background: "#fff",
            }}
          >
            <div className="row g-3 align-items-center">
              {/* Search */}
              <div className="col-lg-5 col-md-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search Products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    height: "48px",
                    borderRadius: "12px",
                    boxShadow: "none",
                  }}
                />
              </div>

              {/* Category */}
              <div className="col-lg-3 col-md-6">
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    height: "48px",
                    borderRadius: "12px",
                    boxShadow: "none",
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      📂 {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="col-lg-2 col-md-3">
                <select
                  className="form-select"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  style={{
                    height: "48px",
                    borderRadius: "12px",
                    boxShadow: "none",
                  }}
                >
                  <option value="All">💰 All Prices</option>

                  <option value="0-500">Under ₹500</option>

                  <option value="500-1000">₹500 - ₹1000</option>

                  <option value="1000+">Above ₹1000</option>
                </select>
              </div>

              {/* Reset */}
              <div className="col-lg-2 col-md-3">
                <button
                  className="btn btn-dark w-100"
                  style={{
                    height: "48px",
                    borderRadius: "12px",
                  }}
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("All");
                    setPriceFilter("All");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {loading && <p>Loading...</p>}

          {!loading && products.length === 0 && <p>No Products Found</p>}

          <div className="row">
            {filteredProducts.map((item, index) => {
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
                    className={`card shadow dashboard-card ${
                      alreadyWishlisted ? "wishlist-card" : ""
                    }`}
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
                      className="btn"
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
                        background: "#fff",
                        boxShadow: alreadyWishlisted
                          ? "0 4px 12px rgba(220,53,69,.35)"
                          : "0 2px 8px rgba(0,0,0,.15)",
                        transform: animatingWishlist[item.id]
                          ? "scale(1.2)"
                          : "scale(1)",
                        transition: ".25s ease",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "22px",
                          transition: ".25s",
                        }}
                      >
                        {alreadyWishlisted ? "❤️" : "🤍"}
                      </span>
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
                          marginBottom: "5px",
                        }}
                      >
                        {item.description}
                      </p>
                      <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                        <StarRating rating={item.rating} size={16} />

                        <small className="text-muted">
                          {item.rating} ({item.reviewCount})
                        </small>
                      </div>
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

                      <div className="mt-0">
                        <label className="fw-semibold small">Material</label>

                        <p className="small text-muted mb-0">
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

                            <span
                              style={{
                                marginLeft: "5px",
                                fontSize: "14px",
                                color: "#7d3ccf",
                              }}
                            >
                              {Math.round(
                                ((item.price - item.discountPrice) /
                                  item.price) *
                                  100,
                              )}
                              % OFF
                            </span>

                            <div className="small text-success">
                              You save ₹{item.price - item.discountPrice}
                            </div>
                          </>
                        ) : (
                          <span className="fw-bold fs-5">₹{item.price}</span>
                        )}
                      </div>

                      {/* DELIVERY DATE */}

                      <div className="">
                        <span className="small text-success">
                          🚚 Delivery by {getDeliveryDate()}
                        </span>
                      </div>

                      {/* PART-3 START HERE */}
                      {/* ACTION BUTTONS */}

                      <div className="d-flex gap-2 mt-1">
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

                            addToCart(item, selectedSize, selectedColor);
                            toast.success("🛒 Added to Cart!", {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
});
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
