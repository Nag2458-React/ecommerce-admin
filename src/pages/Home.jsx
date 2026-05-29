import React, { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import {
  FaHeart,
  FaShoppingCart,
  FaHome,
  FaThLarge,
  FaBoxOpen,
  FaPhone,
  FaUser,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(collection(db, "products"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // WISHLIST
  const addWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const gotoLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminData");

    alert("Logout Success");
    navigate("/login");
  };

  return (
    <div className="d-flex">
      {/* ================= SIDEBAR ================= */}
      <div
        className="bg-dark text-white p-3"
        style={{
          width: "240px",
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <h3 className="text-center mb-4">PET SHOP</h3>

        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <Link to="/" className="nav-link text-white">
              <FaHome /> <span className="ms-2">Home</span>
            </Link>
          </li>

          <li className="nav-item mb-3">
            <a href="#" className="nav-link text-white">
              <FaThLarge /> <span className="ms-2">Categories</span>
            </a>
          </li>

          <li className="nav-item mb-3">
            <a href="#" className="nav-link text-white">
              <FaBoxOpen /> <span className="ms-2">Products</span>
            </a>
          </li>

          <li className="nav-item mb-3">
            <a href="#" className="nav-link text-white">
              <FaHeart /> <span className="ms-2">Wishlist</span>
            </a>
          </li>

          <li className="nav-item mb-3">
            <a href="#" className="nav-link text-white">
              <FaShoppingCart /> <span className="ms-2">Cart</span>
            </a>
          </li>

          <li className="nav-item mb-3">
            <a href="#" className="nav-link text-white">
              <FaPhone /> <span className="ms-2">Contact</span>
            </a>
          </li>

          {/* LOGIN / LOGOUT */}
          <li className="nav-item mt-4">
            {localStorage.getItem("user") || localStorage.getItem("admin") ? (
              <button className="btn btn-danger w-100" onClick={handleLogout}>
                <FaUser /> <span className="ms-2">Logout</span>
              </button>
            ) : (
              <button className="btn btn-primary w-100" onClick={gotoLogin}>
                <FaUser /> <span className="ms-2">Login</span>
              </button>
            )}
          </li>
        </ul>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div
        className="container-fluid"
        style={{
          marginLeft: "240px",
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div className="p-4">
          <h2 className="mb-4">Latest Products</h2>

          {/* LOADING */}
          {loading && <h5>Loading products...</h5>}

          {/* EMPTY STATE */}
          {!loading && products.length === 0 && <h5>No products found</h5>}

          <div className="row">
            {products.map((item) => (
              <div className="col-md-3 mb-4" key={item.id}>
                <div className="card border-0 shadow-sm h-100">
                  {/* IMAGE SAFE CHECK */}
                  <div style={{ height: "250px", background: "#eee" }}>
                    <img
                      src={
                        item.imageUrl
                          ? item.imageUrl
                          : "https://via.placeholder.com/300"
                      }
                      alt={item.productName || "product"}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  {/* BODY SAFE CHECK */}
                  <div className="card-body">
                    <h5>{item.productName || "No Name"}</h5>

                    <p className="text-muted mb-1">
                      {item.category || "No Category"}
                    </p>

                    <p className="text-success fw-bold">₹{item.price || 0}</p>

                    {item.discountPrice ? (
                      <p className="text-danger">
                        Offer: ₹{item.discountPrice}
                      </p>
                    ) : null}

                    <p>
                      <strong>Brand:</strong> {item.brand || "N/A"}
                    </p>

                    <p>
                      <strong>Weight:</strong> {item.weight || "N/A"}
                    </p>

                    <p>
                      <strong>Flavour:</strong> {item.flavour || "N/A"}
                    </p>

                    <p style={{ fontSize: "14px" }}>
                      {item.description || "No description"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
