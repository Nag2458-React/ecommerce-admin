import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";

// Add Wishlist
export const addWishlistItem = async (
  uid,
  productId,
  selectedSize,
  selectedColor
) => {

  const q = query(
    collection(db, "wishlist"),
    where("uid", "==", uid),
    where("productId", "==", productId)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return; // Already exists
  }

  await addDoc(collection(db, "wishlist"), {
    uid,
    productId,
    selectedSize,
    selectedColor,
    createdAt: Timestamp.now(),
  });

};

// Get Wishlist
export const getWishlist = async (uid) => {
  const q = query(
    collection(db, "wishlist"),
    where("uid", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Remove Wishlist
export const removeWishlistItem = async (
  uid,
  productId
) => {
  const q = query(
    collection(db, "wishlist"),
    where("uid", "==", uid),
    where("productId", "==", productId)
  );

  const snapshot = await getDocs(q);

  for (const item of snapshot.docs) {
    await deleteDoc(doc(db, "wishlist", item.id));
  }
};