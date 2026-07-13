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

// ================= ADD =================
export const addWishlistItem = async (
  uid,
  product,
  selectedSize,
  selectedColor
) => {
  const q = query(
    collection(db, "wishlist"),
    where("uid", "==", uid),
    where("productId", "==", product.id),
    where("selectedSize", "==", selectedSize),
    where("selectedColor.name", "==", selectedColor.name)
  );

  const snap = await getDocs(q);

  if (!snap.empty) return;

  await addDoc(collection(db, "wishlist"), {
    uid,

    productId: product.id,
    productName: product.productName,
    category: product.category,

    imagePath:
      selectedColor?.image || product.imagePath,

    price: Number(product.price),

    discountPrice: Number(
      product.discountPrice || product.price
    ),

    selectedSize,

    selectedColor: {
      name: selectedColor.name,
      code: selectedColor.code,
      image: selectedColor.image,
    },

    createdAt: Timestamp.now(),
  });
};

// ================= GET =================
export const getWishlist = async (uid) => {
  const q = query(
    collection(db, "wishlist"),
    where("uid", "==", uid)
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

// ================= REMOVE =================
// ================= REMOVE =================

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