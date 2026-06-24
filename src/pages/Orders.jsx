import React, {
useState,
useEffect
} from "react";

import {
collection,
addDoc,
Timestamp
} from "firebase/firestore";

import { db }
from "../firebase/firebase";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Orders = () => {

const navigate =
useNavigate();
const RAZORPAY_KEY =
  "rzp_test_T5QLPA6M6rafg9";
const user =
localStorage.getItem(
"currentUser"
);

const [cart, setCart] =
useState([]);

const [name, setName] =
useState("");

const [mobile, setMobile] =
useState("");

const [address, setAddress] =
useState("");

const [city, setCity] =
useState("");

const [state, setState] =
useState("");

const [pincode, setPincode] =
useState("");
const [landmark, setLandmark] =
  useState("");

const [alternateMobile,
  setAlternateMobile] =
  useState("");
useEffect(() => {


const data =
  JSON.parse(
    localStorage.getItem(
      `cart_${user}`
    )
  ) || [];

setCart(data);


}, [user]);

const total =
cart.reduce(
(sum, item) =>
sum +
Number(
item.discountPrice ||
item.price
) *
Number(item.qty),
0
);

const handlePayment = () => {

  if (
    !name ||
    !mobile ||
    !address ||
    !city ||
    !state ||
    !pincode
  ) {
    alert("Please Fill All Fields");
    return;
  }

  const options = {

    key: RAZORPAY_KEY,

    amount: total * 100,

    currency: "INR",

    name: "Bangles Store",

    description:
      "Test Payment",
  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
  },
   modal: {
    ondismiss: function () {
      console.log(
        "Payment Popup Closed"
      );
    },
  },
   retry: {
    enabled: false,
  },
    handler: async function (
      response
    ) {

      try {

        await addDoc(
          collection(
            db,
            "orders"
          ),
          {

            customerName: name,

            mobile,

            alternateMobile,

            landmark,

            address,

            city,

            state,

            pincode,

            userEmail: user,

            products: cart,

            totalAmount:
              total,

            paymentMethod:
              "Razorpay",

            paymentStatus:
              "Paid",

            paymentId:
              response
                .razorpay_payment_id,

            orderStatus:
              "Pending",

            createdAt:
              Timestamp.now(),
          }
        );

        localStorage.removeItem(
          `cart_${user}`
        );

        window.dispatchEvent(
          new Event(
            "cartUpdated"
          )
        );

        alert(
          "Payment Success"
        );

        navigate(
          "/myorders"
        );

      } catch (error) {

        console.log(
          error
        );

        alert(
          "Order Failed"
        );

      }
    },

    prefill: {

      name,

      email: user,

      contact: mobile,

    },

    theme: {
      color:
        "#3399cc",
    },
  };

  const razorpay =
    new window.Razorpay(
      options
    );
razorpay.on("payment.failed", function (response) {

  console.log("PAYMENT FAILED");

  console.log(response);

  alert(
    response.error.description ||
    "Payment Failed"
  );

});
  razorpay.open();
};

return (
<>
<Navbar />

<div className="container mt-5">

  <div className="row">

    <div className="col-md-8">

      <div className="card shadow">

        <div className="card-body">

          <h3 className="mb-4">
            Delivery Address
          </h3>

          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="mb-3">
            <label>Mobile</label>
            <input
              type="text"
              className="form-control"
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value
                )
              }
            />
          </div>
              <div className="mb-3">

  <label>
    Alternate Mobile
  </label>

  <input
    type="text"
    className="form-control"
    value={
      alternateMobile
    }
    onChange={(e) =>
      setAlternateMobile(
        e.target.value
      )
    }
  />

</div>
          <div className="mb-3">
            <label>Address</label>
            <textarea
              className="form-control"
              rows="3"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
            />
          </div>
<div className="mb-3">

  <label>
    Landmark
  </label>

  <input
    type="text"
    className="form-control"
    value={landmark}
    onChange={(e) =>
      setLandmark(
        e.target.value
      )
    }
  />

</div>
          <div className="row">

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="State"
                value={state}
                onChange={(e) =>
                  setState(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target.value
                  )
                }
              />
            </div>

          </div>

        </div>

      </div>

    </div>

    <div className="col-md-4">

      <div className="card shadow">

        <div className="card-body">

          <h3>
            Order Summary
          </h3>

          <hr />

          {cart.map(
            (item) => (

            <div
              key={item.id}
              className="mb-2"
            >

              {item.productName}
              × {item.qty}

              <span className="float-end">

                ₹
                {(
                  Number(
                    item.discountPrice ||
                    item.price
                  ) *
                  Number(item.qty)
                )}

              </span>

            </div>

          ))}

          <hr />

          <h4 className="text-success">

            Total :
            ₹{total}

          </h4>

        <button
  className="btn btn-success w-100 mt-3"
  onClick={
    handlePayment
  }
>
  Pay ₹{total}
</button>

        </div>

      </div>

    </div>

  </div>

</div>
</>

);

};

export default Orders;
