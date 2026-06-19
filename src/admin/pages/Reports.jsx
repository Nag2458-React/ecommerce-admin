import React, { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import AdminSidebar from "../components/AdminSidebar";

import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const Reports = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(data);
  };

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0,
  );

  const inventoryValue = products.reduce(
    (sum, item) =>
      sum +
      Number(item.discountPrice || item.price || 0) * Number(item.stock || 0),
    0,
  );

  const lowStock = products.filter((item) => Number(item.stock) < 5);

  const outOfStock = products.filter((item) => Number(item.stock) === 0);

  const categoryCount = [...new Set(products.map((item) => item.category))]
    .length;

  const recentProducts = [...products]
    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
    .slice(0, 5);

  // CATEGORY DATA

  const categoryMap = {};

  products.forEach((item) => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
  });

  const categoryLabels = Object.keys(categoryMap);

  const categoryValues = Object.values(categoryMap);

  const categoryChart = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Products",
        data: categoryValues,

        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#dc3545",
          "#ffc107",
          "#6f42c1",
          "#fd7e14",
          "#20c997",
          "#6610f2",
        ],

        borderColor: [
          "#084298",
          "#146c43",
          "#b02a37",
          "#ffca2c",
          "#59359a",
          "#ca6510",
          "#1aa179",
          "#520dc2",
        ],

        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // STOCK CHART

  const stockChart = {
    labels: products.map((item) => item.productName),

    datasets: [
      {
        label: "Stock",

        data: products.map((item) => item.stock),

        backgroundColor: products.map((item) =>
          item.stock === 0 ? "#dc3545" : item.stock < 5 ? "#ffc107" : "#198754",
        ),

        borderColor: "#0d6efd",

        fill: false,

        tension: 0.4,
      },
    ],
  };

  // INVENTORY VALUE CHART

  const inventoryChart = {
    labels: products.map((item) => item.productName),

    datasets: [
      {
        label: "Inventory Value",

        data: products.map(
          (item) =>
            Number(item.discountPrice || item.price || 0) *
            Number(item.stock || 0),
        ),

        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#dc3545",
          "#ffc107",
          "#6f42c1",
          "#fd7e14",
          "#20c997",
          "#6610f2",
        ],

        borderColor: "#fff",

        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div className="d-flex">
      <AdminSidebar />

      <div
        className="flex-grow-1 p-4"
        style={{
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h2 className="mb-4">Reports</h2>

        {/* REPORT BOXES */}

        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h6>Total Products</h6>
                <h2>{totalProducts}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h6>Total Stock</h6>
                <h2>{totalStock}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h6>Inventory Value</h6>
                <h2>₹{inventoryValue}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h6>Categories</h6>
                <h2>{categoryCount}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5>Low Stock</h5>

                <h2 className="text-danger">{lowStock.length}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5>Out Of Stock</h5>

                <h2 className="text-danger">{outOfStock.length}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS */}

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5>Category Wise Products</h5>

                <Bar data={categoryChart} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5>Stock Analysis</h5>

                <Line data={stockChart} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body c-share">
                <h5>Category Share</h5>

                <Pie data={categoryChart} />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body c-share">
                <h5>Inventory Value</h5>

                <Doughnut data={inventoryChart} />
              </div>
            </div>
          </div>
        </div>

        {/* RECENT PRODUCTS */}

        <div className="card shadow">
          <div className="card-body">
            <h4 className="mb-3">Recent Products</h4>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Final Price</th>
                  <th>Stock</th>
                </tr>
              </thead>

              <tbody>
                {recentProducts.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>

                    <td>{item.category}</td>

                    <td>₹{item.price}</td>

                    <td>₹{item.discountPrice || item.price}</td>

                    <td>{item.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
