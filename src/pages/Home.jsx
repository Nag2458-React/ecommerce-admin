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

  const [selectedSizes, setSelectedSizes] = useState({});
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

    if (!selectedSize) {
      alert("Please select size");
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
        selectedSize,
        qty: 1,
      });
    }

    localStorage.setItem(`cart_${user}`, JSON.stringify(cart));

    alert("Added To Cart");
  };
  useEffect(() => {
    fetchProducts();

    const user = localStorage.getItem("currentUser");

    const savedWishlist =
      JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];

    setWishlist(savedWishlist.map((item) => item.id));
  }, []);

  // WISHLIST
  const toggleWishlist = (product) => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      alert("Please Login");
      navigate("/login");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];

    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      wishlist = wishlist.filter((item) => item.id !== product.id);
    } else {
      if (!selectedSizes[product.id]) {
        alert("Please select size");
        return;
      }

      wishlist.push({
        ...product,
        selectedSize: selectedSizes[product.id],
      });
    }

    localStorage.setItem(`wishlist_${user}`, JSON.stringify(wishlist));

    setWishlist(wishlist.map((item) => item.id));
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
          <h4 className="mb-4 text-white">Latest Products</h4>

          {loading && <p>Loading...</p>}

          {!loading && products.length === 0 && <p>No products found</p>}

          <div className="row">
            {products.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div className="card shadow-sm h-100">
                  {/* IMAGE SAFE BLOCK */}
                  <div style={{ height: "200px", background: "#eee" }}>
                    <div style={{ height: "200px", background: "#eee" }}>
                      <img
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
                      />
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="card-body">
                    {/* <h6 className="fw-bold">
    {item?.productName}
  </h6> */}

                    <span className="badge bg-primary mb-1">
                      {item?.category}
                    </span>

                    {/* <p className="mb-1">
    <strong>Size:</strong> {item?.size}
  </p>
   */}
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

                            {/* <small className="text-success fw-bold">
          You Save ₹
          {item?.price - item?.discountPrice}
        </small> */}
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
                    {/*
  <p className="mb-1">
    <strong>Qty:</strong> {item?.quantity}
  </p> */}

                    {/* <p className="mb-1">
    <strong>Occasion:</strong> {item?.occasion}
  </p> */}

                    <p
                      className="mb-1"
                      // style={{
                      //   fontSize: "12px",
                      //   minHeight: "40px",
                      // }}
                      style={{ fontSize: "13px" }}
                    >
                      <strong>Description:</strong> {item?.description}
                    </p>

                    {/* <div
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
  </div> */}
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
                  </div>
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
