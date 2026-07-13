import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

// ===============================
// Add Review
// ===============================

export const addReview = async (
  productId,
  userId,
  userName,
  rating,
  comment
) => {
  await addDoc(collection(db, "reviews"), {
    productId,
    userId,
    userName,
    rating: Number(rating),
    comment,
    createdAt: Timestamp.now(),
  });

  await updateProductRating(productId);
};

// ===============================
// Get Reviews
// ===============================

export const getReviews = async (productId) => {
  const q = query(
    collection(db, "reviews"),
    where("productId", "==", productId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ===============================
// Update Product Average Rating
// ===============================

export const updateProductRating = async (productId) => {
  const reviews = await getReviews(productId);

  let average = 0;

  if (reviews.length > 0) {
    const total = reviews.reduce(
      (sum, item) => sum + Number(item.rating),
      0
    );

    average = total / reviews.length;
  }

  const productRef = doc(db, "products", productId);

  await updateDoc(productRef, {
    rating: Number(average.toFixed(1)),
    reviewCount: reviews.length,
  });
};