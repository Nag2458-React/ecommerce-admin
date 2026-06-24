import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

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

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size,
    });
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
    window.dispatchEvent(
  new Event("cartUpdated")
);
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
    window.dispatchEvent(
  new Event("wishlistUpdated")
);
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
      <div

      // style={{
      //   width: "240px",
      //   minHeight: "100vh",
      //   position: "fixed",
      // }}
      >
        <Navbar />
        {/* <h3 className="text-center mb-4"> PRODUCTS</h3> */}

        {/* <ul className="nav shadow">

          <li className="nav-item m-1">
            <Link to="/" className="nav-link text-white">
              <FaHome /> Home
            </Link>
          </li>

          <li className="nav-item m-1">
            <a className="nav-link text-white" href="#">
              <FaThLarge /> Categories
            </a>
          </li>

          <li className="nav-item m-1">
            <a className="nav-link text-white" href="#">
              <FaBoxOpen /> Products
            </a>
          </li>

          <li className="nav-item m-1">
            <Link className="nav-link text-white" to="/wishlist">
              <FaHeart /> Wishlist
            </Link>
          </li>

          <li className="nav-item m-1">
           <Link
  to="/cart"
  className="nav-link text-white"
>
  <FaShoppingCart /> Cart
</Link>
          </li>
<li className="nav-item m-1">
  <Link
    to="/myorders"
    className="nav-link text-white"
  >
    <FaClipboardList /> Orders
  </Link>
</li>
          <li className="nav-item m-1">
            <a className="nav-link text-white" href="#">
              <FaPhone /> Contact
            </a>
          </li>
    <li className="nav-item m-1">
  <Link
    to="/profile"
    className="nav-link text-white"
  >
    <FaUserCircle /> Profile
  </Link>
</li>
          <li className="m-1">
            {localStorage.getItem("user") ? (
              <button className="btn btn-info w-100" onClick={handleLogout}>
                <FaUser /> Logout
              </button>
            ) : (
              <button className="btn btn-primary w-100" onClick={gotoLogin}>
                <FaUser /> Login
              </button>
            )}
          </li>

        </ul> */}
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="products">
        <div className="container">
          <h4 className="m-3 text-black">Latest Products</h4>

          {loading && <p>Loading...</p>}

          {!loading && products.length === 0 && <p>No products found</p>}

          <div className="row">
            {products.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div
                  className="card  shadow"
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
                    {/* <img
                        src={
                          item?.imagePath
                            ? item.imagePath
                            : "/images/no-image.png"
                        }
                        alt={item?.productName || "product"}
                        style={{
                          height: "100%",
                        }}
                        onError={(e) => {
                          e.target.src = "/images/no-image.png";
                        }}
                      /> */}
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
  <span className="fw-bold" style={{color:"rgb(62 37 195)"}}>
    {item.category}
  </span>

  {/* <div
    className="mt-1 text-muted"
    style={{
      fontSize: "13px",
    }}
  >
    {item.productName}
  </div> */}
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
                            className="form-select form-select-sm mb-2"
                            value={selectedSizes[item.id] || ""}
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
                        {/* <p
  className="mb-2 text-success fw-bold"
  style={{
    fontSize: "12px",
  }}
>
  🚚 Delivery by {getDeliveryDate(item.id)}
</p> */}
                        <div
                          className="mt-2"
                          style={{
                            background: "#f1fff4",
                            border: "1px solid #d4edda",
                            borderRadius: "6px",
                            padding: "4px",
                            fontSize: "12px",
                            color: "#198754",
                            fontWeight: "600",
                          }}
                        >
                          🚚 FREE Delivery by {getDeliveryDate(item.id)}
                        </div>
                      </>
                    ) : (
                      <h4 className="text-success mb-2">₹{item.price}</h4>
                    )}

                    {/* <div className="d-flex gap-2">

    <button
      className="btn btn-primary"
      style={{ width: "48%" }}
      onClick={(e) => {
        e.stopPropagation();
        addToCart(item);
      }}
    >
      Add To Cart
    </button>

    <button
      className="btn btn-success"
      style={{ width: "48%" }}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/product/${item.id}`);
      }}
    >
      Buy Now
    </button>

  </div> */}
                  </div>
                  {/* BODY */}
                  {/* <div className="card-body">
                     <h6 className="fw-bold">
    {item?.productName}
  </h6> 

                    <span className="badge bg-primary mb-1">
                      {item?.category}
                    </span>

                     <p className="mb-1">
    <strong>Size:</strong> {item?.size}
  </p>
   
                    <div className=" justify-content-between align-items-start mb-1">
                      <div>
                        {item?.discountPrice ? (
                          <>
                            <span
                              className="text-success fw-bold"
                              style={{ fontSize: "16px" }}
                            >
                              <strong style={{ fontSize: "20px" }}>
                                Price
                              </strong>{" "}
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "gray",
                                  fontSize: "14px",
                                }}
                              >
                                ₹{item?.price}
                              </span>{" "}
                              ₹{item?.discountPrice}
                            </span>

                            <br />

                             <small className="text-success fw-bold">
          You Save ₹
          {item?.price - item?.discountPrice}
        </small> 
                          </>
                        ) : (
                          <span
                            className="text-success fw-bold"
                            style={{ fontSize: "16px" }}
                          >
                            ₹{item?.price}
                          </span>
                        )}
                      </div>

                      {item?.discountPrice && (
                        <strong
                          className=""
                          style={{
                            fontSize: "12px",
                            height: "fit-content",
                          }}
                        >
                          {Math.round(
                            ((item.price - item.discountPrice) / item.price) *
                              100,
                          )}
                          % OFF
                        </strong>
                      )}
                    </div>
                    {item?.discountPrice && (
                      <div
                        className="alert alert-success py-1 px-2 mt-1"
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        🎉 You save ₹{item.price - item.discountPrice} on this
                        product
                      </div>
                    )}
                    <div className="d-flex">
                      <select
                        className="form-select mb-2"
                        value={selectedSizes[item.id] || ""}
                        onChange={(e) =>
                          handleSizeSelect(item.id, e.target.value)
                        }
                        style={{ width: "50%" }}
                      >
                        <option value="">Select Size</option>

                        {item?.sizes?.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <p
                        className="mb-1"
                        style={{ width: "50%", fontSize: "13px" }}
                      >
                        <strong>Color:</strong> {item?.color}
                      </p>
                    </div>

                    <p className="mb-1" style={{ fontSize: "13px" }}>
                      <strong>Material:</strong> {item?.material}
                    </p>
                    
  <p className="mb-1">
    <strong>Qty:</strong> {item?.quantity}
  </p> 

                     <p className="mb-1">
    <strong>Occasion:</strong> {item?.occasion}
  </p> 

                    <p
                      className="mb-1"
                      
                      style={{ fontSize: "13px" }}
                    >
                      <strong>Description:</strong> {item?.description}
                    </p>

                     <div
    className="alert alert-light p-2"
    style={{ fontSize: "12px" }}
  >
    <strong>Highlights:</strong>
    <br />
    {item?.highlights}
  </div>

  <div
    className="alert alert-warning p-2"
    style={{ fontSize: "12px" }}
  >
    <strong>Care:</strong>
    <br />
    {item?.careInstructions}
  </div> 
                    <div className="d-flex gap-3">
                      <button
                        className={`btn btn-sm  ${
                          wishlist.includes(item.id)
                            ? "btn-danger"
                            : "btn-outline-danger"
                        }`}
                        onClick={() => toggleWishlist(item)}
                        style={{ width: "48%" }}
                      >
                        ❤️ Wishlist
                      </button>
                      <button
                        className="btn btn-primary   "
                        onClick={() => addToCart(item)}
                        style={{ width: "50%" }}
                      >
                        Add to Cart
                      </button>
                    </div>

                    <button className="btn btn-success w-100 mt-2">
                      Buy Now
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
