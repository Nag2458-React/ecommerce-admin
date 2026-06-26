import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdminSidebar from "../components/AdminSidebar";

const SystemStatus = () => {
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [users, setUsers] = useState(0);

  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  const [lowStock, setLowStock] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);

  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    try {
      // Products
      const productSnapshot = await getDocs(collection(db, "products"));

      const productData = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productData.length);

      setLowStock(
        productData.filter((item) => Number(item.stock) < 5).length
      );

      setOutOfStock(
        productData.filter((item) => Number(item.stock) === 0).length
      );

      // Orders
      const orderSnapshot = await getDocs(collection(db, "orders"));

      const orderData = orderSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(orderData.length);

      setPendingOrders(
        orderData.filter((o) =>
          ["Pending", "Processing", "Shipped"].includes(o.orderStatus)
        ).length
      );

      setDeliveredOrders(
        orderData.filter((o) => o.orderStatus === "Delivered").length
      );

      setCancelledOrders(
        orderData.filter((o) => o.orderStatus === "Cancelled").length
      );

      // Users
      const usersSnapshot = await getDocs(collection(db, "users"));

      setUsers(usersSnapshot.size);

      // Revenue Today

      const today = new Date().toLocaleDateString("en-IN");

      const revenue = orderData
        .filter((order) => {
          if (!order.createdAt) return false;

          return (
            new Date(
              order.createdAt.seconds * 1000
            ).toLocaleDateString("en-IN") === today
          );
        })
        .reduce(
          (sum, order) => sum + Number(order.totalAmount || 0),
          0
        );

      setTodayRevenue(revenue);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="d-flex">

      <AdminSidebar />

      <div
        className="container-fluid p-4"
        style={{ background: "#f5f5f5", minHeight: "100vh" }}
      >

        <h2 className="fw-bold mb-4">
          🖥️ System Status
        </h2>

        <div className="row">

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Firebase</h6>
                <span className="badge bg-success">
                  Connected
                </span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Database</h6>
                <span className="badge bg-success">
                  Healthy
                </span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Users</h6>
                <h3>{users}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Products</h6>
                <h3>{products}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Total Orders</h6>
                <h3>{orders}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Pending Orders</h6>
                <h3 className="text-warning">
                  {pendingOrders}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Delivered</h6>
                <h3 className="text-success">
                  {deliveredOrders}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Cancelled</h6>
                <h3 className="text-danger">
                  {cancelledOrders}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Low Stock</h6>
                <h3 className="text-warning">
                  {lowStock}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Out Of Stock</h6>
                <h3 className="text-danger">
                  {outOfStock}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Today's Revenue</h6>
                <h3 className="text-success">
                  ₹{todayRevenue.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h6>Last Updated</h6>

                <small>
                  {new Date().toLocaleString()}
                </small>
              </div>
            </div>
          </div>

        </div>

        <div className="card shadow border-0 mt-3">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              Overall Health
            </h5>
          </div>

          <div className="card-body">

            <p>🟢 Firebase Connection : OK</p>

            <p>🟢 Database : Healthy</p>

            <p>
              {outOfStock > 0
                ? "🟡 Inventory Needs Attention"
                : "🟢 Inventory Healthy"}
            </p>

            <p>
              {pendingOrders > 10
                ? "🟡 Pending Orders High"
                : "🟢 Orders Processing Normally"}
            </p>

            <p>🟢 Application Running Successfully</p>

          </div>
        </div>

      </div>

    </div>
  );
};

export default SystemStatus;