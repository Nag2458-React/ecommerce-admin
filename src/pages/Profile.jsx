import React, { useState, useEffect } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth } from "../firebase/firebase";
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa";
import Navbar from "./Navbar";
const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const userEmail = localStorage.getItem("currentUser");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const [name, setName] = useState("");

  const [mobile, setMobile] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [state, setState] = useState("");

  const [pincode, setPincode] = useState("");

  const [ordersCount, setOrdersCount] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [profilePercent, setProfilePercent] = useState(0);
  const [strength, setStrength] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadProfile();

        fetchOrders();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const docRef = doc(db, "users", user.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setName(data.name || "");

        setMobile(data.phone || "");

        setAddress(data.address || "");

        setCity(data.city || "");

        setState(data.state || "");

        setPincode(data.pincode || "");

        setProfileImage(data.profileImage || "");
        if (data.createdAt) {
          setCreatedAt(
            new Date(data.createdAt.seconds * 1000).toLocaleDateString(),
          );
        }
        let count = 0;

        if (data.name) count++;
        if (data.phone) count++;
        if (data.address) count++;
        if (data.city) count++;
        if (data.state) count++;
        if (data.pincode) count++;
        if (data.profileImage) count++;

        setProfilePercent(Math.round((count / 7) * 100));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const docRef = doc(db, "users", user.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setName(data.name || "");
        setMobile(data.phone || "");
        setAddress(data.address || "");
        setCity(data.city || "");
        setState(data.state || "");
        setPincode(data.pincode || "");
        setProfileImage(data.profileImage || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", userEmail),
    );

    const snapshot = await getDocs(q);

    setOrdersCount(snapshot.docs.length);
  };

  const saveProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        name,

        phone: mobile,

        address,

        city,

        state,

        pincode,

        profileImage,
      });

      alert("Profile Updated Successfully");

      setEditMode(false);

      loadProfile();
    } catch (error) {
      console.log(error);

      alert(error.message);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const image = reader.result;

        setProfileImage(image);

        const user = auth.currentUser;

        if (!user) return;

        await updateDoc(doc(db, "users", user.uid), {
          profileImage: image,
        });

        loadProfile();

        alert("Profile Picture Updated");
      } catch (err) {
        console.log(err);
      }
    };

    reader.readAsDataURL(file);
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Fill All Password Fields");
      return;
    }

    try {
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      alert("Password Updated Successfully");

      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const forgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, userEmail);

      alert("Password Reset Link Sent To Your Email");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card shadow mb-3">
          <div className="card-body">
            {/* <h2 className="text-center mb-4 fw-bold text-primary">
              👤 My Profile
            </h2> */}
<h2 className="text-center fw-bold text-primary mb-2">
                    Welcome,
                    {name || "User"}
                    👋
                  </h2>

                  <p className="text-center text-muted mb-4">
                    Manage your personal information and account settings.
                  </p>
            <div
              className="text-center mb-4"
              style={{
                position: "relative",
                width: "140px",
                margin: "auto",
              }}
            >
              <img
                src={
                  profileImage
                    ? profileImage
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt=""
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #0d6efd",
                }}
              />

              <label
                htmlFor="uploadImage"
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "5px",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "#0d6efd",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCamera />
              </label>

              <input
                id="uploadImage"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
            </div>

            {!editMode ? (
              <div className="row">
                <div className="col-md-12 text-center mb-4">
                  

                  <p className="text-secondary fs-6">📧 {userEmail}</p>
                  <p className="text-muted">Member Since :{createdAt || "-"}</p>
                </div>

                <div className="alert alert-primary mt-3">
                  <h6>Personal Information</h6>

                  <hr />

                  <p>
                    <b>Name :</b>

                    {name}
                  </p>

                  <p>
                    <b>Email :</b>

                    {userEmail}
                  </p>

                  <p>
                    <b>Phone :</b>

                    {mobile}
                  </p>

                  <p>
                    <b>Address :</b>

                    {address}
                  </p>

                  <p>
                    <b>City :</b>

                    {city}
                  </p>

                  <p>
                    <b>State :</b>

                    {state}
                  </p>

                  <p>
                    <b>Pincode :</b>

                    {pincode}
                  </p>
                </div>

                <div className="col-md-12">
                  <div className="col-md-12 mt-3">
                    <button
                      className="btn btn-primary me-2 px-4"
                      onClick={() => setEditMode(true)}
                    >
                      ✏ Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Name</label>

                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Email</label>

                  <input
                    type="text"
                    className="form-control"
                    value={userEmail}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Mobile</label>

                  <input
                    type="text"
                    className="form-control"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Address</label>

                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>City</label>

                  <input
                    type="text"
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>State</label>

                  <input
                    type="text"
                    className="form-control"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Pincode</label>

                  <input
                    type="text"
                    className="form-control"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>

                <div className="col-md-12">
                  <button
                    className="btn btn-success me-2 px-4"
                    onClick={saveProfile}
                  >
                    💾 Save
                  </button>

                  <button
                    className="btn btn-outline-danger px-4"
                    onClick={() => {
                      loadProfile();
                      setEditMode(false);
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}

            {/* <button className="btn btn-primary" onClick={saveProfile}>
            Save Profile{" "}
          </button> */}

            <hr />

            <hr />
<div className="col-md-6">
            <h4>Change Password</h4>

            <div className="position-relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <span
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="position-relative mb-3">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);

                  const val = e.target.value;

                  if (val.length < 6) {
                    setStrength("Weak");
                  } else if (val.length < 10) {
                    setStrength("Medium");
                  } else {
                    setStrength("Strong");
                  }
                }}
              />
              <small
                className={
                  strength === "Weak"
                    ? "text-danger"
                    : strength === "Medium"
                      ? "text-warning"
                      : "text-success"
                }
              >
                Password Strength : {strength}
              </small>

              <span
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="btn btn-warning me-2" onClick={changePassword}>
              Update Password
            </button>

            <button className="btn btn-danger" onClick={forgotPassword}>
              Forgot Password
            </button>
            </div>
            <div className="mb-4">
              <h5>
                Profile Completion
                <span className="float-end">{profilePercent}%</span>
              </h5>

              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${profilePercent}%`,
                  }}
                >
                  {profilePercent}%
                </div>
              </div>
            </div>
            <hr />

            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card text-center border-success shadow-sm">
                  <div className="card-body">
                    <h6>Account Status</h6>

                    <h4 className="text-success">Verified</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center border-primary shadow-sm">
                  <div className="card-body">
                    <h6>Role</h6>

                    <h4 className="text-primary">User</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center border-warning shadow-sm">
                  <div className="card-body">
                    <h6>Orders</h6>

                    <h4 className="text-warning">{ordersCount}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-3 mb-3">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h6>Total Orders</h6>

                    <h3 className="text-primary">{ordersCount}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h6>Wishlist</h6>

                    <h3 className="text-danger">0</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h6>Reviews</h6>

                    <h3 className="text-success">0</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card shadow border-0">
                  <div className="card-body text-center">
                    <h6>Coupons</h6>

                    <h3 className="text-warning">0</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
