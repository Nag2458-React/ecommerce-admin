import React, { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase/firebase";

import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("user");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // FIREBASE LOGIN

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // ======================
      // ADMIN LOGIN
      // ======================

      if (role === "admin") {
        if (user.email === "admin@gmail.com") {
          // SAVE ADMIN

          localStorage.setItem("admin", "true");

          localStorage.setItem("adminData", JSON.stringify(user));

          // REMOVE USER

          localStorage.removeItem("user");

          alert("Admin Login Success");

          // GO DASHBOARD

          navigate("/dashboard");
        } else {
          alert("This is not Admin Account");
        }
      }

      // ======================
      // USER LOGIN
      // ======================
      else {
        // SAVE USER

        localStorage.setItem("user", JSON.stringify(user));

        // REMOVE ADMIN

        localStorage.removeItem("admin");

        localStorage.removeItem("adminData");

        alert("User Login Success");

        // GO HOME

        navigate("/");
      }
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  return (
    <div
      className="
        d-flex
        justify-content-center
        align-items-center
      "
      style={{
        minHeight: "100vh",
        textAlign:'left',
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        className="
          card
          shadow
          border-0
          p-4
        "
        style={{
          width: "400px",
          borderRadius: "15px",
        }}
      >
        <h2
          className="
            text-center
            mb-4
          "
        >
          Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* LOGIN TYPE */}

          <div className="mb-3">
            <label className="mb-2">Login Type</label>

            <select
              className="
                form-control
              "
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>

              <option value="admin">Admin</option>
            </select>
          </div>

          {/* EMAIL */}

          <div className="mb-3">
            <label className="mb-2">Email</label>

            <input
              type="email"
              className="
                form-control
              "
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="mb-4">
            <label className="mb-2">Password</label>

            <input
              type="password"
              className="
                form-control
              "
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="
              btn
              btn-primary
              w-100
            "
          >
            Login
          </button>
        </form>

        {/* SIGNUP */}

        <div
          className="
            text-center
            mt-3
          "
        >
          <Link to="/signup">Create New Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
