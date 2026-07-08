import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase/firebase";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../firebase/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Wishlist
const loadWishlist = async () => {
  const user = auth.currentUser;

  console.log("Current User:", user);

  if (!user) {
    setWishlist([]);
    setLoading(false);
    return;
  }

  try {
    const data = await getWishlist(user.uid);

    console.log("Wishlist Data:", data);

    setWishlist(data);
  } catch (error) {
    console.error("Wishlist Load Error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadWishlist();
    });

    return unsubscribe;
  }, []);

  // Add Item
  const addToWishlist = async (
    product,
    selectedSize = "",
    selectedColor = ""
  ) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const alreadyExists = wishlist.some(
      (item) => item.productId === product.id
    );

    if (alreadyExists) return;

    await addWishlistItem(
      user.uid,
      product.id,
      selectedSize,
      selectedColor
    );

    await loadWishlist();
  };

  // Remove Item
  const removeFromWishlist = async (productId) => {
    const user = auth.currentUser;

    if (!user) return;

    await removeWishlistItem(user.uid, productId);

    await loadWishlist();
  };

  // Check Exists
  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => item.productId === productId
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);