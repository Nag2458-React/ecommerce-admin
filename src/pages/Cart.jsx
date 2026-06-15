import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

const Cart = () => {

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCart(data);
  }, []);

  const saveCart = (updated) => {
    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );
  };

  const updateQty = (id, size, type) => {

    const updated = cart.map((item) => {

      if (
        item.id === id &&
        item.selectedSize === size
      ) {

        if (type === "plus") {
          return {
            ...item,
            qty: item.qty + 1,
          };
        }

        if (
          type === "minus" &&
          item.qty > 1
        ) {
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

  const removeItem = (
    id,
    size
  ) => {

    const updated = cart.filter(
      (item) =>
        !(
          item.id === id &&
          item.selectedSize === size
        )
    );

    saveCart(updated);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(
        item.discountPrice ||
        item.price ||
        0
      ) *
        Number(item.qty || 1),
    0
  );
const originalTotal = cart.reduce(
  (sum, item) =>
    sum +
    Number(item.price || 0) *
      Number(item.qty || 1),
  0
);

const totalSavings =
  originalTotal - total;

const totalItems = cart.reduce(
  (sum, item) =>
    sum + Number(item.qty || 1),
  0
);
  return (
    <div className="container mt-4 cart">

      <div className="d-flex justify-content-between mb-4">

        <h2 className="text-white">
          Shopping Cart
        </h2>

        <Link
          to="/"
          className="btn btn-primary"
        >
          Continue Shopping
        </Link>

      </div>

      {cart.length === 0 ? (
        <h4 className="text-white">
          No Products In Cart
        </h4>
      ) : (
        <div className="row">

          <div className="col-md-8">
        <div className="row">
         
            {cart.map((item) => (
 <div className="col-md-4">
              <div
                className="card mb-3"
                key={
                  item.id +
                  item.selectedSize
                }
              >

                <div className="row g-0">

                 

                    <img
                      src={item.imagePath}
                      alt={
                        item.productName
                      }
                      className="img-fluid pr"
                      style={{
                       
                        objectFit:
                          "cover",
                      }}
                    />

                 

                 

                 <div className="card-body">

  <h5 className="fw-bold">
    {item.productName}
  </h5>

  <span className="badge bg-primary">
    {item.category}
  </span>

 

  <p>
    <strong>Size :</strong>
    {" "}
    {item.selectedSize}
  </p>

  <p>
    <strong>Color :</strong>
    {" "}
    {item.color}
  </p>

  <p>
    <strong>Material :</strong>
    {" "}
    {item.material}
  </p>

  <p>
    <strong>Stock :</strong>
    {" "}
    {item.stock}
  </p>

  <div className="mb-2">

    {item.discountPrice > 0 ? (
      <>
        <span
          style={{
            textDecoration:
              "line-through",
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
          Save ₹
          {item.price -
            item.discountPrice}
        </small>

        <span
          className="
            badge
            bg-danger
            
          "
        >
          {Math.round(
            ((item.price -
              item.discountPrice) /
              item.price) *
              100
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
    "style={{paddingLeft: "30px"}}
  >

    <button
      className="btn btn-danger"
      onClick={() =>
        updateQty(
          item.id,
          item.selectedSize,
          "minus"
        )
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
      onClick={() =>
        updateQty(
          item.id,
          item.selectedSize,
          "plus"
        )
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
    Sub Total :
    ₹
    {(
      Number(
        item.discountPrice ||
          item.price
      ) *
      Number(item.qty)
    )}
  </div>

  <button
    className="
      btn
      btn-outline-danger
      w-100
    "
    onClick={() =>
      removeItem(
        item.id,
        item.selectedSize
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

    <h3>
      Order Summary
    </h3>

    <hr />

    <p>
      Total Items :
      <strong>
        {" "}
        {totalItems}
      </strong>
    </p>

    <p>
      Original Price :
      <strong>
        ₹{originalTotal}
      </strong>
    </p>

    <p
      className="
        text-success
        fw-bold
      "
    >
      Total Savings :
      ₹{totalSavings}
    </p>

    <hr />

    <h3
      className="
        text-primary
      "
    >
      Grand Total :
      ₹{total}
    </h3>

    <button
      className="
        btn
        btn-success
        w-100
        mt-3
      "
    >
      Proceed To Checkout
    </button>

  </div>

</div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;