import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import StarRating from "./StarRating";

const Products = () => {
  const [loading, setLoading] = useState(false);
const [colorImageKey, setColorImageKey] = useState(0);
const [form, setForm] = useState({
  productName: "",
  category: "",
  sizes: [],
  colors: [],

  colorName: "",
  colorCode: "#ff0000",
  colorImage: "",

  material: "",
  price: "",
  discountPrice: "",
  stock: "",

  description: "",
  imagePath: "",

  rating: "4.5",
  reviewCount: "125",

  highlights: "",
  offers: "",

  returnDays: "7",
});
const addColor = () => {

  if (!form.colorName || !form.colorImage) {
    alert("Please Select Color & Image");
    return;
  }

  setForm((prev) => ({

    ...prev,

    colors: [
      ...prev.colors,
      {
        name: prev.colorName,
        code: prev.colorCode,
        image: prev.colorImage,
      },
    ],

    colorName: "",

    colorCode: "#ff0000",

    colorImage: "",

  }));
setColorImageKey((prev) => prev + 1);
};
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
  colors: form.colors,

  material: form.material,

  price: Number(form.price),
  discountPrice: Number(form.discountPrice),

  stock: Number(form.stock),

  description: form.description,
  imagePath: form.imagePath,

  rating: Number(form.rating),
  reviewCount: Number(form.reviewCount),

  highlights: form.highlights
    .split(",")
    .map((item) => item.trim()),

  offers: form.offers
    .split(",")
    .map((item) => item.trim()),

  returnDays: Number(form.returnDays),

  createdAt: Timestamp.now(),
});

      toast.success("Data submitted successfully 🎉");

      setForm({
  productName: "",
  category: "",
  sizes: [],
  colors: [],

  colorName: "",
  colorCode: "#ff0000",
  colorImage: "",

  material: "",
  price: "",
  discountPrice: "",
  stock: "",

  description: "",
  imagePath: "",

  rating: "4.5",
  reviewCount: "125",

  highlights: "",
  offers: "",

  returnDays: "7",
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
const handleImageUpload = (e) => {

const file = e.target.files[0];

if (!file) return;

const reader = new FileReader();

reader.onloadend = () => {

setForm((prev) => ({

...prev,

imagePath: reader.result,

}));

};

reader.readAsDataURL(file);

};
 const handleColorImage = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {

    setForm((prev) => ({
      ...prev,
      colorImage: reader.result,
    }));

  };

  reader.readAsDataURL(file);

};
  return (
    <div className="d-flex">
      <div style={{width:"20%"}}>
      <AdminSidebar />
</div>
      <div className="flex-grow-1 p-4 bg-light" style={{
          background: "#f5f5f5",
          minHeight: "100vh",
          width:"80%"
        }}>
        <div className="card shadow border-0">
          <div className="card-body">
            <h2 className="mb-4">Add Product</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                  <label className="fw-bold mb-2">
Product Name
</label>
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
                  <label className="fw-bold mb-2">
Product Category
</label>
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

                {/* <div className="col-md-4">
                  <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    className="form-control mb-3"
                    value={form.color}
                    onChange={handleChange}
                  />
                </div> */}

                <div className="col-md-4">
                  <label className="fw-bold mb-2">
Product Material
</label>
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
                  <label className="fw-bold mb-2">
Product Price
</label>
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
                  <label className="fw-bold mb-2">
Product Discount
</label>
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
                  <label className="fw-bold mb-2">
Product Stock
</label>
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

<label className="fw-bold mb-2">
Product Image
</label>

<input
type="file"
accept="image/*"
className="form-control"
onChange={handleImageUpload}
/>

</div>
{/* <div className="col-md-4">

{form.imagePath && (

<img
src={form.imagePath}
alt=""
style={{
width:"120px",
height:"120px",
objectFit:"cover",
borderRadius:"10px",
border:"1px solid #ddd"
}}
/>

)}

</div> */}
           <div className="col-md-4 mb-3">
  <label className="fw-bold d-block mb-2">
    Product Rating
  </label>

  <input
    type="number"
    name="rating"
    min="0"
    max="5"
    step="0.1"
    className="form-control mb-2"
    value={form.rating}
    onChange={handleChange}
  />

  <div className="d-flex align-items-center gap-2">
    <StarRating
      rating={form.rating}
    />

    <span className="badge bg-secondary">
      {form.rating}
    </span>
  </div>
</div>
<div className="col-md-4">
  <label className="fw-bold mb-2">
Product Review Count
</label>
  <input
    type="number"
    name="reviewCount"
    placeholder="Review Count"
    className="form-control mb-3"
    value={form.reviewCount}
    onChange={handleChange}
  />
</div>
<div className="col-md-6">
  <textarea
    name="offers"
    rows="4"
    className="form-control mb-3"
    placeholder="10% Instant Discount, Free Delivery"
    value={form.offers}
    onChange={handleChange}
  />
</div>
<div className="col-md-4">
  <label className="fw-bold mb-2">
Product Return Days
</label>
  <input
    type="number"
    name="returnDays"
    placeholder="Return Days"
    className="form-control mb-3"
    value={form.returnDays}
    onChange={handleChange}
  />
</div>
<div className="col-md-4">
  <label className="fw-bold mb-2">
Product Color Image
</label>
<div className="d-flex">
  <input
    type="text"
    placeholder="Color Name (Red)"
    className="form-control mb-2"
    value={form.colorName}
    onChange={(e) =>
      setForm({
        ...form,
        colorName: e.target.value,
      })
    }
  />
    <input
    type="color"
    className="form-control form-control-color mb-2"
    value={form.colorCode}
    onChange={(e) =>
      setForm({
        ...form,
        colorCode: e.target.value,
      })
    }
  />
  </div>
</div>



<div className="col-md-4">
  <label className="fw-bold mb-2">
Product Color Image
</label>
<input
type="file"
key={colorImageKey}
accept="image/*"
className="form-control"
onChange={handleColorImage}
/>
</div>
<div className="col-md-4">
  {form.colorImage && (

<img
  src={form.colorImage}
  alt=""
  style={{
    width:80,
    height:80,
    objectFit:"cover",
    borderRadius:8,
    marginTop:10
  }}
/>

)}
</div>
<div className="col-md-4">
  <button
    type="button"
    className="btn btn-success"
    onClick={addColor}
  >
    Add Color
  </button>
</div>
<div className="col-md-12 mb-3">

  {form.colors.map((clr, index) => (

    <span
      key={index}
      className="badge me-2"
      style={{
        backgroundColor: clr.code,
        padding: "10px",
      }}
    >
      {clr.name}
    </span>

  ))}

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
