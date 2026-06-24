import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { useParams, useNavigate, useLocation } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import StarRating from "../admin/pages/StarRating";
import { db } from "../firebase/firebase";
import Navbar from "./Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const docRef = doc(db, "products", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        console.log("FULL PRODUCT", data);
        console.log("COLORS", data.colors);
        setProduct(data);

        const passedColor = location.state?.selectedColor;

        if (passedColor) {
          setSelectedColor(passedColor);

          setMainImage(passedColor.image);
        } else if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);

          setMainImage(data.colors[0].image);
        } else {
          setMainImage(data.imagePath);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  const addToWishlist = () => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      alert("Please Login");
      navigate("/login");
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please Select Size");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user}`)) || [];

    const exists = wishlist.find((item) => item.id === product.id);

   if (!exists) {
  wishlist.push({
    ...product,

    imagePath:
      selectedColor?.image ||
      product.imagePath,

    selectedSize,

    selectedColor,
  });

  localStorage.setItem(
    `wishlist_${user}`,
    JSON.stringify(wishlist)
  );

  alert("Added To Wishlist");
} else {
      alert("Already In Wishlist");
    }
  };

 const addToCart = () => {
  const user = localStorage.getItem("currentUser");

  if (!user) {
    alert("Please Login");
    navigate("/login");
    return;
  }

  if (product.sizes?.length > 0 && !selectedSize) {
    alert("Please Select Size");
    return;
  }

  let cart =
    JSON.parse(
      localStorage.getItem(`cart_${user}`)
    ) || [];

  const cartItem = {
    ...product,

    imagePath:
      selectedColor?.image ||
      product.imagePath,

    selectedColor,

    selectedSize,

    qty: 1,
  };

  const exists = cart.find(
    (item) =>
      item.id === product.id &&
      item.selectedSize === selectedSize &&
      item.selectedColor?.name ===
        selectedColor?.name
  );

  if (exists) {
    exists.qty += 1;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem(
    `cart_${user}`,
    JSON.stringify(cart)
  );
window.dispatchEvent(
  new Event("cartUpdated")
);
  alert("Added To Cart");
};

  const buyNow = () => {
    addToCart();

    navigate("/cart");
  };

  const getDeliveryDate = () => {

  const today =
    new Date();

  const randomDays =
    Math.floor(
      Math.random() * 5
    ) + 3;

  today.setDate(
    today.getDate() +
      randomDays
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
    <>
      <Navbar />
      <div
  className="container-fluid py-4"
  style={{
    background: "#f1f3f6",
    minHeight: "100vh",
  }}
>
        <button className="btn btn-dark mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="row g-4">
          {/* IMAGE */}

          <div className="col-md-5">
             <div
    className="bg-white p-3 rounded shadow-sm"
    style={{
      position: "sticky",
      top: "20px"
    }}
  >
            <h6 className="mt-2 text-danger">Current Image: {mainImage}</h6>
           <Zoom>
  <img
    key={mainImage}
    src={mainImage || product.imagePath}
    alt={product.productName}
    className="img-fluid rounded"
    style={{
      width: "100%",
      height: "550px",
      objectFit: "contain",
      background: "#fff"
    }}
  />
</Zoom>
<div className="mt-2 text-center text-muted">
  Image {product.colors?.findIndex(
    c => c.name === selectedColor?.name
  ) + 1} of {product.colors?.length}
</div>
            {product.colors?.length > 0 && (
            <div className="d-flex gap-3 mt-4 flex-wrap">
  {product.colors?.map((color, index) => (
    <div
      key={index}
      onClick={() => {
        setSelectedColor(color);
        setMainImage(color.image);
      }}
      style={{
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        background: color.code,
        cursor: "pointer",
        border:
          selectedColor?.name === color.name
            ? "4px solid #2874f0"
            : "2px solid #ddd",
        transition: ".3s"
      }}
    />
  ))}
</div>
            )}
          </div>
</div>
          {/* DETAILS */}

          <div className="col-md-7">
             <div className="bg-white p-4 rounded shadow-sm">
              <h2 className="fw-bold">{product.category}</h2>
            {/* <h2 className="fw-bold">{product.productName}</h2> */}
            <div className="d-flex align-items-center gap-2">
  <StarRating rating={product.rating || 4.5} />

  <span className="badge bg-success">
    {product.rating || 4.5}
  </span>

  <small className="text-muted">
    (125 Reviews)
  </small>
</div>
            <div className="d-flex gap-2 mb-3">
              {product.discountPrice && (
                <>
                  <span className="badge bg-danger fs-6">
                    {Math.round(
                      ((product.price - product.discountPrice) /
                        product.price) *
                        100,
                    )}
                    % OFF
                  </span>

                  <span className="badge bg-success fs-6">
                    Save ₹{product.price - product.discountPrice}
                  </span>
                </>
              )}

              <span className="badge bg-primary fs-6">In Stock</span>
            </div>

            <h3 className="mb-3">
              {product.discountPrice ? (
                <>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "gray",
                    }}
                  >
                    ₹{product.price}
                  </span>

                  <span className="text-success ms-3">
                    ₹{product.discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-success">₹{product.price}</span>
              )}
            </h3>

            <hr />

            {/* SIZE */}

            <div className="mb-3 pd-card">
              <label className="fw-bold">Select Size</label>

              <select
                className="form-select mt-2"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Choose Size</option>

                {product.sizes?.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-3 mb-3 pd-card">
              <h5>Product Details</h5>

              <p>
                <strong>Category:</strong> {product.category}
              </p>

              <p>
                <strong>Color:</strong> {selectedColor?.name || "N/A"}
              </p>

              <p>
                <strong>Material:</strong> {product.material}
              </p>

              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>
            </div>

            <div className="card p-3 mb-3 pd-card">
              <h5>Description</h5>
              <p>{product.description}</p>
            </div>
<div className="card p-3 mb-3 pd-card">
  <h5>Delivery Information</h5>

  <p className="mb-1">
    🚚 FREE Delivery
  </p>

  <p className="mb-1">
    📦 Expected Delivery:
    {getDeliveryDate()}
  </p>

  <p className="mb-0">
    💵 Cash On Delivery Available
  </p>
</div>
<div className="card p-3 mb-3 pd-card">
  <h5>Availability</h5>

  {product.stock > 5 ? (
    <span className="text-success fw-bold">
      In Stock ({product.stock})
    </span>
  ) : (
    <span className="text-danger fw-bold">
      Only {product.stock} Left
    </span>
  )}
</div>
<div className="card p-3 mb-3 pd-card">
  <h5>Available Offers</h5>

  <ul className="mb-0">
    <li>🎉 Buy 2 Get 1 Free</li>

    <li>💳 10% Instant Discount</li>

    <li>🚚 Free Shipping</li>

    <li>🎁 Festival Offer Available</li>
  </ul>
</div>
<div className="card p-3 mb-3 sp">
  <h5>Specifications</h5>

  <table className="table table-bordered">
    <tbody>
      <tr>
        <td>Category</td>
        <td>{product.category}</td>
      </tr>

      <tr>
        <td>Material</td>
        <td>{product.material}</td>
      </tr>

      <tr>
        <td>Color</td>
        <td>{selectedColor?.name}</td>
      </tr>

      <tr>
        <td>Stock</td>
        <td>{product.stock}</td>
      </tr>

      <tr>
        <td>Rating</td>
        <td>{product.rating}</td>
      </tr>
    </tbody>
  </table>
</div>
<div className="card p-3 mb-3 pd-card">
  <h5>Why Buy This Product?</h5>

  <ul>
    <li>Premium Quality Bangles</li>

    <li>Long Lasting Color</li>

    <li>Perfect For Festivals</li>

    <li>Comfortable Daily Wear</li>

    <li>Attractive Traditional Design</li>
  </ul>
</div>
<div className="card p-3 mb-3 pd-card">
  <h5>Return Policy</h5>

  <p>
    🔄 Easy 7 Days Return
  </p>

  <p>
    ✔ Damaged Product Replacement Available
  </p>

  <p>
    ✔ Secure Packaging
  </p>
</div>
            {/* <div className="card p-3 mb-3">
              <h5>Highlights</h5>
              <p>{product.highlights}</p>
            </div> */}

            {/* <div className="card p-3 mb-3">
              <h5>Care Instructions</h5>
              <p>{product.careInstructions}</p>
            </div> */}

            <div className="d-flex gap-2">
              <button className="btn btn-danger" onClick={addToWishlist}>
                ❤️ Wishlist
              </button>

              <button className="btn btn-primary" onClick={addToCart}>
                🛒 Add To Cart
              </button>

              <button className="btn btn-success" onClick={buyNow}>
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductDetails;
