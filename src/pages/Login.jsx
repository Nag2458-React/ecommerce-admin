import React, {
  useState,
  useEffect,
} from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

import {
  useNavigate,
  Link,
} from "react-router-dom";
const Login = () => {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("user");

  useEffect(() => {

    const isUser =
      localStorage.getItem(
        "user"
      );

    const isAdmin =
      localStorage.getItem(
        "admin"
      );

    if (
      isAdmin === "true"
    ) {

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

      return;
    }

    if (isUser) {

      navigate(
        "/",
        {
          replace: true,
        }
      );

    }

  }, [navigate]);

  const handleLogin =
    async (e) => {

      e.preventDefault();

      try {

        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

        const user =
          userCredential.user;

        localStorage.setItem(
          "currentUser",
          user.email
        );
localStorage.setItem("currentUserUid", user.uid);
        if (
          role === "admin"
        ) {

          if (
            user.email ===
            "admin@gmail.com"
          ) {

            localStorage.setItem(
              "admin",
              "true"
            );
localStorage.setItem(
  "loginTime",
  Date.now()
);
            localStorage.setItem(
              "adminData",
              JSON.stringify(
                user
              )
            );

            localStorage.removeItem(
              "user"
            );

            alert(
              "Admin Login Success"
            );

            navigate(
              "/dashboard",
              {
                replace: true,
              }
            );

          } else {

            alert(
              "This is not Admin Account"
            );

          }

        } else {

          localStorage.setItem(
            "user",
            JSON.stringify(
              user
            )
          );
localStorage.setItem(
  "loginTime",
  Date.now()
);
          localStorage.removeItem(
            "admin"
          );

          localStorage.removeItem(
            "adminData"
          );

          alert(
            "User Login Success"
          );

          navigate(
            "/",
            {
              replace: true,
            }
          );

        }

      } catch (error) {

        console.log(error);

        alert(
          error.message
        );

      }

    };
      return (
    <div className="bg1">

      <div
        className="
          d-flex
          justify-content-center
          align-items-center
        "
        style={{
          minHeight: "100vh",
          backgroundColor:
            "#250acaa1",
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
            borderRadius:
              "15px",
          }}
        >

          <h2 className="text-center mb-4">
            Login
          </h2>

          <form
            onSubmit={
              handleLogin
            }
          >

            <div className="mb-3">

              <label>
                Login Type
              </label>

              <select
                className="form-control"
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value
                  )
                }
              >

                <option value="user">
                  User
                </option>

                <option value="admin">
                  Admin
                </option>

              </select>

            </div>

            <div className="mb-3">

              <label>
                Email
              </label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />

            </div>

            <div className="mb-4">

              <label>
                Password
              </label>

              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />

            </div>

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

          <div className="text-center mt-3">

            <Link to="/signup">
              Create New Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );

};

export default Login;