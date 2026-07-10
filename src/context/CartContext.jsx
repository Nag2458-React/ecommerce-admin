import React, { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../firebase/firebase";

import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartQty,
} from "../firebase/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    const user = auth.currentUser;

    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getCart(user.uid);
      setCart(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadCart();
    });

    return unsubscribe;
  }, []);

  const addToCart = async (
    product,
    selectedSize = "",
    selectedColor = null,
  ) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please Login First");
      return;
    }

    await addCartItem(user.uid, product, selectedSize, selectedColor);

    await loadCart();
  };

  const removeFromCart = async (productId, selectedSize, selectedColor) => {
    const user = auth.currentUser;

    if (!user) return;

    await removeCartItem(user.uid, productId, selectedSize, selectedColor);

    await loadCart();
  };

  const changeQty = async (cartId, qty) => {
    await updateCartQty(cartId, qty);
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        changeQty,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
