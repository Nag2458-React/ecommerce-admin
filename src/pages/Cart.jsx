import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaWhatsapp } from "react-icons/fa";
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
 
  const [customer, setCustomer] = useState({
  name: "",
  mobile: "",
  address: "",
  pincode: "",
});
  const user = localStorage.getItem("currentUser");
 useEffect(() => {
  const user = localStorage.getItem("currentUser");

  const data = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
  setCart(data);

  const savedCustomer = JSON.parse(
    localStorage.getItem("customerDetails")
  );

  if (savedCustomer) {
    setCustomer(savedCustomer);
  }
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
  const deliveryCharge = total >= 1000 ? 0 : 50;
const grandTotal = total + deliveryCharge;
  window.dispatchEvent(new Event("cartUpdated"));

  const handleInput = (e) => {
  setCustomer({
    ...customer,
    [e.target.name]: e.target.value,
  });
};

 const whatsappNumber = "918008320342";

const orderOnWhatsApp = () => {
  if (
    !customer.name ||
    !customer.mobile ||
    !customer.address ||
    !customer.pincode
  ) {
    alert("Please fill all customer details.");
    return;
  }

  // Generate Order ID
  const orderId =
    "ORD-" +
    new Date().getFullYear() +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  let message = `🛍️ *NEW ORDER REQUEST*\n\n`;

  message += `🆔 Order ID : ${orderId}\n\n`;

  message += `👤 Customer Details\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Name : ${customer.name}\n`;
  message += `Mobile : ${customer.mobile}\n`;
  message += `Address : ${customer.address}\n`;
  message += `Pincode : ${customer.pincode}\n\n`;

  message += `🛒 Ordered Products\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  cart.forEach((item, index) => {
    const price = Number(item.discountPrice || item.price);
    const subtotal = price * Number(item.qty);

    message += `📦 Product ${index + 1}\n`;
    message += `Name : ${item.productName}\n`;
    message += `Category : ${item.category}\n`;
    message += `Size : ${item.selectedSize}\n`;
    message += `Color : ${item.selectedColor?.name || "Default"}\n`;
    message += `Qty : ${item.qty}\n`;
    message += `Price : ₹${price}\n`;
    message += `Subtotal : ₹${subtotal}\n`;

    // Image URL (Only if public URL)
    if (item.selectedColor?.image || item.imagePath) {
      message += `Image : ${
        item.selectedColor?.image || item.imagePath
      }\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
  });

  message += `\n💰 Order Summary\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Items : ${totalItems}\n`;
  message += `Subtotal : ₹${total}\n`;
  message += `Delivery : ${
    deliveryCharge === 0 ? "FREE 🎉" : `₹${deliveryCharge}`
  }\n`;
  message += `Grand Total : ₹${grandTotal}\n\n`;

  message += `🚚 Expected Delivery : 3 - 5 Working Days\n\n`;

  message += `🙏 Please confirm my order. Thank you!`;

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  // Clear Cart
  saveCart([]);

  // Save Customer Details
  localStorage.setItem(
    "customerDetails",
    JSON.stringify(customer)
  );

  // Redirect Home
  setTimeout(() => {
    navigate("/");
  }, 1000);
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

                 <h3 className="text-primary">
   Grand Total : ₹{grandTotal}
</h3>

<p>
  Delivery :
  <strong className="ms-2">
    {deliveryCharge === 0 ? "FREE 🎉" : `₹${deliveryCharge}`}
  </strong>
</p>

                  <button
                    className="
        btn
        btn-success
        w-100
        mt-3
      "
                    // onClick={() => navigate("/orders")}
                  >
                    Proceed To Checkout
                  </button>
                <button
  className="btn btn-success w-100 mt-3"
  data-bs-toggle="modal"
  data-bs-target="#orderModal"
>
  <FaWhatsapp className="me-2" />
  Order on WhatsApp
</button>
                </div>
              </div>
            </div>


          <div
  className="modal fade"
  id="orderModal"
  tabIndex="-1"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">

      <div className="modal-header">
        <h5 className="modal-title">
          Customer Details
        </h5>

        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
        ></button>
      </div>

      <div className="modal-body">

        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={customer.name}
            onChange={handleInput}
          />
        </div>

        <div className="mb-3">
          <label>Mobile Number</label>
          <input
            type="tel"
            className="form-control"
            name="mobile"
            value={customer.mobile}
            onChange={handleInput}
          />
        </div>

        <div className="mb-3">
          <label>Delivery Address</label>
          <textarea
            className="form-control"
            rows="3"
            name="address"
            value={customer.address}
            onChange={handleInput}
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Pincode</label>
          <input
            type="text"
            className="form-control"
            name="pincode"
            value={customer.pincode}
            onChange={handleInput}
          />
        </div>

      </div>

      <div className="modal-footer">

        <button
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Cancel
        </button>

        <button
          className="btn btn-success"
          onClick={orderOnWhatsApp}
        >
          <FaWhatsapp className="me-2" />
          Send Order
        </button>

      </div>

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
