import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import {
  addReview,
  getReviews,
} from "../firebase/reviewService";
import StarRating from "../admin/pages/StarRating";
import { toast } from "react-toastify";

const ProductReviews = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadReviews = async () => {
    const data = await getReviews(product.id);
    setReviews(data);
  };

  useEffect(() => {
    if (product?.id) {
      loadReviews();
    }
  }, [product]);

  const submitReview = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter review");
      return;
    }

    await addReview(
      product.id,
      user.uid,
      user.displayName || "Customer",
      rating,
      comment
    );

    toast.success("Review Added");

    setComment("");
    setRating(5);

    loadReviews();
  };

  return (
    <div className="card shadow mt-4 border-0">
      <div className="card-body">

        <h4 className="mb-3">
          ⭐ Customer Reviews
        </h4>

        <div className="mb-3">
          <label className="fw-bold">
            Rating
          </label>

          <select
            className="form-select"
            value={rating}
            onChange={(e) =>
              setRating(e.target.value)
            }
          >
            <option value={5}>★★★★★ (5)</option>
            <option value={4}>★★★★☆ (4)</option>
            <option value={3}>★★★☆☆ (3)</option>
            <option value={2}>★★☆☆☆ (2)</option>
            <option value={1}>★☆☆☆☆ (1)</option>
          </select>
        </div>

        <textarea
          className="form-control"
          rows="3"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <button
          className="btn btn-primary mt-3"
          onClick={submitReview}
        >
          Submit Review
        </button>

        <hr />

        <h5>
          {reviews.length} Reviews
        </h5>

        {reviews.length === 0 && (
          <p className="text-muted">
            No Reviews Yet
          </p>
        )}

        {reviews.map((item) => (
          <div
            key={item.id}
            className="border rounded p-3 mb-3"
          >
            <div className="d-flex justify-content-between">

              <strong>
                {item.userName}
              </strong>

              <StarRating
                rating={item.rating}
                size={18}
              />

            </div>

            <p className="mt-2 mb-1">
              {item.comment}
            </p>

            <small className="text-muted">
              {item.createdAt?.seconds
                ? new Date(
                    item.createdAt.seconds *
                      1000
                  ).toLocaleDateString("en-IN")
                : ""}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;