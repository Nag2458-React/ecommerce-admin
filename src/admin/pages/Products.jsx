import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";

const Products = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    productName: "",
    category: "",
    sizes: [],
    color: "",
    material: "",
    // quantity: "",
    price: "",
    discountPrice: "",
    stock: "",
    // occasion: "",
    description: "",
    imagePath: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    console.log(form);
    e.preventDefault();

    if (!form.productName.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!form.price) {
      toast.error("Please enter price");
      return;
    }

    if (!form.imagePath.trim()) {
      toast.error("Please enter image path");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        productName: form.productName,
        category: form.category,
        sizes: form.sizes,
        color: form.color,
        material: form.material,
        // quantity: form.quantity,
        price: Number(form.price || 0),
        discountPrice: Number(form.discountPrice || 0),
        stock: Number(form.stock || 0),
        // occasion: form.occasion,
        description: form.description,
        //   highlights: form.highlights,
        //   careInstructions: form.careInstructions,
        imagePath: form.imagePath,
        createdAt: Timestamp.now(),
      });

      toast.success("Data submitted successfully 🎉");

      setForm({
        productName: "",
        category: "",
        sizes: [],
        color: "",
        material: "",
        // quantity: "",
        price: "",
        discountPrice: "",
        stock: "",
        // occasion: "",
        description: "",
        imagePath: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    }

    setLoading(false);
  };
  const handleSizeChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setForm({
        ...form,
        sizes: [...form.sizes, value],
      });
    } else {
      setForm({
        ...form,
        sizes: form.sizes.filter((size) => size !== value),
      });
    }
  };
  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light">
        <div className="card shadow border-0">
          <div className="card-body">
            <h2 className="mb-4">Add Product</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    className="form-control mb-3"
                    value={form.productName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <select
                    name="category"
                    className="form-control mb-3"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option value="Round Bangles">Round Bangles</option>
                    <option value="Square Bangles">Square Bangles</option>
                    <option value="Flat Bangles">Flat Bangles</option>
                    <option value="Mix Bangles">Mix Bangles</option>
                    <option value="Kids Bangles">Kids Bangles</option>
                    <option value="Loose Bangles">Loose Bangles</option>
                    <option value="Metal Border Bangles">
                      Metal Border Bangles
                    </option>
                    <option value="Silk Thread Bangles">
                      Silk Thread Bangles
                    </option>
                    <option value="Gloves">Gloves</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="fw-bold">Available Sizes</label>

                    <div className="d-flex gap-3 mt-2">
                      {["2.2", "2.4", "2.6", "2.8", "2.10"].map((size) => (
                        <div className="form-check" key={size}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={size}
                            checked={form.sizes.includes(size)}
                            onChange={handleSizeChange}
                          />

                          <label className="form-check-label">{size}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    className="form-control mb-3"
                    value={form.color}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    name="material"
                    placeholder="Material"
                    className="form-control mb-3"
                    value={form.material}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="form-control mb-3"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    name="discountPrice"
                    placeholder="Discount Price"
                    className="form-control mb-3"
                    value={form.discountPrice}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    className="form-control mb-3"
                    value={form.stock}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    name="imagePath"
                    placeholder="/images/bangle1.jpg"
                    className="form-control mb-3"
                    value={form.imagePath}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <textarea
                    name="description"
                    placeholder="Product Description"
                    className="form-control mb-3"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Add Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
