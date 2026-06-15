import React, { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import AdminSidebar from "../components/AdminSidebar";

const Dashboard = () => {
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTotalProducts(products.length);

      setTotalStock(
        products.reduce((sum, item) => sum + Number(item.stock || 0), 0),
      );

      setLowStock(products.filter((item) => Number(item.stock) < 5).length);

      setOutOfStock(products.filter((item) => Number(item.stock) === 0).length);

      setInventoryValue(
        products.reduce(
          (sum, item) =>
            sum +
            Number(item.discountPrice || item.price || 0) *
              Number(item.stock || 0),
          0,
        ),
      );

      const categories = [...new Set(products.map((item) => item.category))];

      setCategoriesCount(categories.length);

      const totalPrice = products.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0,
      );

      setAvgPrice(
        products.length ? Math.round(totalPrice / products.length) : 0,
      );

      setDiscountProducts(
        products.filter((item) => Number(item.discountPrice) > 0).length,
      );

      const highest = [...products].sort(
        (a, b) => Number(b.price) - Number(a.price),
      )[0];

      setHighestProduct(highest);

      const lowest = [...products].sort(
        (a, b) => Number(a.price) - Number(b.price),
      )[0];

      setLowestProduct(lowest);

      const latest = [...products].sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      )[0];

      setLatestProduct(latest);

      const recent = [...products]
        .sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
        )
        .slice(0, 5);

      setRecentProducts(recent);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div
        className="flex-grow-1 p-4 dashboard"
        style={{
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h1 className="mb-4">Admin Dashboard</h1>
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 style={{ color: "green" }}>Total Products</h6>
                <h2>{totalProducts}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 style={{ color: "blue" }}>Total Stock</h6>
                <h2>{totalStock}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 style={{ color: "red" }}>Low Stock</h6>
                <h2 className="text-danger">{lowStock}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6>Inventory Value</h6>
                <h2 className="text-success">₹{inventoryValue}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h6 style={{ color: "gray" }}>Out Of Stock</h6>
                <h2>{outOfStock}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h6 style={{ color: "#ff5500" }}>Categories</h6>
                <h2>{categoriesCount}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h6 style={{ color: "#879104" }}>Average Price</h6>
                <h2>₹{avgPrice}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h6>Discount Products</h6>
                <h2>{discountProducts}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5>Highest Price Product</h5>

                <h4>{highestProduct?.productName}</h4>

                <h3 className="text-success">₹{highestProduct?.price}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5>Lowest Price Product</h5>

                <h4>{lowestProduct?.productName}</h4>

                <h3 className="text-primary">₹{lowestProduct?.price}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5>Latest Product</h5>

                <h4>{latestProduct?.productName}</h4>

                <p>{latestProduct?.category}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow">
          <div className="card-body">
            <h4 className="mb-3">Recent Products</h4>

            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Original Price</th>
                  <th>Final Price</th>
                  <th>You Save</th>
                  <th>Stock</th>
                </tr>
              </thead>

              <tbody>
                {recentProducts.map((product) => {
                  const finalPrice =
                    product.discountPrice > 0
                      ? product.discountPrice
                      : product.price;

                  const savedAmount =
                    product.discountPrice > 0
                      ? product.price - product.discountPrice
                      : 0;

                  return (
                    <tr key={product.id}>
                      <td>{product.productName}</td>

                      <td>{product.category}</td>

                      <td>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "gray",
                          }}
                        >
                          ₹{product.price}
                        </span>
                      </td>

                      <td>
                        <span className="fw-bold text-success">
                          ₹{finalPrice}
                        </span>
                      </td>

                      <td>
                        {savedAmount > 0 ? (
                          <span className="badge bg-success">
                            ₹{savedAmount}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>{product.stock}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
