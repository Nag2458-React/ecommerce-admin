import React, { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  FaBoxOpen,
  FaWarehouse,
  FaExclamationTriangle,
  FaRupeeSign,
   FaTags,
  FaChartLine,
  FaTimesCircle,
  FaPercentage,
} from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin");

  const [totalProducts, setTotalProducts] = useState(0);

  const [totalStock, setTotalStock] = useState(0);

  const [lowStock, setLowStock] = useState(0);

  const [outOfStock, setOutOfStock] = useState(0);

  const [inventoryValue, setInventoryValue] = useState(0);

  const [categoriesCount, setCategoriesCount] = useState(0);

  const [avgPrice, setAvgPrice] = useState(0);

  const [discountProducts, setDiscountProducts] = useState(0);

  const [highestProduct, setHighestProduct] = useState(null);

  const [lowestProduct, setLowestProduct] = useState(null);

  const [latestProduct, setLatestProduct] = useState(null);

  const [recentProducts, setRecentProducts] = useState([]);
const [totalOrders, setTotalOrders] = useState(0);

const [pendingOrders, setPendingOrders] = useState(0);

const [deliveredOrders, setDeliveredOrders] = useState(0);

const [cancelledOrders, setCancelledOrders] = useState(0);
const [totalUsers, setTotalUsers] = useState(0);

const [todayRevenue, setTodayRevenue] = useState(0);

const [recentOrders, setRecentOrders] = useState([]);
const [topSellingProducts, setTopSellingProducts] = useState([]);
const [topCustomers, setTopCustomers] = useState([]);


  useEffect(() => {
    fetchDashboardData();
  }, []);

 const fetchDashboardData = async () => {
  try {
    // ================= PRODUCTS =================

    const snapshot = await getDocs(collection(db, "products"));

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Products :", products.length);

    setTotalProducts(products.length);

    setTotalStock(
      products.reduce((sum, item) => sum + Number(item.stock || 0), 0)
    );

   

    setInventoryValue(
      products.reduce(
        (sum, item) =>
          sum +
          Number(item.discountPrice || item.price || 0) *
            Number(item.stock || 0),
        0
      )
    );

    const categories = [
      ...new Set(products.map((item) => item.category)),
    ];

    setCategoriesCount(categories.length);

    const totalPrice = products.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    setAvgPrice(
      products.length
        ? Math.round(totalPrice / products.length)
        : 0
    );

    setDiscountProducts(
      products.filter(
        (item) => Number(item.discountPrice) > 0
      ).length
    );

    const highest = [...products].sort(
      (a, b) => Number(b.price) - Number(a.price)
    )[0];

    setHighestProduct(highest);

    const lowest = [...products].sort(
      (a, b) => Number(a.price) - Number(b.price)
    )[0];

    setLowestProduct(lowest);

    const latest = [...products].sort(
      (a, b) =>
        (b.createdAt?.seconds || 0) -
        (a.createdAt?.seconds || 0)
    )[0];

    setLatestProduct(latest);

    setRecentProducts(
      [...products]
        .sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        )
        .slice(0, 5)
    );

    // ================= ORDERS =================

    const orderSnapshot = await getDocs(
      collection(db, "orders")
    );

    console.log("Orders Docs :", orderSnapshot.size);

    const orders = orderSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Orders Array :", orders);

    setTotalOrders(orders.length);

    setPendingOrders(
      orders.filter((o) =>
        ["Pending", "Processing", "Shipped"].includes(
          o.orderStatus
        )
      ).length
    );

    setDeliveredOrders(
      orders.filter(
        (o) => o.orderStatus === "Delivered"
      ).length
    );

    setCancelledOrders(
      orders.filter(
        (o) => o.orderStatus === "Cancelled"
      ).length
    );

    // ================= USERS =================

    const usersSnapshot = await getDocs(
      collection(db, "users")
    );

    console.log("Users Docs :", usersSnapshot.size);

    usersSnapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });

    setTotalUsers(usersSnapshot.size);

    // ================= TODAY REVENUE =================

    const today = new Date().toLocaleDateString("en-IN");

    const revenue = orders
      .filter((order) => {
        if (!order.createdAt) return false;

        const orderDate = new Date(
          order.createdAt.seconds * 1000
        ).toLocaleDateString("en-IN");

        return orderDate === today;
      })
      .reduce(
        (sum, order) =>
          sum + Number(order.totalAmount || 0),
        0
      );

    setTodayRevenue(revenue);

    // ================= RECENT ORDERS =================

   

