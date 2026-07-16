import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Navbar from "./Navbar";
import {
  FaCheck,
  FaBoxOpen,
  FaCog,
  FaTruck,
  FaMapMarkerAlt,
  FaGift,
} from "react-icons/fa";
import generateInvoice from "../utils/generateInvoice";
// import DeliveryTruck from "../components/DeliveryTruck";
import DeliveryCountdown from "../components/DeliveryCountdown";


const statusSteps = [
  {
    label: "Pending",
    icon: <FaBoxOpen />,
  },
  {
    label: "Processing",
    icon: <FaCog />,
  },
  {
    label: "Shipped",
    icon: <FaTruck />,
  },
  {
    label: "Out for Delivery",
    icon: <FaMapMarkerAlt />,
  },
  {
    label: "Delivered",
    icon: <FaGift />,
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
  const [showHidden, setShowHidden] = useState(false);
  const [showTracking, setShowTracking] = useState({});

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
  const activeOrders = orders.filter(
  (order) => !order.hidden
);

const hiddenOrders = orders.filter(
  (order) => order.hidden
);

const hideOrder = async (id) => {
  try {
    await updateDoc(doc(db, "orders", id), {
      hidden: true,
    });

    setOrders((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, hidden: true }
          : item
      )
    );

    toast.success("Order Hidden");
  } catch (err) {
    console.log(err);
  }
};
const unHideOrder = async (id) => {
  try {
    await updateDoc(doc(db, "orders", id), {
      hidden: false,
    });

    setOrders((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, hidden: false }
          : item
      )
    );

    toast.success("Order Restored");
  } catch (err) {
    console.log(err);
  }
};
const deleteOrder = async (id) => {
  if (!window.confirm("Delete this order permanently?"))
    return;

  try {
    await deleteDoc(doc(db, "orders", id));

    setOrders((prev) =>
      prev.filter((item) => item.id !== id)
    );

    toast.success("Order Deleted");
  } catch (err) {
    console.log(err);
  }
};
  return (
    <>
      {" "}
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">My Orders</h2>

        {/* Summary Cards */}
        <div className="row mb-4">

  <div className="col-md-4">
    <div className="card text-center shadow-sm">
      <div className="card-body">
        <h6>Total Orders</h6>
        <h3>{orders.length}</h3>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card text-center shadow-sm">
      <div className="card-body">
        <h6>Active Orders</h6>
        <h3>{activeOrders.length}</h3>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card text-center shadow-sm">
      <div className="card-body">
        <h6>Hidden Orders</h6>

        <button
          className="btn btn-outline-primary btn-sm mt-2"
          onClick={() =>
            setShowHidden(!showHidden)
          }
        >
          {showHidden
            ? "Hide List"
            : `View (${hiddenOrders.length})`}
        </button>
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
            activeOrders.map((order) => (
              <div className="col-md-6">
                <div
                  key={order.id}
                  className="card border-0  mb-4"
                  style={{
                    boxShadow: " rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                >
                  {/* Header */}
                 <div className="card-header bg-white py-2">
  <div className="d-flex justify-content-between align-items-start">

    <div>
      <h6 className="fw-bold mb-1">
        Order #{order.id.slice(0, 8)}
      </h6>

      <small className="text-muted">
        {order.createdAt
          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(
              "en-IN"
            )
          : "Recently"}
      </small>
    </div>

    <div className="text-end">

      <h5 className="text-success mb-1">
        ₹{Number(order.totalAmount || 0).toLocaleString()}
      </h5>

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
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />

                          <div
                            className="ms-3 flex-grow-1"
                            style={{ textAlign: "left" }}
                          >
                            <h6 className="fw-bold mb-1" style={{ fontSize: "15px" }}>
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

                        <h6 className="text-success fw-bold mb-0">
                            ₹
                            {Number(
                              product.discountPrice || product.price || 0,
                            ).toLocaleString()}
                          </h6>
                        </div>
                      );
                    })}
                  </div>

                  {/* Address */}
                  <div className="card-footer bg-light">
         <div
  className="row g-3 align-items-center mb-3"
>

  <div className="col-lg-8">

    <h6 className="fw-bold mb-1">
      👤 {order.customerName}
    </h6>

    <div style={{ fontSize: "14px" }}>
      📞 {order.mobile}
    </div>

    <div style={{ fontSize: "14px" }}>
      📍 {order.address}
    </div>

    <div
      className="text-muted"
      style={{ fontSize: "13px" }}
    >
      {order.city}, {order.state} - {order.pincode}
    </div>

    <div className="mt-2">

      <span className="badge bg-success">
        {order.paymentStatus}
      </span>

    </div>

  </div>

 <div className="col-lg-4">
  <div className="mt-2">
        <button
          className="btn btn-outline-secondary btn-sm w-100 mb-2"
          onClick={() => hideOrder(order.id)}
        >
          👁 Hide
        </button>
      </div>
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

  {order.orderStatus !== "Cancelled" && (
    <button
      className="btn btn-outline-success btn-sm w-100 mt-2"
      onClick={() =>
        setShowTracking((prev) => ({
          ...prev,
          [order.id]: !prev[order.id],
        }))
      }
    >
      {showTracking[order.id]
        ? "▲ Hide Tracking"
        : "📍 Track My Order"}
    </button>
  )}

</div>

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

                  {order.orderStatus !== "Cancelled" &&
  showTracking[order.id] && (
  <div className="mt-4" style={{textAlign:"left"}}>

    {/* <h6 className="fw-bold mb-3">
      🚚 Order Timeline
    </h6>
<div className="progress mb-3" style={{ height: "10px" }}>
  <div
    className="progress-bar bg-success progress-bar-striped progress-bar-animated"
    style={{
      width: `${
        ((getStatusIndex(order.orderStatus) + 1) /
          statusSteps.length) *
        100
      }%`,
    }}
  />
</div> */}
{/* <DeliveryTruck status={order.orderStatus} /> */}
<div className="mt-3">

  {statusSteps.map((step, index) => {

    const statusIndex = getStatusIndex(order.orderStatus);

    const completed = index < statusIndex;
    const current = index === statusIndex;

    return (

      <div
        key={step.label}
        className="d-flex"
      >

        {/* LEFT */}

        <div
          className="d-flex flex-column align-items-center"
          style={{ width: "42px" }}
        >

          <div
            className={`timeline-dot
              ${completed ? "active-dot" : ""}
              ${current ? "current-dot" : ""}`}
          >

            {completed ? (

              <FaCheck size={12} />

            ) : (

              step.icon

            )}

          </div>

          {index !== statusSteps.length - 1 && (

            <div
              className={`timeline-bar ${
                index < statusIndex
                  ? "timeline-bar-active"
                  : ""
              }`}
            />

          )}

        </div>

        {/* RIGHT */}

        <div className="ms-3 pb-4">

          <h6
            className={`mb-1 ${
              completed || current
                ? "text-success fw-bold"
                : "text-muted"
            }`}
          >
            {step.label}
          </h6>

          {current && (

            <small className="text-muted">

              {step.label === "Pending" &&
                "📦 Your order has been placed successfully."}

              {step.label === "Processing" &&
                "👨‍💻 Seller is preparing your order."}

              {step.label === "Shipped" &&
                "🚚 Your parcel is on the way."}

              {step.label === "Out for Delivery" &&
                "📍 Delivery partner is near your location."}

              {step.label === "Delivered" &&
                "🎉 Order delivered successfully."}

            </small>

          )}

        </div>

      </div>

    );

  })}

</div>
<div
  className="card border-0 shadow-sm mt-3"
  style={{
    background: "#fafafa",
    borderRadius: "12px",
  }}
>
  <div className="card-body py-3">

    <div className="row align-items-center">

      {/* LEFT */}

      <div className="col-md-7">

        <h6 className="fw-bold mb-2 text-success">
          🚚 Delivery Status
        </h6>

        {order.orderStatus === "Pending" && (
          <>
            <h6 className="mb-1">
              📦 Order Placed
            </h6>

            <small className="text-muted">
              We've received your order.
            </small>
          </>
        )}

        {order.orderStatus === "Processing" && (
          <>
            <h6 className="mb-1">
              👨‍💻 Preparing Order
            </h6>

            <small className="text-muted">
              Packing your jewellery.
            </small>
          </>
        )}

        {order.orderStatus === "Shipped" && (
          <>
            <h6 className="mb-1">
              🚚 Order Shipped
            </h6>

            <small className="text-muted">
              Package is on the way.
            </small>
          </>
        )}

        {order.orderStatus === "Out for Delivery" && (
          <>
            <h6 className="mb-1">
              📍 Out for Delivery
            </h6>

            <small className="text-muted">
              Delivery partner is nearby.
            </small>
          </>
        )}

        {order.orderStatus === "Delivered" && (
          <>
            <h6 className="mb-1">
              🎉 Delivered
            </h6>

            <small className="text-muted">
              Thank you for shopping.
            </small>
          </>
        )}

      </div>

      {/* RIGHT */}

      <div className="col-md-5 text-center">

        <div
          style={{
            fontSize: "13px",
            color: "#777",
          }}
        >
          Estimated Delivery
        </div>

        <h6 className="fw-bold text-success mb-2">

          {order.deliveryDate
            ?.toDate()
            .toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}

        </h6>

        <DeliveryCountdown
          deliveryDate={order.deliveryDate}
          status={order.orderStatus}
        />

      </div>

    </div>

  </div>
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
                    {/* <div className="mt-2">
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
                    </div> */}

                    {/* <button
  className="btn btn-outline-secondary btn-sm"
  onClick={() => hideOrder(order.id)}
>
  Hide Order
</button> */}
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
        {showHidden && (
  <>
    <hr />

    <h5 className="mb-3">
      Hidden Orders
    </h5>

    {hiddenOrders.map((order) => (

      <div
        className="card mb-3"
        key={order.id}
      >

        {/* Existing Order UI */}

        <div className="mt-2">

          <button
            className="btn btn-success btn-sm"
            onClick={() =>
              unHideOrder(order.id)
            }
          >
            Restore
          </button>

          <button
            className="btn btn-danger btn-sm ms-2"
            onClick={() =>
              deleteOrder(order.id)
            }
          >
            Delete Permanently
          </button>

        </div>

      </div>

    ))}
  </>
)}
      </div>
    </>
  );
};

export default MyOrders;
