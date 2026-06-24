import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaHome,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import Navbar from "./Navbar";
import StarRating from "../admin/pages/StarRating";

const Wishlist = () => {
  const navigate = useNavigate();
useEffect(() => {

  const user =
    localStorage.getItem("user");

  if (!user) {

    navigate("/login", {
      replace: true,
    });

  }

}, []);
  const [wishlist, setWishlist] = useState([]);
const [selectedColors, setSelectedColors] =  useState({});
  useEffect(() => {
  const user =
  localStorage.getItem(
    "currentUser"
  );

const data =
  JSON.parse(
    localStorage.getItem(
      `wishlist_${user}`
    )
  ) || [];

setWishlist(data);

const colorsObj = {};

data.forEach((item) => {
  if (item.selectedColor) {
    colorsObj[item.id] =
      item.selectedColor;
  }
});

setSelectedColors(colorsObj);
  }, []);
const addToCart = (product) => {

  const user =
    localStorage.getItem(
      "currentUser"
    );

  let cart =
    JSON.parse(
      localStorage.getItem(
        `cart_${user}`
      )
    ) || [];

  const currentColor =
    selectedColors[product.id];

  const productToCart = {
    ...product,

    imagePath:
      currentColor?.image ||
      product.imagePath,

    selectedColor:
      currentColor || null,

    qty: 1,
  };

  const exists = cart.find(
    (item) =>
      item.id === product.id &&
      item.selectedSize ===
        product.selectedSize
  );

  if (exists) {

    exists.qty += 1;

    exists.imagePath =
      currentColor?.image ||
      exists.imagePath;

    exists.selectedColor =
      currentColor || null;

  } else {

    cart.push(productToCart);

  }

  localStorage.setItem(
    `cart_${user}`,
    JSON.stringify(cart)
  );

  navigate("/cart");
};
  const removeItem = (id) => {
    const updated = wishlist.filter(
      (item) => item.id !== id
    );

    setWishlist(updated);

    const user =
  localStorage.getItem(
    "currentUser"
  );

localStorage.setItem(
  `wishlist_${user}`,
  JSON.stringify(updated)
);
window.dispatchEvent(
  new Event(
    "cartUpdated"
  )
);
  };

const handleLogout = () => {

  localStorage.removeItem("user");

  localStorage.removeItem("admin");

  localStorage.removeItem("adminData");

  localStorage.removeItem("currentUser");

  navigate("/login");
};


const getDeliveryDate = () => {
  const today = new Date();

  const randomDays =
    Math.floor(Math.random() * 5) + 3;

  today.setDate(
    today.getDate() + randomDays
  );

  return today.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );
};
  return (
    <div>
<Navbar />
      {/* HEADER */}
      {/* <nav className="navbar navbar-expand-lg   shadow">
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
      </nav> */}

      {/* PAGE CONTENT */}
      <div className="container mt-4 wishlist">

        <h2 className="mb-4 text-center text-black">
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
             <div
  className="card  shadow"
  style={{
    cursor: "pointer",
    borderRadius: "15px",
    overflow: "hidden",
  }}
  onClick={() =>
  navigate(`/product/${item.id}`, {
    state: {
      selectedColor:
        selectedColors[item.id],
    },
  })
}
>
<img
  key={selectedColors[item.id]?.image}
  src={
    selectedColors[item.id]?.image ||
    item.selectedColor?.image ||
    item.imagePath
  }
  alt={item.productName}
  style={{
    height: "150px",
    width: "100%",
    objectFit: "cover",
  }}
  onError={(e) => {
    e.target.src = "/images/no-image.png";
  }}
/>

             <div className="card-body text-center">

  <h5 className="fw-bold mb-2">
    {item.productName}
  </h5>


{/* Sizes */}
{item.selectedSize && (
  <div className="mb-2">
    <span
      className=" text-primary"
      style={{
        fontSize: "13px",
        padding: "6px 10px",
      }}
    >
      Selected Size: {item.selectedSize}
    </span>
  </div>
)}
{item.colors?.length > 0 && (
  <div
    className="mb-3"
    onClick={(e) => e.stopPropagation()}
  >
    <select
      className="form-select form-select-sm"
      value={
        selectedColors[item.id]?.name || ""
      }
      onChange={(e) => {
        const colorObj =
          item.colors.find(
            (c) =>
              c.name === e.target.value
          );

        setSelectedColors({
          ...selectedColors,
          [item.id]: colorObj,
        });
      }}
    >
      {item.colors.map((color) => (
        <option
          key={color.name}
          value={color.name}
        >
          {color.name}
        </option>
      ))}
    </select>

    <div className="mt-2 d-flex justify-content-center align-items-center gap-2">
      <span
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background:
            selectedColors[item.id]
              ?.code || "#ccc",
          border: "1px solid #000",
          display: "inline-block",
        }}
      ></span>

      <small className="fw-bold">
        {
          selectedColors[item.id]
            ?.name
        }
      </small>
    </div>
  </div>
)}
{/* Description */}
{item.description && (
  <p
    className="text-muted mb-2"
    style={{
      fontSize: "13px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {item.description}
  </p>
)}
<div
  className="d-flex justify-content-center align-items-center gap-2 mb-2"
>
  <StarRating
    rating={item.rating || 4.5}
  />

  <span
    className="badge bg-secondary"
  >
    {item.rating || 4.5}
  </span>
</div>
  {item.discountPrice ? (
    <>
      <h4 className="mb-1">

        <span
          style={{
            textDecoration: "line-through",
            color: "#888",
            fontSize: "18px",
          }}
        >
          ₹{item.price}
        </span>

        <span
          className="text-success fw-bold ms-2"
        >
          ₹{item.discountPrice}
        </span>

      </h4>

      <div className="d-flex justify-content-center gap-2 mb-2">

        <span className=" text-danger">
          {Math.round(
            ((item.price -
              item.discountPrice) /
              item.price) *
              100
          )}
          % OFF
        </span>

        <span className="text-success">
          Save ₹
          {item.price -
            item.discountPrice}
        </span>

      </div>
      <div
  className="mt-2"
  style={{
    fontSize: "13px",
    color: "green",
    fontWeight: "600",
  }}
>
  🚚 Delivery by {getDeliveryDate()}
</div>
    </>
  ) : (
    <h4 className="text-success">
      ₹{item.price}
    </h4>
  )}

  <div className="d-flex gap-2 mt-3">

    <button
      className="btn btn-primary"
      style={{ width: "50%" }}
      onClick={(e) => {
        e.stopPropagation();
        addToCart(item);
      }}
    >
      Add To Cart
    </button>

    <button
      className="btn btn-danger"
      style={{ width: "50%" }}
      onClick={(e) => {
        e.stopPropagation();
        removeItem(item.id);
      }}
    >
      Remove
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