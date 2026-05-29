import React, { useState } from "react";

import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import { db, storage } from "../../firebase/firebase";

import AdminSidebar from "../components/AdminSidebar";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { toast } from "react-toastify";

const Products = () => {

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [weight, setWeight] = useState("");
  const [flavour, setFlavour] = useState("");

  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      console.log("Submitting product...");

      if (!image) {
        toast.error("Please upload image");
        setLoading(false);
        return;
      }

      // 1. Upload image
      const imageRef = ref(
        storage,
        `products/${Date.now()}_${image.name}`
      );

      await uploadBytes(imageRef, image);

      const downloadURL = await getDownloadURL(imageRef);

      console.log("Image uploaded:", downloadURL);

      // 2. Save to Firestore
      const docRef = await addDoc(
        collection(db, "products"),
        {
          productName,
          category,
          price: Number(price),
          discountPrice: Number(discountPrice || 0),
          stock: Number(stock),
          brand,
          description,
          ingredients,
          weight,
          flavour,
          imageUrl: downloadURL,
          featured,
          trending,
          createdAt: Timestamp.now(),
        }
      );

      console.log("Firestore ID:", docRef.id);

      toast.success("Product Added Successfully 🎉");

      // RESET FORM
      setProductName("");
      setCategory("");
      setPrice("");
      setDiscountPrice("");
      setStock("");
      setBrand("");
      setDescription("");
      setIngredients("");
      setWeight("");
      setFlavour("");
      setImage(null);
      setFeatured(false);
      setTrending(false);

    } catch (error) {
      console.log("ERROR:", error);
      toast.error("Firebase Error - Check Console");
    }

    setLoading(false);
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

                <div className="col-md-6 mb-3">
                  <label>Product Name</label>
                  <input className="form-control"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Category</label>
                  <select className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option>Crunchies</option>
                    <option>Bows</option>
                    <option>Treats</option>
                    <option>Accessories</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label>Price</label>
                  <input className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Discount</label>
                  <input className="form-control"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Stock</label>
                  <input className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Brand</label>
                  <input className="form-control"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Weight</label>
                  <input className="form-control"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Flavour</label>
                  <input className="form-control"
                    value={flavour}
                    onChange={(e) => setFlavour(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Ingredients</label>
                  <input className="form-control"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Image</label>
                  <input type="file"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Description</label>
                  <textarea className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  /> Featured
                </div>

                <div className="col-md-6">
                  <input type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                  /> Trending
                </div>

                <div className="col-md-12 mt-3">
                  <button className="btn btn-primary w-100" type="submit">
                    {loading ? "Adding..." : "Add Product"}
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