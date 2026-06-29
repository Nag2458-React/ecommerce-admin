import React, { useEffect, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Orders = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("currentUser");

  const [cart, setCart] = useState([]);
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

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
    setCart(data);
  }, [user]);

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.discountPrice || item.price) * Number(item.qty),
    0,
  );

  const sendOtp = () => {
    if (!mobile || mobile.length < 10) {
      alert("Enter valid mobile");
      return;
    }

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
        totalAmount: total,
        paymentMethod,
        paymentStatus: "Paid",
        paymentId: "PAY_" + Date.now(),
        orderStatus: "Pending",
        createdAt: Timestamp.now(),
      });

      localStorage.removeItem(`cart_${user}`);

      window.dispatchEvent(new Event("cartUpdated"));

      alert("Payment Success");

      navigate("/myorders");
    } catch (error) {
      console.log(error);
      alert("Order Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                <h3>Delivery Address</h3>

                <input
                  className="form-control mb-3"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  placeholder="Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />

                <textarea
                  className="form-control mb-3"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <input
                  className="form-control mb-3"
                  placeholder="State"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />

                <input
                  className="form-control"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body">
                <h4>Total ₹{total}</h4>

                <button className="btn btn-success w-100" onClick={sendOtp}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showOtp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
          }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{
              width: "400px",
              margin: "120px auto",
            }}
          >
            <h4>OTP Verification</h4>

            <input
              className="form-control my-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="btn btn-primary w-100" onClick={verifyOtp}>
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {showPayment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
          }}
        >
          <div
            className="bg-white p-4 rounded"
            style={{
              width: "500px",
              margin: "80px auto",
            }}
          >
            <h3>Select Payment</h3>

            <select
              className="form-select mb-3"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>UPI</option>
              <option>Card</option>
              <option>Wallet</option>
              <option>Net Banking</option>
            </select>

            <button className="btn btn-success w-100" onClick={completePayment}>
              Pay ₹{total}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
