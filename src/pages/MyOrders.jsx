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
    const snapshot = await getDocs(collection(db, "orders"));

    const data = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((item) => item.userEmail === user);

    setOrders(data);
  };
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-white">My Orders</h2>

        {orders.length === 0 ? (
          <h4>No Orders Found</h4>
        ) : (
          <div className="row">
            {orders.map((order) => (
              <div className="col-md-4" key={order.id}>
                <div className="card shadow mb-4 ">
                  <div className="card-body">
                    <h5>Ordered Products</h5>

                    <div className="">
                      {order.products?.map((product, index) => (
                        <div className="" key={index}>
                          <div className="card mb-3 border-0">
                            <img
                              src={product.imagePath}
                              alt={product.productName}
                              style={{
                                height: "220px",
                                objectFit: "cover",
                              }}
                            />

                            <div className="card-body">
                              <span className="badge bg-success">
                                {order.paymentStatus}
                              </span>
                              <h6>{product.productName}</h6>

                              <p>
                                <strong>Category :</strong> {product.category}
                              </p>

                              <p>
                                <strong>Size :</strong> {product.selectedSize}
                              </p>

                              <p>
                                <strong>Color :</strong> {product.color}
                              </p>

                              <p>
                                <strong>Qty :</strong> {product.qty}
                              </p>

                              <p>
                                <strong>Price :</strong>₹
                                {product.discountPrice || product.price}
                              </p>

                              <p className="text-success fw-bold">
                                Subtotal : ₹
                                {Number(
                                  product.discountPrice || product.price,
                                ) * Number(product.qty)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <h5>Order Amount : ₹{order.totalAmount}</h5>

                    <p className="mt-2">
                      <strong>Customer :</strong> {order.customerName}
                    </p>

                    <p>
                      <strong>Status :</strong> {order.orderStatus}
                    </p>

                    <p>
                      <strong>Mobile :</strong> {order.mobile}
                    </p>

                    <p>
                      <strong>Address :</strong> {order.address}, {order.city},{" "}
                      {order.state}
                      {" - "}
                      {order.pincode}
                    </p>

                    <hr />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
