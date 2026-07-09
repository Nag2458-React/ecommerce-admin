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


  // ================= LOAD =================

  const loadWishlist = async () => {

    const user = auth.currentUser;

    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }


    try {

      const data = await getWishlist(user.uid);


      // REMOVE DUPLICATES
      const uniqueData = data.filter(
        (item,index,self)=>
          index === self.findIndex(
            (x)=>
              x.productId === item.productId &&
              x.selectedSize === item.selectedSize &&
              x.selectedColor?.name === item.selectedColor?.name
          )
      );


      setWishlist(uniqueData);


    } catch(err){

      console.log(err);

    }
    finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    const unsubscribe =
      auth.onAuthStateChanged(()=>{

        loadWishlist();

      });


    return unsubscribe;

  },[]);




  // ================= ADD =================


  const addToWishlist = async (
    product,
    selectedSize,
    selectedColor
  )=>{


    const user = auth.currentUser;


    if(!user){

      alert("Please Login First");
      return;

    }



    // CHECK DUPLICATE HERE

    const exists = wishlist.some(
      (item)=>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor?.name === selectedColor?.name
    );



    if(exists){

      alert("Already in wishlist");
      return;

    }



    await addWishlistItem(
      user.uid,
      product,
      selectedSize,
      selectedColor
    );


    await loadWishlist();


  };





  // ================= REMOVE =================


  const removeFromWishlist = async (
    productId,
    selectedSize,
    selectedColor
  )=>{


    const user = auth.currentUser;


    if(!user) return;



    await removeWishlistItem(
      user.uid,
      productId,
      selectedSize,
      selectedColor
    );


    await loadWishlist();

  };





  // ================= CHECK =================


  const isWishlisted = (
    productId,
    selectedSize,
    selectedColor
  )=>{


    return wishlist.some(

      (item)=>

      item.productId === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor?.name === selectedColor

    );


  };





  return (

    <WishlistContext.Provider

      value={{

        wishlist,
        loading,

        loadWishlist,

        addToWishlist,

        removeFromWishlist,

        isWishlisted

      }}

    >

      {children}

    </WishlistContext.Provider>

  );

};



export const useWishlist = () =>
  useContext(WishlistContext);