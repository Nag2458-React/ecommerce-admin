import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Navbar from "./Navbar";
import {
  FaCheck,
  FaBoxOpen,
  FaShippingFast,
  FaHome,
} from "react-icons/fa";
import generateInvoice from "../utils/generateInvoice";

const statusSteps = [
  {
    label: "Pending",
    icon: <FaBoxOpen />,
  },
  {
    label: "Processing",
    icon: <FaCheck />,
  },
  {
    label: "Shipped",
    icon: <FaShippingFast />,
  },
  {
    label: "Delivered",
    icon: <FaHome />,
  },
];

const getStatusIndex = (status) =>
  statusSteps.findIndex((s) => s.label === status);
const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  const user = localStorage.getItem("currentUser");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [cancelReason, setCancelReason] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
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
  const cancelOrder = async () => {
    if (!cancelReason) {
      alert("Please select cancellation reason");
      return;
    }

    try {
      await updateDoc(doc(db, "orders", selectedOrder), {
        orderStatus: "Cancelled",
        cancelReason: cancelReason,
        cancelledAt: Timestamp.now(),
      });

      alert("Order Cancelled Successfully");

      setShowCancelModal(false);
      setCancelReason("");
      setSelectedOrder(null);

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {" "}
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">My Orders</h2>

        {/* Summary Cards */}
        <div className="row mb-4 total">
          <div className="col-md-3 mb-3">
            <div className="card border-0">
              <div className="card-body text-center">
                <h3 className="text-primary">{orders.length}</h3>
                <small>Total Orders</small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0">
              <div className="card-body text-center">
                <h3 className="text-success">
                  {orders.filter((o) => o.orderStatus === "Delivered").length}
                </h3>
                <small>Delivered</small>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0">
              <div className="card-body text-center">
                <h3 className="text-warning">
                  {orders.filter((o) => o.orderStatus !== "Delivered").length}
                </h3>
                <small>Pending</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0">
              <div className="card-body text-center">
                <h3 className="text-danger">
                  {orders.filter((o) => o.orderStatus === "Cancelled").length}
                </h3>

                <small>Cancelled Orders</small>
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
                  className="card border-0  mb-4"
                  style={{
                    boxShadow: " rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                >
                  {/* Header */}
                  <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div style={{ textAlign: "left" }}>
                        <h6 className="mb-0">Order #{order.id.slice(0, 8)}</h6>

                        <small className="text-muted">
                          {order.createdAt
                            ? new Date(
                                order.createdAt.seconds * 1000,
                              ).toLocaleDateString("en-IN")
                            : "Recently"}
                        </small>
                      </div>

                      <div className="text-end">
                        <h6 className="mb-0 text-success">
                          ₹{Number(order.totalAmount || 0).toLocaleString()}
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
                        <div key={index} className="d-flex align-items-center ">
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

                          <div
                            className="ms-3 flex-grow-1"
                            style={{ textAlign: "left" }}
                          >
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
                                    backgroundColor:
                                      product.selectedColor?.code,
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
                            ₹
                            {Number(
                              product.discountPrice || product.price || 0,
                            ).toLocaleString()}
                          </h5>
                        </div>
                      );
                    })}
                  </div>

                  {/* Address */}
                  <div className="card-footer bg-light">
                    <h6 className="fw-bold mb-1">{order.customerName}</h6>

                    <div>📞 {order.mobile}</div>

                    <div>📍 {order.address}</div>

                    <div>
                      {order.city}, {order.state} - {order.pincode}
                    </div>

                    <div className="mt-2">
                      Payment:
                      <strong className="ms-1">{order.paymentStatus}</strong>
                    </div>
                    <div className="mt-3 d-flex gap-2">
                      {order.orderStatus !== "Cancelled" &&
                        order.orderStatus !== "Delivered" && (
                          <button
                            className="btn btn-danger btn-sm w-100"
                            onClick={() => {
                              setSelectedOrder(order.id);
                              setShowCancelModal(true);
                            }}
                          >
                            ❌ Cancel Order
                          </button>
                        )}
                    </div>
                    {order.orderStatus === "Cancelled" && (
                      <div className="mt-2">
                        <div className="alert alert-danger mb-2">
                          ❌ This order has been cancelled.
                        </div>

                        <div className="card border-0 bg-light">
                          <div className="card-body py-2">
                            <h6 className="fw-bold mb-2">💰 Refund Status</h6>

                            <span
                              className={`badge ${
                                order.refundStatus === "Completed"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {order.refundStatus || "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                   {order.orderStatus !== "Cancelled" && (
  <div className="mt-4">

    <h6 className="fw-bold mb-3">
      🚚 Order Timeline
    </h6>

    <div className="timeline">

      {statusSteps.map((step, index) => {
        const active = index <= getStatusIndex(order.orderStatus);
        const current = index === getStatusIndex(order.orderStatus);

        return (
          <div
            className="timeline-item"
            key={step.label}
          >

            <div
              className={`timeline-circle ${
                active ? "active" : ""
              } ${current ? "current" : ""}`}
            >
              {active ? (
                <FaCheck />
              ) : (
                step.icon
              )}
            </div>

            {index !== statusSteps.length - 1 && (
              <div
                className={`timeline-line ${
                  index < getStatusIndex(order.orderStatus)
                    ? "active"
                    : ""
                }`}
              />
            )}

            <small
              className={`timeline-label ${
                active ? "text-success" : "text-muted"
              }`}
            >
              {step.label}
            </small>

          </div>
        );
      })}
    </div>

  </div>
)}

   {order.orderStatus === "Delivered" && (
  <div className="mt-3">

    <button
      className="btn btn-outline-dark w-100 fw-bold"
      onClick={() => generateInvoice(order)}
    >
      📄 Download Tax Invoice
    </button>

  </div>
)}
                    <div className="mt-2">
                      🚚 Delivery:
                      <strong className="ms-2 text-success">
                        {order.deliveryDate
                          ? order.deliveryDate
                              .toDate()
                              .toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                          : "Updating..."}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {showCancelModal && (
          <div
            className="modal fade show d-block"
            style={{
              background: "rgba(0,0,0,.55)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="fw-bold">Cancel Order</h4>
                </div>

                <div className="modal-body">
                  <label className="fw-bold mb-2">Select Reason</label>

                  <select
                    className="form-select"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  >
                    <option value="">Select Reason</option>

                    <option>Ordered by mistake</option>

                    <option>Found cheaper elsewhere</option>

                    <option>Delivery is too late</option>

                    <option>Wrong address selected</option>

                    <option>Need different size</option>

                    <option>Need different color</option>

                    <option>Payment issue</option>

                    <option>Other</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelReason("");
                    }}
                  >
                    Close
                  </button>

                  <button className="btn btn-danger" onClick={cancelOrder}>
                    Confirm Cancel
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

export default MyOrders;
