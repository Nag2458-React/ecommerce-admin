import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdminSidebar from "../components/AdminSidebar";
import { sendOrderNotification } from "../../services/notificationService";


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(data);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
  orderStatus: status,
});

const order = orders.find((o) => o.id === orderId);

if (order) {
  await sendOrderNotification(order, status);
}

fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  // Refund Complete Function

  const updateRefundStatus = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        refundStatus: "Completed",
        refundCompletedAt: Timestamp.now(),
      });

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex">
      <div style={{ width: "20%", height: "100vh" }}>
        <AdminSidebar />
      </div>

      <div className="container py-4" style={{ width: "80%" }}>
        <h2 className="mb-4 fw-bold">📦 Placed Orders</h2>

        <div className="row">
          {orders.length === 0 ? (
            <h4>No Orders Found</h4>
          ) : (
            orders.map((order) => (
              <div className="col-md-4" key={order.id}>
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Order #{order.id.slice(0, 8)}</strong>

                        <div className="small text-muted">
                          {order.customerName}
                        </div>
                      </div>

                      <select
                        className="form-select w-auto"
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                      >
                        <option>Pending</option>

<option>Processing</option>

<option>Shipped</option>

<option>Out for Delivery</option>

<option>Delivered</option>

<option>Cancelled</option>
                      </select>
                    </div>

                    <p className="mt-2 mb-0">
                      <strong>Delivery :</strong>

                      {order.deliveryDate
                        ?.toDate()
                        .toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                    </p>
                  </div>

                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <strong>Customer</strong>

                        <div>{order.customerName}</div>
                      </div>

                      <div className="col-md-4">
                        <strong>Mobile</strong>

                        <div>{order.mobile}</div>
                      </div>

                      <div className="col-md-4">
                        <strong>Total</strong>

                        <div>
                          ₹{Number(order.totalAmount || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong>Address</strong>

                      <div>
                        {order.address},{order.city},{order.state} -
                        {order.pincode}
                      </div>
                    </div>

                    <hr />

                    {order.products?.map((product, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center border-bottom py-3"
                      >
                        <img
                          src={product.imagePath}
                          alt=""
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />

                        <div className="ms-3 flex-grow-1">
                          <h6>{product.productName}</h6>

                          <small>Qty : {product.qty}</small>

                          <br />

                          <small>Size : {product.selectedSize}</small>

                          {product.selectedColor && (
                            <>
                              <br />

                              <small>
                                Color : {product.selectedColor?.name}
                              </small>
                            </>
                          )}
                        </div>

                        <h6 className="text-success">
                          ₹{product.discountPrice || product.price}
                        </h6>
                      </div>
                    ))}

                    {/* Refund Section */}

                    {order.orderStatus === "Cancelled" && (
                      <div className="mt-3">
                        <div className="alert alert-danger">
                          ❌ Order Cancelled
                          <br />
                          <strong>Reason :</strong>{" "}
                          {order.cancelReason || "N/A"}
                        </div>

                        <div className="card bg-light border-0">
                          <div className="card-body">
                            <h6 className="fw-bold">💰 Refund Status</h6>

                            <span
                              className={`badge ${
                                order.refundStatus === "Completed"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {order.refundStatus || "Pending"}
                            </span>

                            {(!order.refundStatus ||
                              order.refundStatus === "Pending") && (
                              <button
                                className="btn btn-success btn-sm ms-3"
                                onClick={() => updateRefundStatus(order.id)}
                              >
                                Mark Refund Completed
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
