import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaWhatsapp } from "react-icons/fa";
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const user = localStorage.getItem("currentUser");
  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    const data = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];

    setCart(data);
  }, []);

  const saveCart = (updated) => {
    setCart(updated);

    const user = localStorage.getItem("currentUser");

    localStorage.setItem(`cart_${user}`, JSON.stringify(updated));
  };

  const updateQty = (id, size, type) => {
    const updated = cart.map((item) => {
      if (item.id === id && item.selectedSize === size) {
        if (type === "plus") {
          if (item.qty >= item.stock) {
            alert(`${item.productName} Out Of Stock`);

            return item;
          }

          return {
            ...item,
            qty: item.qty + 1,
          };
        }

        if (type === "minus" && item.qty > 1) {
          return {
            ...item,
            qty: item.qty - 1,
          };
        }
      }

      return item;
    });

    saveCart(updated);
  };

  const removeItem = (id, size) => {
    const updated = cart.filter(
      (item) => !(item.id === id && item.selectedSize === size),
    );

    saveCart(updated);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.discountPrice || item.price || 0) * Number(item.qty || 1),
    0,
  );
  const originalTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );

  const totalSavings = originalTotal - total;

  const totalItems = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);
  window.dispatchEvent(new Event("cartUpdated"));



  const whatsappNumber = "918008320342"; 

const orderOnWhatsApp = () => {
  let message = `🛍️ *New Order Request*%0A%0A`;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.productName}%0A`;
    message += `   Size : ${item.selectedSize}%0A`;
    message += `   Color : ${item.selectedColor?.name || "Default"}%0A`;
    message += `   Qty : ${item.qty}%0A`;
    message += `   Price : ₹${item.discountPrice || item.price}%0A`;
    message += `   Total : ₹${(item.discountPrice || item.price) * item.qty}%0A%0A`;
  });

  message += `🧾 Grand Total : ₹${total}%0A%0A`;
  message += `Please confirm my order.`;

  window.open(
    `https://wa.me/${whatsappNumber}?text=${message}`,
    "_blank"
  );
};
  return (
    <>
      <Navbar />
      <div className="container mt-4 cart">
        <div className="d-flex justify-content-between mb-4">
          <h2 className="text-black">Shopping Cart</h2>

          <Link to="/" className="btn btn-cont">
            <FaHome className="me-1" /> Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <h4 className="text-black">No Products In Cart</h4>
        ) : (
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {cart.map((item) => (
                  <div className="col-md-4">
                    <div
                      className="card mb-3"
                      key={item.id + item.selectedSize}
                    >
                      <div className="row g-0">
                        <div style={{ height: "200px" }}>
                          <img
                            src={item.selectedColor?.image || item.imagePath}
                            alt={item.productName}
                            className="img-fluid pr"
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                            onError={(e) => {
                              e.target.src = "/images/no-image.png";
                            }}
                          />
                        </div>

                        <div className="card-body">
                          <h5 className="fw-bold">{item.productName}</h5>

                          <span className="badge bg-primary">
                            {item.category}
                          </span>

                          <p>
                            <strong>Size :</strong> {item.selectedSize}
                          </p>

                          <p>
                            <strong>Color :</strong>{" "}
                            {item.selectedColor?.name || "Default"}
                          </p>
                          {item.colors?.length > 0 && (
                            <div className="d-flex gap-2 mb-2">
                              {item.colors.map((color, index) => (
                                <div
                                  key={index}
                                  title={color.name}
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                    borderRadius: "50%",
                                    background: color.code,
                                    border:
                                      item.selectedColor?.name === color.name
                                        ? "3px solid black"
                                        : "1px solid #ccc",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    const updated = cart.map((p) =>
                                      p.id === item.id &&
                                      p.selectedSize === item.selectedSize
                                        ? {
                                            ...p,
                                            selectedColor: color,
                                            imagePath: color.image,
                                          }
                                        : p,
                                    );

                                    setCart(updated);

                                    localStorage.setItem(
                                      `cart_${user}`,
                                      JSON.stringify(updated),
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          )}
                          <p>
                            <strong>Material :</strong> {item.material}
                          </p>

                          <p>
                            <strong>Stock :</strong> {item.stock}
                          </p>
                          {item.qty >= item.stock && (
                            <div
                              className="
      alert
      alert-danger
      text-center
      mt-2
      mb-2
      p-2
      "
                            >
                              Out Of Stock
                            </div>
                          )}
                          <div className="mb-2">
                            {item.discountPrice > 0 ? (
                              <>
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "gray",
                                  }}
                                >
                                  ₹{item.price}
                                </span>

                                <br />

                                <span
                                  className="
            text-success
            fw-bold
          "
                                  style={{
                                    fontSize: "22px",
                                  }}
                                >
                                  ₹{item.discountPrice}
                                </span>

                                <br />

                                <small
                                  className="
            text-success
            fw-bold
          "
                                >
                                  Save ₹{item.price - item.discountPrice}
                                </small>

                                <span
                                  className="
            badge
            bg-danger
            
          "
                                >
                                  {Math.round(
                                    ((item.price - item.discountPrice) /
                                      item.price) *
                                      100,
                                  )}
                                  % OFF
                                </span>
                              </>
                            ) : (
                              <span
                                className="
          text-success
          fw-bold
        "
                              >
                                ₹{item.price}
                              </span>
                            )}
                          </div>

                          <div
                            className="
      d-flex
      align-items-center
      mb-3
    "
                            style={{ paddingLeft: "30px" }}
                          >
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                updateQty(item.id, item.selectedSize, "minus")
                              }
                            >
                              -
                            </button>

                            <span
                              className="
        mx-3
        fw-bold
      "
                            >
                              {item.qty}
                            </span>

                            <button
                              className="btn btn-success"
                              disabled={item.qty >= item.stock}
                              onClick={() =>
                                updateQty(item.id, item.selectedSize, "plus")
                              }
                            >
                              +
                            </button>
                          </div>

                          <div
                            className="
      alert
      alert-success
      
    "
                          >
                            Sub Total : ₹
                            {Number(item.discountPrice || item.price) *
                              Number(item.qty)}
                          </div>

                          <button
                            className="
      btn
      btn-outline-danger
      w-100
    "
                            onClick={() =>
                              removeItem(item.id, item.selectedSize)
                            }
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

            <div className="col-md-4">
              <div className="card shadow">
                <div className="card-body">
                  <h3>Order Summary</h3>

                  <hr />

                  <p>
                    Total Items :<strong> {totalItems}</strong>
                  </p>

                  <p>
                    Original Price :<strong>₹{originalTotal}</strong>
                  </p>

                  <p
                    className="
        text-success
        fw-bold
      "
                  >
                    Total Savings : ₹{totalSavings}
                  </p>

                  <hr />

                  <h3
                    className="
        text-primary
      "
                  >
                    Grand Total : ₹{total}
                  </h3>

                  <button
                    className="
        btn
        btn-success
        w-100
        mt-3
      "
                    onClick={() => navigate("/orders")}
                  >
                    Proceed To Checkout
                  </button>
                  <button
  className="btn btn-success w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
  onClick={orderOnWhatsApp}
>
  <FaWhatsapp size={22} />
  Order on WhatsApp
</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
