import React, { useEffect, useState } from "react";
import { useNavigate,Link,useLocation } from "react-router-dom";
import { FaWhatsapp, FaArrowLeft } from "react-icons/fa";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";

const WhatsappOrder = () => {
  const navigate = useNavigate();
const location = useLocation();
  const {
  cart,
  removeFromCart,
} = useCart();

const isBuyNow =
  location.state?.buyNow;

const buyNowProduct =
  location.state?.product;

const orderItems = isBuyNow
  ? [buyNowProduct]
  : cart;

  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
    pincode: "",
  });

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("customerDetails")
    );

    if (saved) {
      setCustomer(saved);
    }
  }, []);

  const handleInput = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

const total = orderItems.reduce(
  (sum, item) =>
    sum +
    Number(item.discountPrice || item.price) *
      Number(item.qty || 1),
  0
);

const totalItems = orderItems.reduce(
  (sum, item) =>
    sum + Number(item.qty || 1),
  0
);

  const deliveryCharge = total >= 1000 ? 0 : 50;

  const grandTotal = total + deliveryCharge;

  const whatsappNumber = "918008320342";

  const sendOrder = async () => {
    if (
      !customer.name ||
      !customer.mobile ||
      !customer.address ||
      !customer.pincode
    ) {
      alert("Please fill all details.");
      return;
    }

    const orderId =
      "ORD-" +
      new Date().getFullYear() +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    let message = `🛍️ *NEW ORDER*\n\n`;

    message += `🆔 Order ID : ${orderId}\n\n`;

    message += `👤 Customer Details\n`;
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `Name : ${customer.name}\n`;
    message += `Mobile : ${customer.mobile}\n`;
    message += `Address : ${customer.address}\n`;
    message += `Pincode : ${customer.pincode}\n\n`;

    message += `🛒 Products\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;

    orderItems.forEach((item, index) => {
  const price =
    Number(item.discountPrice || item.price);

  const subtotal =
    price * Number(item.qty);

  message += `📦 Product ${index + 1}\n`;
  message += `Name : ${item.productName}\n`;
  message += `Category : ${item.category}\n`;
  message += `Size : ${item.selectedSize || "-"}\n`;
  message += `Color : ${item.selectedColor?.name || "-"}\n`;
  message += `Qty : ${item.qty}\n`;
  message += `Price : ₹${price}\n`;
  message += `Subtotal : ₹${subtotal}\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
});

    message += `\n💰 Summary\n`;
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `Items : ${totalItems}\n`;
    message += `Subtotal : ₹${total}\n`;
    message += `Delivery : ${
      deliveryCharge === 0
        ? "FREE"
        : "₹" + deliveryCharge
    }\n`;

    message += `Grand Total : ₹${grandTotal}\n\n`;

    message += `🙏 Please confirm my order.`;

    localStorage.setItem(
      "customerDetails",
      JSON.stringify(customer)
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );

    if (!isBuyNow) {
  for (const item of cart) {
    await removeFromCart(
      item.productId,
      item.selectedSize,
      item.selectedColor?.name
    );
  }
}

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

return (
  <>
    <Navbar />

    <div className="container py-4">

      <Link
        to={isBuyNow ? "/" : "/cart"}
        className="btn btn-outline-dark mb-4"
      >
        <FaArrowLeft className="me-2" />
        {isBuyNow ? "Continue Shopping" : "Back to Cart"}
      </Link>

      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-lg-5 mb-4">

          <div className="card shadow h-100">

            <div className="card-body">

              <h4 className="mb-4 fw-bold">
                Order Summary
              </h4>

              {orderItems.map((item) => {

                const price =
                  Number(item.discountPrice || item.price);

                return (

                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor?.name}`}
                    className="border rounded p-3 mb-3"
                  >

                    <img
                      src={
                        item.selectedColor?.image ||
                        item.imagePath
                      }
                      alt={item.productName}
                      className="img-fluid rounded mb-3"
                      style={{
                        height: "220px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "/images/no-image.png";
                      }}
                    />

                    <h5 className="fw-bold">
                      {item.productName}
                    </h5>

                    <p className="text-muted mb-2">
                      {item.category}
                    </p>

                    <table className="table table-sm">

                      <tbody>

                        <tr>
                          <th>Size</th>
                          <td>
                            {item.selectedSize || "-"}
                          </td>
                        </tr>

                        <tr>
                          <th>Color</th>
                          <td>
                            {item.selectedColor?.name || "-"}
                          </td>
                        </tr>

                        <tr>
                          <th>Quantity</th>
                          <td>{item.qty}</td>
                        </tr>

                        <tr>
                          <th>Price</th>
                          <td>
                            ₹{price}
                          </td>
                        </tr>

                        <tr>
                          <th>Subtotal</th>
                          <td className="fw-bold text-success">
                            ₹{price * item.qty}
                          </td>
                        </tr>

                      </tbody>

                    </table>

                  </div>

                );

              })}

              <hr />

              <div className="d-flex justify-content-between">
                <span>Total Items</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>Subtotal</span>
                <strong>₹{total}</strong>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>Delivery</span>

                <strong>
                  {deliveryCharge === 0
                    ? "FREE 🎉"
                    : `₹${deliveryCharge}`}
                </strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between">

                <h4>Grand Total</h4>

                <h4 className="text-success">
                  ₹{grandTotal}
                </h4>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="col-lg-7">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="mb-4">
                Customer Details
              </h3>

              <div className="mb-3">
                <label className="form-label">
                  Full Name
                </label>

                <input
                  className="form-control"
                  name="name"
                  value={customer.name}
                  onChange={handleInput}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Mobile Number
                </label>

                <input
                  className="form-control"
                  name="mobile"
                  value={customer.mobile}
                  onChange={handleInput}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Delivery Address
                </label>

                <textarea
                  rows="4"
                  className="form-control"
                  name="address"
                  value={customer.address}
                  onChange={handleInput}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Pincode
                </label>

                <input
                  className="form-control"
                  name="pincode"
                  value={customer.pincode}
                  onChange={handleInput}
                />
              </div>

              <button
                className="btn btn-success btn-lg w-100"
                onClick={sendOrder}
              >
                <FaWhatsapp className="me-2" />
                Confirm & Send Order
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </>
);
};

export default WhatsappOrder;