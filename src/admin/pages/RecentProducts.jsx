import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdminSidebar from "../components/AdminSidebar";

const RecentProducts = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    const snapshot = await getDocs(
      collection(db, "products")
    );

    const data = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort(
        (a, b) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

    setProducts(data);

  };

  return (
    <div className="d-flex">
             <div style={{width:"20%"}}>
      <AdminSidebar />
</div>
      <div className="container-fluid p-4" style={{width:"80%"}}>

        <h2 className="fw-bold mb-4">
          🆕 Recent Products
        </h2>

        <div className="card shadow border-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0 table-bordered">

              <thead className="table-dark">

                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Added On</th>
                </tr>

              </thead>

              <tbody>

                {products.map((product, index) => (

                  <tr key={product.id}>

                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={product.imagePath}
                        alt=""
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />
                    </td>

                    <td>
                      <strong>{product.productName}</strong>
                    </td>

                    <td>{product.category}</td>

                    <td>₹{product.price}</td>

                    <td>
                      {product.discountPrice > 0
                        ? (
                          <span className="badge bg-success">
                            ₹{product.discountPrice}
                          </span>
                        )
                        : "-"}
                    </td>

                    <td>
                      {product.stock > 5
                        ? (
                          <span className="badge bg-success">
                            {product.stock}
                          </span>
                        )
                        : (
                          <span className="badge bg-danger">
                            {product.stock}
                          </span>
                        )}
                    </td>

                    <td>
                      {product.createdAt
                        ? new Date(
                            product.createdAt.seconds * 1000
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

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

export default RecentProducts;