import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";

// Get Cart
export const getCart = async (uid) => {
  const q = query(
    collection(db, "cart"),
    where("uid", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Add To Cart
export const addCartItem = async (
  uid,
  product,
  selectedSize,
  selectedColor
) => {

  const q = query(
  collection(db, "cart"),
  where("uid", "==", uid),
  where("productId", "==", product.id),
  where("selectedSize", "==", selectedSize || ""),
  where(
    "selectedColor.name",
    "==",
    selectedColor?.name || ""
  )
);

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const cartDoc = snapshot.docs[0];

    await updateDoc(doc(db, "cart", cartDoc.id), {
      qty: (cartDoc.data().qty || 1) + 1,
    });

    return;
  }

  await addDoc(collection(db, "cart"), {
    uid,
    productId: product.id,

    productName: product.productName,
    category: product.category,
    imagePath: selectedColor?.image || product.imagePath,
    price: product.price,
    discountPrice: product.discountPrice,

    qty: 1,
    selectedSize: selectedSize || "",
    selectedColor: selectedColor || null,

    createdAt: Timestamp.now(),
  });
};

// Remove Item
export const removeCartItem = async (
  uid,
  productId
) => {
  const q = query(
    collection(db, "cart"),
    where("uid", "==", uid),
    where("productId", "==", productId)
  );

  const snapshot = await getDocs(q);

  for (const item of snapshot.docs) {
    await deleteDoc(doc(db, "cart", item.id));
  }
};

// Update Qty
export const updateCartQty = async (
  cartId,
  qty
) => {
  await updateDoc(doc(db, "cart", cartId), {
    qty,
  });
};