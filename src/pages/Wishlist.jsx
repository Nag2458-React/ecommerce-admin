import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaHome,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

const Wishlist = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(data);
  }, []);
const addToCart = (product) => {
  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const exists = cart.find(
    (item) => item.id === product.id
  );

  if (exists) {
    exists.qty += 1;
  } else {
    cart.push({
      ...product,
      qty: 1,
    });
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  navigate("/cart");
};
  const removeItem = (id) => {
    const updated = wishlist.filter(
      (item) => item.id !== id
    );

    setWishlist(updated);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>

      {/* HEADER */}
      <nav className="navbar navbar-expand-lg   shadow">
        <div className="container">

          <Link className="navbar-brand fw-bold text-white" to="/">
            BANGLES SHOP
          </Link>

          <div className="d-flex align-items-center">

            <Link
              to="/"
              className="btn btn-outline-light me-2"
            >
              <FaHome /> Home
            </Link>

            <Link
              to="/wishlist"
              className="btn btn-danger me-2"
            >
              <FaHeart /> Wishlist
            </Link>
             <Link
              to="/cart"
              className="btn btn-outline-warning me-2"
            >
              <FaShoppingCart /> Cart
            </Link>
            {/* <button
              className="btn btn-outline-warning me-2"
            >
              <FaShoppingCart /> Cart
            </button> */}

            {localStorage.getItem("user") ? (
              <button
                className="btn btn-info"
                onClick={handleLogout}
              >
                <FaUser /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
              >
                <FaUser /> Login
              </Link>
            )}
          </div>

        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="container mt-4">

        <h2 className="mb-4 text-center text-white">
          ❤️ My Wishlist
        </h2>

        {wishlist.length === 0 && (
          <div className="text-center mt-5">
            <h4>No items in wishlist</h4>

            <Link
              to="/"
              className="btn btn-primary mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        <div className="row">

          {wishlist.map((item) => (
            <div
              className="col-lg-3 col-md-4 col-sm-6 mb-4"
              key={item.id}
            >
              <div className="card h-100 shadow">

                <img
                  src={item.imagePath}
                  alt={item.productName}
                  style={{
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "/images/no-image.png";
                  }}
                />

              <div className="card-body">

  <h5 className="fw-bold">
    {item.productName}
  </h5>

  <span className="badge bg-primary mb-2">
    {item.category}
  </span>

  <hr />

  <p>
    <strong>Size:</strong>{" "}
    {item.selectedSize || "Not Selected"}
  </p>

  <p>
    <strong>Color:</strong>{" "}
    {item.color || "-"}
  </p>

  <p>
    <strong>Material:</strong>{" "}
    {item.material || "-"}
  </p>

  <p>
    <strong>Stock:</strong>{" "}
    {item.stock || 0}
  </p>

  <p>
    <strong>Description:</strong>
    <br />
    {item.description || "-"}
  </p>

  <hr />

  {item.discountPrice > 0 ? (
    <>
      <div>
        <span
          style={{
            textDecoration: "line-through",
            color: "gray",
          }}
        >
          ₹{item.price}
        </span>
      </div>

      <div
        className="fw-bold text-success"
        style={{ fontSize: "22px" }}
      >
        ₹{item.discountPrice}
      </div>

      <div className="text-success">
        You Save ₹
        {item.price - item.discountPrice}
      </div>

      <span className="badge bg-danger">
        {Math.round(
          ((item.price - item.discountPrice) /
            item.price) *
            100
        )}
        % OFF
      </span>
    </>
  ) : (
    <div
      className="fw-bold text-success"
      style={{ fontSize: "22px" }}
    >
      ₹{item.price}
    </div>
  )}

  <div
    className="d-grid gap-2 mt-3"
  >
    <button
      className="btn btn-success"
      onClick={() => addToCart(item)}
    >
      Add To Cart
    </button>

    <button
      className="btn btn-danger"
      onClick={() => removeItem(item.id)}
    >
      Remove Wishlist
    </button>
  </div>

</div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default Wishlist;