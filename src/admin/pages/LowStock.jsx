import React, { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import AdminSidebar from "../components/AdminSidebar";

const LowStock = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((item) => Number(item.stock) < 5);

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
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
        <h2 className="mb-4">Low Stock Products</h2>

        {/* SUMMARY CARD */}

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body">
                <h6>Total Low Stock Products</h6>

                <h2 className="text-danger">{products.length}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="card shadow">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Image</th>

                    <th>Product Name</th>

                    <th>Category</th>

                    <th>Price</th>

                    <th>Stock</th>

                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No Low Stock Products
                      </td>
                    </tr>
                  ) : (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.imagePath}
                            alt=""
                            width="60"
                            height="60"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </td>

                        <td>{item.productName}</td>

                        <td>{item.category}</td>

                        <td>₹{item.discountPrice || item.price}</td>

                        <td>
                          <span className="badge bg-danger">{item.stock}</span>
                        </td>

                        <td>
                          {item.stock === 0 ? (
                            <span className="badge bg-dark">Out Of Stock</span>
                          ) : (
                            <span className="badge bg-warning text-dark">
                              Low Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStock;
