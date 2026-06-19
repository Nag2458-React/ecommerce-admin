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

const handlePlaceOrder = async () => {

  try {

    await addDoc(
      collection(db, "orders"),
      {
        customerName: name,
        mobile: mobile,
        address: address,
        city: city,
        state: state,
        pincode: pincode,

        userEmail: user,

        products: cart,

        totalAmount: total,

        paymentMethod: "COD",

        paymentStatus: "Pending",

        orderStatus: "Pending",

        createdAt: Timestamp.now(),
      }
    );

    localStorage.removeItem(
      `cart_${user}`
    );

    alert(
      "Order Placed Successfully"
    );

    navigate("/");

  } catch (error) {

    console.log(error);

    alert(
      "Order Failed"
    );

  }

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
              handlePlaceOrder
            }
          >

            Pay Now

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
