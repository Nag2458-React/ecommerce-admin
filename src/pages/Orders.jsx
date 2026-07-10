import React, { useEffect, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
const Orders = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("currentUser");
  const { cart, removeFromCart } = useCart();
  // const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const getDeliveryDate = () => {
    const d = new Date();

    d.setDate(d.getDate() + 5);

    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customerAddress"));

    if (saved) {
      setName(saved.name || "");
      setMobile(saved.mobile || "");
      setAddress(saved.address || "");
      setCity(saved.city || "");
      setStateName(saved.state || "");
      setPincode(saved.pincode || "");
    }
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.discountPrice || item.price) * Number(item.qty),
    0,
  );

  const originalTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0,
  );

  const totalSavings = originalTotal - total;

  const deliveryCharge = total >= 1000 ? 0 : 50;

  const grandTotal = total + deliveryCharge;

  const finalTotal = grandTotal - discount;

  const totalItems = cart.reduce((sum, item) => sum + Number(item.qty), 0);
  const sendOtp = () => {
    // Cart Empty
    if (cart.length === 0) {
      alert("Please select at least one product.");

      navigate("/cart"); // Optional: Redirect to Cart

      return;
    }

    // Name
    if (!name.trim()) {
      alert("Enter your name");
      return;
    }

    // Mobile
    if (!mobile.trim() || mobile.trim().length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    // Address
    if (!address.trim()) {
      alert("Enter address");
      return;
    }

    // City
    if (!city.trim()) {
      alert("Enter city");
      return;
    }

    // State
    if (!stateName.trim()) {
      alert("Enter state");
      return;
    }

    // Pincode
    if (!pincode.trim() || pincode.trim().length !== 6) {
      alert("Enter valid pincode");
      return;
    }

    // Generate Demo OTP
    const demoOtp = "123456";
    setGeneratedOtp(demoOtp);
    setShowOtp(true);

    alert("Demo OTP Sent Successfully\n\nUse OTP: 123456");
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      alert("OTP Verified");
      setShowOtp(false);
      setShowPayment(true);
    } else {
      alert("Invalid OTP");
    }
  };

  const completePayment = async () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    localStorage.setItem(
      "customerAddress",
      JSON.stringify({
        name,
        mobile,
        address,
        city,
        state: stateName,
        pincode,
      }),
    );
    try {
      await addDoc(collection(db, "orders"), {
        customerName: name,
        mobile,
        address,
        city,
        state: stateName,
        pincode,
        userEmail: user,
        products: cart,
        totalAmount: finalTotal,
        paymentMethod,
        paymentStatus:
          paymentMethod === "Cash On Delivery" ? "Pending" : "Paid",

        paymentId:
          paymentMethod === "Cash On Delivery" ? "" : "PAY_" + Date.now(),

        orderStatus: "Pending",

        deliveryDate: Timestamp.fromDate(deliveryDate),

        createdAt: Timestamp.now(),
      });

      localStorage.removeItem(`cart_${user}`);

      window.dispatchEvent(new Event("cartUpdated"));

      alert(
        `Order Placed Successfully 🎉

Payment : ${paymentMethod}

Amount : ₹${finalTotal}`,
      );

      navigate("/myorders");
    } catch (error) {
      console.log(error);
      alert("Order Failed");
    }
  };
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "WELCOME10") {
      const dis = Math.min(total * 0.1, 200);
      setDiscount(dis);
      setCouponMessage("✅ WELCOME10 Applied");
    } else if (code === "SAVE100") {
      if (grandTotal >= 999) {
        setDiscount(100);
        setCouponMessage("✅ SAVE100 Applied");
      } else {
        setDiscount(0);
        setCouponMessage("Minimum order ₹999");
      }
    } else if (code === "BANGLE50") {
      if (grandTotal >= 499) {
        setDiscount(50);
        setCouponMessage("✅ BANGLE50 Applied");
      } else {
        setDiscount(0);
        setCouponMessage("Minimum order ₹499");
      }
    } else {
      setDiscount(0);
      setCouponMessage("Invalid Coupon");
    }
  };
  const removeCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setCouponMessage("");
  };
  return (
    <>
      <Navbar />

      <div className="container my-4">
        <div className="row g-4">
          {/* LEFT */}

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white">
                <h4 className="fw-bold mb-0">Delivery Address</h4>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>

                    <input
                      className="form-control"
                      placeholder="Enter Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile Number</label>

                    <input
                      className="form-control"
                      placeholder="10 Digit Mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Address</label>

                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="House No, Street, Area..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>

                    <input
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>

                    <input
                      className="form-control"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Pincode</label>

                    <input
                      className="form-control"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}

            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h4 className="fw-bold mb-0">Order Items ({totalItems})</h4>
              </div>

              <div className="card-body">
                {cart.length === 0 ? (
                  <div className="text-center py-5">
                    <h4>No Products Selected</h4>

                    <p className="text-muted">
                      Please add at least one product to continue checkout.
                    </p>

                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/")}
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex border-bottom pb-3 mb-3"
                    >
                      <img
                        src={item.selectedColor?.image || item.imagePath}
                        alt=""
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />

                      <div className="ms-3 flex-grow-1">
                        <h6 className="fw-bold">{item.productName}</h6>

                        <p className="mb-1 text-muted">
                          Size : <b className="ms-1">{item.selectedSize}</b>
                        </p>

                        <p className="mb-1 text-muted">
                          Color :
                          <b className="ms-1">{item.selectedColor?.name}</b>
                        </p>

                        <p className="mb-1">
                          Qty : <b className="ms-1">{item.qty}</b>
                        </p>

                        <div>
                          <span className="fw-bold text-success fs-5">
                            ₹{item.discountPrice}
                          </span>

                          <span className="ms-2 text-decoration-line-through text-muted">
                            ₹{item.price}
                          </span>
                        </div>

                        <button
                          className="btn btn-outline-danger btn-sm mt-3"
                          onClick={() => {
                            removeFromCart(
                              item.productId,
                              item.selectedSize,
                              item.selectedColor?.name,
                            );

                            if (cart.length === 1) {
                              navigate("/cart");
                            }
                          }}
                        >
                          🗑 Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="col-lg-4">
            <div
              className="card shadow border-0"
              style={{
                position: "sticky",
                top: "90px",
              }}
            >
              <div className="card-header bg-white">
                <h5 className="fw-bold mb-0">PRICE DETAILS</h5>
              </div>

              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Price ({totalItems} items)</span>

                  <b>₹{originalTotal}</b>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Discount</span>

                  <b className="text-success">- ₹{totalSavings}</b>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Charges</span>

                  <b>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</b>
                </div>
                <div className="mt-3">
                  <label className="fw-bold">Coupon Code</label>

                  <div className="input-group mt-2">
                    <input
                      className="form-control"
                      placeholder="Enter Coupon"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      disabled={discount > 0}
                    />

                    {discount > 0 ? (
                      <button className="btn btn-danger" onClick={removeCoupon}>
                        Remove
                      </button>
                    ) : (
                      <button className="btn btn-success" onClick={applyCoupon}>
                        Apply
                      </button>
                    )}
                  </div>

                  {couponMessage && (
                    <small
                      className={
                        discount > 0
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {couponMessage}
                    </small>
                  )}
                </div>
                <hr />

                {/* <div className="d-flex justify-content-between">
                  <h5>Total Amount</h5>

                  <h5 className="text-primary">₹{grandTotal}</h5>
                </div> */}
                <div className="d-flex justify-content-between mb-2">
                  <span>Coupon Discount</span>

                  <b className="text-success">- ₹{discount}</b>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <h5>Total Amount</h5>

                  <h5 className="text-primary">₹{finalTotal}</h5>
                </div>
                <p className="text-success mt-3">
                  You will save ₹{totalSavings}
                </p>
                <hr />

                <div className="d-flex justify-content-between">
                  <span>Expected Delivery</span>

                  <strong className="text-success">{getDeliveryDate()}</strong>
                </div>

                <p className="text-success mt-2 mb-0">
                  🚚 Delivery within 5 days
                </p>
                <button
                  className="btn btn-warning w-100 mt-3 fw-bold"
                  onClick={sendOtp}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showOtp && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(0,0,0,.55)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{
                borderRadius: "15px",
              }}
            >
              <div className="modal-header">
                <h4 className="fw-bold mb-0">Mobile Verification</h4>
              </div>

              <div className="modal-body text-center">
                <div
                  style={{
                    fontSize: "60px",
                  }}
                >
                  📱
                </div>

                <h5 className="fw-bold mt-2">Verify your Mobile Number</h5>

                <p className="text-muted">
                  OTP has been sent to
                  <br />
                  <b>{mobile}</b>
                </p>

                <input
                  type="text"
                  className="form-control text-center"
                  placeholder="Enter 6 Digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <small className="text-success">Demo OTP : 123456</small>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowOtp(false);
                    setOtp("");
                  }}
                >
                  Cancel
                </button>

                <button className="btn btn-success" onClick={verifyOtp}>
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPayment && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(0,0,0,.55)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content border-0 shadow"
              style={{
                borderRadius: "18px",
              }}
            >
              <div className="modal-header">
                <h3 className="fw-bold mb-0">Select Payment Method</h3>
              </div>

              <div className="modal-body">
                <div className="list-group">
                  <label className="list-group-item">
                    <input
                      className="form-check-input me-3"
                      type="radio"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                    />
                    UPI (PhonePe / Google Pay / Paytm)
                  </label>

                  <label className="list-group-item">
                    <input
                      className="form-check-input me-3"
                      type="radio"
                      checked={paymentMethod === "Card"}
                      onChange={() => setPaymentMethod("Card")}
                    />
                    Credit / Debit Card
                  </label>

                  <label className="list-group-item">
                    <input
                      className="form-check-input me-3"
                      type="radio"
                      checked={paymentMethod === "Net Banking"}
                      onChange={() => setPaymentMethod("Net Banking")}
                    />
                    Net Banking
                  </label>

                  <label className="list-group-item">
                    <input
                      className="form-check-input me-3"
                      type="radio"
                      checked={paymentMethod === "Wallet"}
                      onChange={() => setPaymentMethod("Wallet")}
                    />
                    Wallet
                  </label>

                  <label className="list-group-item">
                    <input
                      className="form-check-input me-3"
                      type="radio"
                      checked={paymentMethod === "Cash On Delivery"}
                      onChange={() => setPaymentMethod("Cash On Delivery")}
                    />
                    Cash On Delivery
                  </label>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <h4>Total Amount</h4>

                  <h3 className="text-success">₹{finalTotal}</h3>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPayment(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success px-4"
                  onClick={completePayment}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