// ================= TOP CUSTOMERS =================

const customerMap = {};

orders.forEach((order) => {
  const email = order.userEmail || "Unknown";

  if (!customerMap[email]) {
    customerMap[email] = {
      customerName: order.customerName,
      email: order.userEmail,
      mobile: order.mobile,
      totalOrders: 0,
      totalSpent: 0,
    };
  }

  customerMap[email].totalOrders += 1;

  customerMap[email].totalSpent += Number(
    order.totalAmount || 0
  );
});

const topCustomersData = Object.values(customerMap)
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 5);

setTopCustomers(topCustomersData);
    console.log("Dashboard Loaded Successfully");
  } catch (error) {
    console.error("Dashboard Error :", error);
  }
};

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="d-flex">
      <div style={{width:"20%"}}>
      <AdminSidebar />
</div>
      <div
        className="flex-grow-1 p-4 dashboard"
        style={{
          background: "#f5f5f5",
          minHeight: "100vh",
          width:"80%"
        }}
      >
        <h1 className="mb-4">Admin Dashboard</h1>
       <div className="row g-4 mb-4">

  <div className="col-md-3">
    <div
      className="card  shadow-sm h-100"
      style={{
        borderLeft: "5px solid #0d6efd",
      }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <small className="text-black fw-bold">
            Total Products
          </small>

          <h2 className="fw-bold mt-2 text-primary">
            {totalProducts}
          </h2>
        </div>

        <FaBoxOpen
          size={35}
          color="#0d6efd"
        />
      </div>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className="card shadow-sm h-100"
      style={{
        borderLeft: "5px solid #198754",
      }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <small className="text-black fw-bold">
            Total Stock
          </small>

          <h2 className="fw-bold mt-2 text-success">
            {totalStock}
          </h2>
        </div>

        <FaWarehouse
          size={35}
          color="#198754"
        />
      </div>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className="card  shadow-sm h-100"
      style={{
        borderLeft: "5px solid #ffc107",
      }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <small className="text-black fw-bold">
            Low Stock
          </small>

          <h2 className="fw-bold mt-2 text-warning">
            {lowStock}
          </h2>
        </div>

        <FaExclamationTriangle
          size={35}
          color="#ffc107"
        />
      </div>
    </div>
  </div>

  <div className="col-md-3">
    <div
      className="card  shadow-sm h-100"
      style={{
        borderLeft: "5px solid #dc3545",
      }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <small className="text-black fw-bold">
            Inventory Value
          </small>

          <h2 className="fw-bold mt-2 text-danger">
            ₹{inventoryValue.toLocaleString()}
          </h2>
        </div>

        <FaRupeeSign
          size={35}
          color="#dc3545"
        />
      </div>
    </div>
  </div>

</div>
<div className="row g-4 mb-4">

<div className="col-md-6">

<div className="card shadow-sm border-0">

<div className="card-body">

<h6 className="text-black fw-bold">Total Users</h6>

<h2 className="text-primary">
{totalUsers}
</h2>

</div>

</div>

</div>

<div className="col-md-6">

<div className="card shadow-sm border-0">

<div className="card-body">

<h6 className="text-black fw-bold">Today's Revenue</h6>

<h2 className="text-success">
₹{todayRevenue.toLocaleString()}
</h2>

</div>

</div>

</div>

</div>
        <div className="row g-4 mb-4">

  {/* Out Of Stock */}

  <div className="col-md-3">
    <div
      className="card  shadow-sm h-100"
      style={{ borderLeft: "5px solid #dc3545" }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <small className="text-black fw-bold">
            Out Of Stock
          </small>

          <h2 className="fw-bold text-danger mt-2">
            {outOfStock}
          </h2>
        </div>

        <FaTimesCircle
          size={35}
          color="#dc3545"
        />

      </div>
    </div>
  </div>

  {/* Categories */}

  <div className="col-md-3">
    <div
      className="card  shadow-sm h-100"
      style={{ borderLeft: "5px solid #fd7e14" }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <small className="text-black fw-bold">
            Categories
          </small>

          <h2 className="fw-bold mt-2">
            {categoriesCount}
          </h2>
        </div>

        <FaTags
          size={35}
          color="#fd7e14"
        />

      </div>
    </div>
  </div>

  {/* Average Price */}

  <div className="col-md-3">
    <div
      className="card  shadow-sm h-100"
      style={{ borderLeft: "5px solid #20c997" }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <small className="text-black fw-bold">
            Average Price
          </small>

          <h2 className="fw-bold text-success mt-2">
            ₹{avgPrice}
          </h2>
        </div>

        <FaChartLine
          size={35}
          color="#20c997"
        />

      </div>
    </div>
  </div>

  {/* Discount Products */}

  <div className="col-md-3">
    <div
      className="card  shadow-sm h-100"
      style={{ borderLeft: "5px solid #6f42c1" }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <small className="text-black fw-bold">
            Discount Products
          </small>

          <h2 className="fw-bold text-primary mt-2">
            {discountProducts}
          </h2>
        </div>

        <FaPercentage
          size={35}
          color="#6f42c1"
        />

      </div>
    </div>
  </div>

</div>

        <div className="row g-4 mb-4">

  {/* Highest Price Product */}

  <div className="col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-header bg-success text-white fw-bold">
        💎 Highest Price Product
      </div>

      <div className="card-body text-center">
      <div className="d-flex justify-content-evenly">
        <img
          src={highestProduct?.imagePath}
          alt=""
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
<div style={{textAlign:"left"}}>
        <h5 className="mt-3">
          {highestProduct?.productName}
        </h5>

        <p className="text-muted">
          {highestProduct?.category}
        </p>

        <h3 className="text-success">
          ₹{highestProduct?.price}
        </h3>
</div>
</div>
      </div>

    </div>

  </div>

  {/* Lowest Price Product */}

  <div className="col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-header bg-primary text-white fw-bold">
        💰 Lowest Price Product
      </div>

      <div className="card-body text-center">
 <div className="d-flex justify-content-evenly">
        <img
          src={lowestProduct?.imagePath}
          alt=""
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
  <div style={{textAlign:"left"}}>
        <h5 className="mt-3">
          {lowestProduct?.productName}
        </h5>

        <p className="text-muted">
          {lowestProduct?.category}
        </p>

        <h3 className="text-primary">
          ₹{lowestProduct?.price}
        </h3>
</div>
</div>
      </div>

    </div>

  </div>

  {/* Latest Product */}

  <div className="col-lg-4">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-header bg-warning fw-bold">
        🆕 Latest Product
      </div>

      <div className="card-body text-center">
<div className="d-flex justify-content-evenly">
        <img
          src={latestProduct?.imagePath}
          alt=""
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
<div style={{textAlign:"left"}}>
        <h5 className="mt-3">
          {latestProduct?.productName}
        </h5>

        <p className="text-muted">
          {latestProduct?.category}
        </p>

        <h3 className="text-dark">
          ₹
          {latestProduct?.discountPrice ||
            latestProduct?.price}
        </h3>
        </div>
</div>
      </div>

    </div>

  </div>

</div>



      </div>
    </div>
  );
};

export default Dashboard;
