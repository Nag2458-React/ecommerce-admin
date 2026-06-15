import React, {
  useState
} from "react";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import {
  auth,
  db
} from "../firebase/firebase";

import {
  useNavigate,
  Link
} from "react-router-dom";

const Signup = () => {

  const navigate =
    useNavigate();

  const [name,
    setName] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [phone,
    setPhone] =
    useState("");

  const [address,
    setAddress] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleSignup =
    async (e) => {

    e.preventDefault();

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user =
        userCredential.user;

      await setDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {

          name,

          email,

          phone,

          address,

          role: "user",

          createdAt:
          new Date()

        }
      );

      alert(
        "Signup Success"
      );

      navigate("/login");

    } catch (error) {

  switch (error.code) {

    case "auth/email-already-in-use":
      alert(
        "Email already exists. Try Login."
      );
      break;

    case "auth/weak-password":
      alert(
        "Password should be at least 6 characters."
      );
      break;

    case "auth/invalid-email":
      alert(
        "Invalid Email Address."
      );
      break;

    default:
      alert(error.message);
  }
}
  };
return (

  <div
    style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px"
    }}
  >

    <div
      className="card shadow p-4"
      style={{
        width: "450px",
        border: "none",
        borderRadius: "15px",
        background: "#fff",
        position: "relative",
        zIndex: 9999
      }}
    >

      <h2 className="text-center mb-4">
        Signup
      </h2>

      <form onSubmit={handleSignup}>

        <div className="mb-3">

          <label className="mb-2">
            Full Name
          </label>

          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e)=>
              setName(e.target.value)
            }
            required
          />

        </div>

        <div className="mb-3">

          <label className="mb-2">
            Email
          </label>

          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
            required
          />

        </div>

        <div className="mb-3">

          <label className="mb-2">
            Phone
          </label>

          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e)=>
              setPhone(e.target.value)
            }
            required
          />

        </div>

        <div className="mb-3">

          <label className="mb-2">
            Address
          </label>

          <textarea
            className="form-control"
            rows="3"
            value={address}
            onChange={(e)=>
              setAddress(e.target.value)
            }
            required
          />

        </div>

        <div className="mb-4">

          <label className="mb-2">
            Password
          </label>

          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e)=>
              setPassword(e.target.value)
            }
            required
          />

        </div>

        <button
          className="
            btn
            btn-success
            w-100
          "
        >
          Signup
        </button>

      </form>

      <div className="text-center mt-3">

        <Link to="/login">

          Already Have Account?

        </Link>

      </div>

    </div>

  </div>
);
};

export default Signup;