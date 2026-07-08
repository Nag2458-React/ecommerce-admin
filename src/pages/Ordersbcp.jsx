import React, { useEffect, useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Orders = () => {
  const navigate = useNavigate();

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

  const [alternateMobile,
    setAlternateMobile] =
    useState("");

  const [address,
    setAddress] =
    useState("");

  const [landmark,
    setLandmark] =
    useState("");

  const [city, setCity] =
    useState("");

  const [stateName,
    setStateName] =
    useState("");

  const [pincode,
    setPincode] =
    useState("");

  const [showOtp,
    setShowOtp] =
    useState(false);

  const [showPayment,
    setShowPayment] =
    useState(false);

  const [otp, setOtp] =
    useState("");

  const [generatedOtp,
    setGeneratedOtp] =
    useState("");

  const [seconds,
    setSeconds] =
    useState(30);

  const [paymentMethod,
    setPaymentMethod] =
    useState("UPI");

  const [upiId,
    setUpiId] =
    useState("");

  const [cardNumber,
    setCardNumber] =
    useState("");

  const [cardName,
    setCardName] =
    useState("");

  const [expiry,
    setExpiry] =
    useState("");

  const [cvv,
    setCvv] =
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

  useEffect(() => {
    if (
      showOtp &&
      seconds > 0
    ) {
      const timer =
        setTimeout(() => {
          setSeconds(
            seconds - 1
          );
        }, 1000);

      return () =>
        clearTimeout(timer);
    }
  }, [showOtp, seconds]);

  const sendOtp = () => {
    if (
      !name ||
      !mobile ||
      !address ||
      !city ||
      !stateName ||
      !pincode
    ) {
      alert(
        "Fill all fields"
      );
      return;
    }

    const demoOtp =
      "123456";

    setGeneratedOtp(
      demoOtp
    );

    setShowOtp(true);

    setSeconds(30);

    alert(
      "Demo OTP Sent\n\nOTP : 123456"
    );
  };

  const verifyOtp = () => {
    if (
      otp === generatedOtp
    ) {
      alert(
        "OTP Verified"
      );

      setShowOtp(false);

      setShowPayment(true);
    } else {
      alert(
        "Invalid OTP"
      );
    }
  };

  const completePayment =
    async () => {

      if (
        paymentMethod ===
        "UPI"
      ) {
        if (
          !upiId.includes("@")
        ) {
          alert(
            "Invalid UPI"
          );
          return;
        }
      }

      if (
        paymentMethod ===
        "Card"
      ) {
        if (
          cardNumber.length <
            16 ||
          !cardName ||
          !expiry ||
          cvv.length < 3
        ) {
          alert(
            "Invalid Card"
          );
          return;
        }
      }

      try {
        await addDoc(
          collection(
            db,
            "orders"
          ),
          {
            customerName:
              name,

            mobile,

            alternateMobile,

            address,

            landmark,

            city,

            state:
              stateName,

            pincode,

            userEmail:
              user,

            products:
              cart,

            totalAmount:
              total,

            paymentMethod,

            paymentStatus:
              "Paid",

            paymentId:
              "PAY_" +
              Date.now(),

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
    };
    return (
<>
<Navbar />

<div className="container py-4">

  <div className="row">

    <div className="col-lg-8">

      <div className="card shadow border-0">

        <div className="card-body">

          <h3 className="mb-4">
            Delivery Address
          </h3>

          <div className="row">

            <div className="col-md-6 mb-3">
              <label>Name1</label>

              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e)=>
                  setName(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Mobile</label>

              <input
                type="text"
                className="form-control"
                value={mobile}
                onChange={(e)=>
                  setMobile(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Alternate Mobile
              </label>

              <input
                type="text"
                className="form-control"
                value={
                  alternateMobile
                }
                onChange={(e)=>
                  setAlternateMobile(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Landmark
              </label>

              <input
                type="text"
                className="form-control"
                value={landmark}
                onChange={(e)=>
                  setLandmark(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-12 mb-3">
              <label>
                Address
              </label>

              <textarea
                rows="3"
                className="form-control"
                value={address}
                onChange={(e)=>
                  setAddress(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>City</label>

              <input
                type="text"
                className="form-control"
                value={city}
                onChange={(e)=>
                  setCity(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>State</label>

              <input
                type="text"
                className="form-control"
                value={
                  stateName
                }
                onChange={(e)=>
                  setStateName(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>
                Pincode
              </label>

              <input
                type="text"
                className="form-control"
                value={pincode}
                onChange={(e)=>
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

    <div className="col-lg-4">

      <div className="card shadow border-0">

        <div className="card-body">

          <h4>
            Order Summary
          </h4>

          <hr />

          {cart.map(
            (item)=>(
              <div
                key={item.id}
                className="d-flex justify-content-between mb-2"
              >

                <span>
                  {
                    item.productName
                  }
                  ×
                  {
                    item.qty
                  }
                </span>

                <span>
                  ₹
                  {
                    Number(
                      item.discountPrice ||
                      item.price
                    ) *
                    Number(
                      item.qty
                    )
                  }
                </span>

              </div>
            )
          )}

          <hr />

          <h3 className="text-success">
            ₹{total}
          </h3>

          <button
            className="btn btn-success w-100"
            onClick={
              sendOtp
            }
          >
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
position:"fixed",
inset:0,
background:
"rgba(0,0,0,.6)",
zIndex:9999
}}
>

<div
className="
bg-white
p-4
rounded
shadow
"
style={{
width:"400px",
margin:
"120px auto"
}}
>

<h4>
OTP Verification
</h4>

<p
className="
text-danger
"
>
OTP :
123456
</p>

<p>
Expires in
{seconds}s
</p>

<input
className="
form-control
mb-3
"
value={otp}
onChange={(e)=>
setOtp(
e.target.value
)
}
/>

<button
className="
btn
btn-primary
w-100
"
onClick={
verifyOtp
}
>
Verify OTP
</button>

</div>

</div>

)}
{showPayment && (

<div
style={{
position:"fixed",
inset:0,
background:
"rgba(0,0,0,.65)",
zIndex:9999
}}
>

<div
className="
bg-white
rounded
shadow-lg
"
style={{
width:"650px",
margin:"50px auto",
overflow:"hidden"
}}
>

<div
className="
p-3
text-white
"
style={{
background:
"#3399cc"
}}
>

<h4 className="mb-0">
Secure Payment
</h4>

<small>
100% Secure Checkout
</small>

</div>

<div className="p-4">

<h5 className="mb-3">
Amount :
₹{total}
</h5>

<div className="mb-3">

<label>
Select Payment Method
</label>

<select
className="
form-select
"
value={
paymentMethod
}
onChange={(e)=>
setPaymentMethod(
e.target.value
)
}
>

<option value="UPI">
UPI
</option>

<option value="Card">
Card
</option>

<option value="Wallet">
Wallet
</option>

<option value="Net Banking">
Net Banking
</option>

<option value="COD">
Cash On Delivery
</option>

</select>

</div>

{paymentMethod ===
"UPI" && (

<div>

<label>
UPI ID
</label>

<input
type="text"
className="
form-control
"
placeholder="
nagababu@ybl
"
value={upiId}
onChange={(e)=>
setUpiId(
e.target.value
)
}
/>

<div
className="
alert
alert-info
mt-3
"
>
Demo UPI :
test@upi
</div>

</div>

)}

{paymentMethod ===
"Card" && (

<div>

<div className="mb-3">

<label>
Card Number
</label>

<input
type="text"
className="
form-control
"
placeholder="
4111111111111111
"
value={
cardNumber
}
onChange={(e)=>
setCardNumber(
e.target.value
)
}
/>

</div>

<div className="mb-3">

<label>
Card Holder Name
</label>

<input
type="text"
className="
form-control
"
placeholder="
Nagababu
"
value={cardName}
onChange={(e)=>
setCardName(
e.target.value
)
}
/>

</div>

<div className="row">

<div className="col-md-6">

<label>
Expiry
</label>

<input
type="text"
className="
form-control
"
placeholder="
12/30
"
value={expiry}
onChange={(e)=>
setExpiry(
e.target.value
)
}
/>

</div>

<div className="col-md-6">

<label>
CVV
</label>

<input
type="password"
className="
form-control
"
placeholder="
123
"
value={cvv}
onChange={(e)=>
setCvv(
e.target.value
)
}
/>

</div>

</div>

<div
className="
alert
alert-warning
mt-3
"
>

Demo Card :

<br />

4111 1111 1111 1111

<br />

CVV : 123

<br />

Expiry : 12/30

</div>

</div>

)}

{paymentMethod ===
"Wallet" && (

<div
className="
alert
alert-success
"
>

Wallet Balance :
₹50,000

</div>

)}

{paymentMethod ===
"Net Banking" && (

<select
className="
form-select
"
>

<option>
SBI
</option>

<option>
HDFC
</option>

<option>
ICICI
</option>

<option>
Axis Bank
</option>

</select>

)}

{paymentMethod ===
"COD" && (

<div
className="
alert
alert-secondary
"
>

Cash On Delivery
Available

</div>

)}

<div className="d-flex gap-2 mt-4">

<button
className="
btn
btn-secondary
w-50
"
onClick={()=>
setShowPayment(
false
)
}
>

Cancel

</button>

<button
className="
btn
btn-success
w-50
"
onClick={
completePayment
}
>

Pay ₹{total}

</button>

</div>

</div>

</div>
</div>
)}

</>
);
}
export default Orders;