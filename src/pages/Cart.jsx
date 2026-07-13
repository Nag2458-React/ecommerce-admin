import React from "react";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";
const Cart = () => {
  const navigate = useNavigate();
  // const [cart, setCart] = useState([]);
  const { cart, removeFromCart, changeQty } = useCart();
  //   const [customer, setCustomer] = useState({
  //   name: "",
  //   mobile: "",
  //   address: "",
  //   pincode: "",
  // });
  const user = localStorage.getItem("currentUser");
  // useEffect(() => {
  //   const savedCustomer = JSON.parse(
  //     localStorage.getItem("customerDetails")
  //   );

  //   if (savedCustomer) {
  //     setCustomer(savedCustomer);
  //   }
  // }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.discountPrice || item.price || 0) * Number(item.qty || 1),
    0,
  );
  const getDeliveryDate = () => {
    const date = new Date();

    const random = Math.floor(Math.random() * 3) + 3;

    date.setDate(date.getDate() + random);

    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };
  const originalTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );

  const totalSavings = originalTotal - total;

  const totalItems = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);
  const deliveryCharge = total >= 1000 ? 0 : 50;
  const grandTotal = total + deliveryCharge;
  window.dispatchEvent(new Event("cartUpdated"));

  //   const handleInput = (e) => {
  //   setCustomer({
  //     ...customer,
  //     [e.target.name]: e.target.value,
  //   });
  // };

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
                  <div className="col-md-4" key={item.id}>
                    <div className="card mb-3">
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
                          {/* {item.colors?.length > 0 && (
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
                          )} */}
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
                              onClick={() => {
                                if (item.qty > 1) {
                                  changeQty(item.id, item.qty - 1);
                                }
                              }}
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
                              onClick={() => changeQty(item.id, item.qty + 1)}
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
                              removeFromCart(
                                item.productId,
                                item.selectedSize,
                                item.selectedColor?.name,
                              )
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

                  <h3 className="text-primary">Grand Total : ₹{grandTotal}</h3>

                  <p>
                    Delivery :
                    <strong className="ms-2">
                      {deliveryCharge === 0 ? "FREE 🎉" : `₹${deliveryCharge}`}
                    </strong>
                  </p>
                

                  <div
                    className="p-3 rounded mb-3"
                    style={{
                      background: "#fff8e1",
                      border: "1px dashed #f0ad4e",
                    }}
                  >
                    <h6 className="fw-bold text-dark mb-2">
                      🏷 Available Coupons
                    </h6>

                    <div className="small mb-2">
                      <span className="badge bg-success me-2">WELCOME10</span>
                      Get <b>10% OFF</b> (Max ₹200)
                    </div>

                    <div className="small mb-2">
                      <span className="badge bg-primary me-2">SAVE100</span>
                      Flat <b>₹100 OFF</b> on orders above ₹999
                    </div>

                    <div className="small">
                      <span className="badge bg-danger me-2">BANGLE50</span>
                      Flat <b>₹50 OFF</b> on orders above ₹499
                    </div>

                    <small className="text-muted d-block mt-2">
                      Coupons can be applied during Checkout.
                    </small>
                  </div>

                  <div
                    className="alert alert-success mb-3"
                    style={{
                      borderRadius: "10px",
                    }}
                  >
                    <div className="fw-bold">🚚 Expected Delivery</div>

                    <div>
                      <strong>{getDeliveryDate()}</strong>
                    </div>

                    <small>Delivery in 3 - 5 business days</small>
                  </div>
                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={() => {
                      if (cart.length === 0) {
                        alert("Your cart is empty");
                        return;
                      }

                      navigate("/orders");
                    }}
                  >
                    Proceed To Checkout
                  </button>
                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={() =>
                      navigate("/whatsapp-order", {
                        state: {
                          cart,
                        },
                      })
                    }
                  >
                    <FaWhatsapp className="me-2" />
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
