import React, { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editProduct, setEditProduct] = useState({
    productName: "",
    category: "",
    sizes: [],
    color: "",
    material: "",
    price: "",
    discountPrice: "",
    stock: "",
    rating: "",
    description: "",
    imagePath: "",
  });
  const openEditModal = (item) => {
    setEditProduct({
      ...item,
    });

    setShowModal(true);
  };
  const handleChange = (e) => {
    setEditProduct({
      ...editProduct,
      [e.target.name]: e.target.value,
    });
  };
  const updateProduct = async () => {
  try {
    await updateDoc(
      doc(db, "products", editProduct.id),
      {
        productName: editProduct.productName,
        category: editProduct.category,

        sizes: editProduct.sizes || [],

        colors: editProduct.colors || [],

        material: editProduct.material,

        price: Number(editProduct.price),

        discountPrice: Number(
          editProduct.discountPrice
        ),

        stock: Number(editProduct.stock),

        rating: Number(
          editProduct.rating
        ),

        description:
          editProduct.description,

        imagePath:
          editProduct.imagePath,
      }
    );

    alert(
      "Product Updated Successfully"
    );

    setShowModal(false);

    fetchProducts();
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete Product?");

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));

      fetchProducts();

      alert("Product Deleted");
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
        <h2 className="mb-4">All Products</h2>

        <div className="card shadow">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle table-striped">
                <thead>
                  <tr>
                    <th>Image</th>

                    <th>Name</th>

                    <th>Category</th>

                    <th>Sizes</th>

                    <th>Color</th>

                    <th>Material</th>

                    <th>Price</th>

                    <th>Discount</th>
                    
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Description</th>

                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((item) => (
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

                      <td>{item.sizes?.join(", ")}</td>

                      <td>
  <div className="d-flex gap-1">
    {item.colors?.map(
      (clr, index) => (
        <div
          key={index}
          title={clr.name}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background:
              clr.code,
            border:
              "1px solid #ccc",
          }}
        />
      )
    )}
  </div>
</td>

                      <td>{item.material}</td>

                      <td>₹{item.price}</td>

                      <td>
                        {item.discountPrice > 0 ? (
                          <>
                            ₹{item.discountPrice}
                            <br />
                            <span className="badge bg-success">
                              {Math.round(
                                ((item.price - item.discountPrice) /
                                  item.price) *
                                  100,
                              )}
                              % OFF
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            item.stock < 5 ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {item.stock}
                        </span>
                      </td>
                      
                          <td>
  <span
    className="badge bg-warning text-dark"
    style={{
      fontSize: "14px",
    }}
  >
    ⭐ {item.rating || 4.5}
  </span>
</td>
                      <td
                        style={{
                          maxWidth: "200px",
                        }}
                      >
                        {item.description}
                      </td>

                      <td className="action-buttons">
                        <div className="d-flex">
                          <FaEdit onClick={() => openEditModal(item)} />
                          {/* <button
  className="btn btn-primary btn-sm me-2"
  onClick={() =>
    openEditModal(item)
  }
>
  Edit
</button> */}
                          <FaTrash onClick={() => deleteProduct(item.id)} />
                          {/* <button
className="btn btn-danger btn-sm"
onClick={() =>
deleteProduct(
item.id
)
}
>
Delete
</button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showModal && (
                <div
                  className="modal d-block"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5>Edit Product</h5>

                        <button
                          className="btn-close"
                          onClick={() => setShowModal(false)}
                        />
                      </div>

                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6">
                            <input
                              type="text"
                              name="productName"
                              className="form-control mb-2"
                              placeholder="Product Name"
                              value={editProduct.productName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              name="sizes"
                              className="form-control mb-2"
                              value={editProduct.sizes?.join(",")}
                              onChange={(e) =>
                                setEditProduct({
                                  ...editProduct,
                                  sizes: e.target.value.split(","),
                                })
                              }
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              name="category"
                              className="form-control mb-2"
                              placeholder="Category"
                              value={editProduct.category}
                              onChange={handleChange}
                            />
                          </div>
                          {/* <div className="col-md-6">
                            <input
                              type="text"
                              name="color"
                              className="form-control mb-2"
                              placeholder="Color"
                              value={editProduct.color}
                              onChange={handleChange}
                            />
                          </div> */}
                          <div className="col-md-6">
                            <input
                              type="text"
                              name="material"
                              className="form-control mb-2"
                              placeholder="Material"
                              value={editProduct.material}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              name="price"
                              className="form-control mb-2"
                              placeholder="Price"
                              value={editProduct.price}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              name="discountPrice"
                              className="form-control mb-2"
                              placeholder="Discount Price"
                              value={editProduct.discountPrice}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              name="stock"
                              className="form-control mb-2"
                              placeholder="Stock"
                              value={editProduct.stock}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
  <input
    type="number"
    step="0.1"
    min="1"
    max="5"
    name="rating"
    className="form-control mb-2"
    placeholder="Rating"
    value={
      editProduct.rating || ""
    }
    onChange={handleChange}
  />
</div>
                          <div className="col-md-12">
                            <input
                              type="text"
                              name="imagePath"
                              className="form-control mb-2"
                              placeholder="Image Path"
                              value={editProduct.imagePath}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-12">
  <label className="fw-bold mb-1">
    Colors JSON
  </label>

  <textarea
    className="form-control mb-2"
    rows="5"
    value={JSON.stringify(
      editProduct.colors || [],
      null,
      2
    )}
    onChange={(e) => {
      try {
        setEditProduct({
          ...editProduct,
          colors: JSON.parse(
            e.target.value
          ),
        });
      } catch {
        // invalid json ignore
      }
    }}
  />
</div>
                          <div className="col-md-12">
                            <textarea
                              name="description"
                              className="form-control"
                              rows="4"
                              placeholder="Description"
                              value={editProduct.description}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          className="btn btn-secondary"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>

                        <button
                          className="btn btn-success"
                          onClick={updateProduct}
                        >
                          Update Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
