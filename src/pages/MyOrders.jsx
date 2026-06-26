import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Navbar from "./Navbar";

const MyOrders = () => {
const [orders, setOrders] = useState([]);

const user = localStorage.getItem("currentUser");

useEffect(() => {
fetchOrders();
}, []);

const fetchOrders = async () => {
try {
const snapshot = await getDocs(collection(db, "orders"));


  const data = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((item) => item.userEmail === user);

  setOrders(data);
} catch (error) {
  console.log(error);
}


};

return (
<> <Navbar />


  <div className="container py-4">
    <h2 className="fw-bold mb-4">My Orders</h2>

    {/* Summary Cards */}
    <div className="row mb-4 total">
      <div className="col-md-4 mb-3">
        <div className="card border-0">
          <div className="card-body text-center">
            <h3 className="text-primary">{orders.length}</h3>
            <small>Total Orders</small>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card border-0">
          <div className="card-body text-center">
            <h3 className="text-success">
              {
                orders.filter(
                  (o) => o.orderStatus === "Delivered"
                ).length
              }
            </h3>
            <small>Delivered</small>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card border-0">
          <div className="card-body text-center">
            <h3 className="text-warning">
              {
                orders.filter(
                  (o) => o.orderStatus !== "Delivered"
                ).length
              }
            </h3>
            <small>Pending</small>
          </div>
        </div>
      </div>
    </div>
<div className="row">
    {orders.length === 0 ? (
     
      <div className="text-center py-5">
        <h4>No Orders Found</h4>
      </div>
    ) : (
      orders.map((order) => (
         <div className="col-md-4">
        <div
          key={order.id}
          className="card border-0  mb-4" style={{boxShadow:" rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}
        >
          {/* Header */}
          <div className="card-header bg-white">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div style={{textAlign:"left"}}>
                <h6 className="mb-0">
                  Order #{order.id.slice(0, 8)}
                </h6>

                <small className="text-muted">
                  {order.createdAt
                    ? new Date(
                        order.createdAt.seconds * 1000
                      ).toLocaleDateString("en-IN")
                    : "Recently"}
                </small>
              </div>

              <div className="text-end">
                <h6 className="mb-0 text-success">
                  ₹
                  {Number(
                    order.totalAmount || 0
                  ).toLocaleString()}
                </h6>

                <span
                  className={`badge ${
                    order.orderStatus === "Delivered"
                      ? "bg-success"
                      : order.orderStatus === "Cancelled"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="card-body">
  {order.products?.map((product, index) => {
    console.log("Product:", product);
    console.log("Color:", product.color);

    return (
      <div
        key={index}
        className="d-flex align-items-center "
      >
        <img
          src={product.imagePath}
          alt={product.productName}
          style={{
            width: "90px",
            height: "90px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <div className="ms-3 flex-grow-1" style={{textAlign:"left"}}>
          <h6 className="fw-bold mb-1">
            {product.productName}
          </h6>

          <small className="d-block text-muted">
            Qty: {product.qty}
          </small>

          <small className="d-block text-muted">
            Size: {product.selectedSize || "N/A"}
          </small>

          {product.selectedColor && (
  <div className="d-flex align-items-center mt-1">
    <small className="me-2">Color:</small>

    <span
      style={{
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: product.selectedColor?.code,
        border: "2px solid #999",
        display: "inline-block",
      }}
    />

    <small className="ms-2">
      {product.selectedColor?.name}
    </small>
  </div>
)}
        </div>

        <h5 className="text-success mb-0">
          ₹{Number(
            product.discountPrice ||
            product.price ||
            0
          ).toLocaleString()}
        </h5>
      </div>
    );
  })}
</div>

          {/* Address */}
          <div className="card-footer bg-light">
            <h6 className="fw-bold mb-1">
              {order.customerName}
            </h6>

            <div>📞 {order.mobile}</div>

            <div>📍 {order.address}</div>

            <div>
              {order.city}, {order.state} -{" "}
              {order.pincode}
            </div>

            <div className="mt-2">
              Payment:
              <strong className="ms-1">
                {order.paymentStatus}
              </strong>
            </div>
          </div>
        </div>
        </div>
      ))
      
    )}
    
    </div>
  </div>
</>


);
};

export default MyOrders;
