import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const sendOrderNotification = async (order, status) => {
  try {
    const firstProduct = order.products?.[0];

    const productName =
      firstProduct?.productName || "Product";

    const productImage =
      firstProduct?.imagePath || "";

    const moreItems =
      order.products?.length > 1
        ? ` +${order.products.length - 1} more item(s)`
        : "";

    await addDoc(collection(db, "notifications"), {
      userEmail: order.userEmail,

      orderId: order.id,

      productName,

      productImage,

      title: productName,

      message: `${productName}${moreItems} is now ${status}.`,

      status,

      isRead: false,

      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.log(err);
  }
};