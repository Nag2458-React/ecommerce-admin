import { initializeApp }
from "firebase/app";

import { getAuth }
from "firebase/auth";

import { getFirestore }
from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {

  apiKey:
  "AIzaSyDZYtP7sxbNyDgXC2IeG-C3w-Od-4sqvSE",

  authDomain:
  "ecommerce-website-2f066.firebaseapp.com",

  projectId:
  "ecommerce-website-2f066",
storageBucket: "ecommerce-website-2f066.appspot.com",
  // storageBucket:
  // "ecommerce-website-2f066.firebasestorage.app",

  messagingSenderId:
  "56975962572",

  appId:
  "1:56975962572:web:b0bd8b27a518e3d84cad69"

};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);
  export const storage = getStorage(app);