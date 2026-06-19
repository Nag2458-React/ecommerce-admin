import React, { useState, useEffect } from "react";

import { collection, query, where, getDocs } from "firebase/firestore";

import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail
} from "firebase/auth";

import { db, auth } from "../firebase/firebase";
import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Navbar from "./Navbar";
const Profile = () => {
    const [editMode, setEditMode] =useState(false);
  const userEmail = localStorage.getItem("currentUser");
const [showPassword, setShowPassword] =
  useState(false);

const [showNewPassword, setShowNewPassword] =
  useState(false);
  const [profileImage, setProfileImage] = useState("");

  const [name, setName] = useState("");

  const [mobile, setMobile] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [state, setState] = useState("");

  const [pincode, setPincode] = useState("");

  const [ordersCount, setOrdersCount] = useState(0);

  const [currentPassword, setCurrentPassword] =
  useState("");

const [newPassword, setNewPassword] =
  useState("");
  useEffect(() => {
   const savedData =
JSON.parse(
localStorage.getItem(
`profile_${userEmail}`
)
) || {};

    if (savedData) {
     setName(savedData.name || "");
setMobile(savedData.mobile || "");
setAddress(savedData.address || "");
setCity(savedData.city || "");
setState(savedData.state || "");
setPincode(savedData.pincode || "");
setProfileImage(savedData.profileImage || "");
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", userEmail),
    );

    const snapshot = await getDocs(q);

    setOrdersCount(snapshot.docs.length);
  };

const saveProfile = () => {

  localStorage.setItem(
    `profile_${userEmail}`,
    JSON.stringify({
      name,
      mobile,
      address,
      city,
      state,
      pincode,
      profileImage,
    })
  );

  alert("Profile Updated");

  setEditMode(false);

};

  const handleImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

 const changePassword = async () => {

  if (
    !currentPassword ||
    !newPassword
  ) {

    alert(
      "Fill All Password Fields"
    );

    return;
  }

  try {

    const user =
      auth.currentUser;

    const credential =
      EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

    await reauthenticateWithCredential(
      user,
      credential
    );

    await updatePassword(
      user,
      newPassword
    );

    alert(
      "Password Updated Successfully"
    );

    setCurrentPassword("");
    setNewPassword("");

  } catch (error) {

    console.log(error);

    alert(error.message);

  }

};
const forgotPassword = async () => {

  try {

    await sendPasswordResetEmail(
      auth,
      userEmail
    );

    alert(
      "Password Reset Link Sent To Your Email"
    );

  } catch (error) {

    console.log(error);

    alert(error.message);

  }

};
  return (
    <>
    <Navbar />
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="mb-4">My Profile</h2>

          <div className="text-center mb-4">
            <img
              src={
                profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt=""
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
              }}
            />

            <input
              type="file"
              className="form-control mt-3"
              onChange={handleImage}
            />
          </div>

     {!editMode ? (

<div className="row">

<div className="col-md-12 text-center mb-4">

<h4>{name || "No Name"}</h4>

<p className="text-muted">
{userEmail}
</p>

</div>

<div className="col-md-6 mb-3">
<b>Mobile :</b> {mobile || "-"}
</div>

<div className="col-md-6 mb-3">
<b>Address :</b> {address || "-"}
</div>

<div className="col-md-4 mb-3">
<b>City :</b> {city || "-"}
</div>

<div className="col-md-4 mb-3">
<b>State :</b> {state || "-"}
</div>

<div className="col-md-4 mb-3">
<b>Pincode :</b> {pincode || "-"}
</div>

<div className="col-md-12">

<button
className="btn btn-primary"
onClick={() =>
setEditMode(true)
}

>

Edit Profile </button>

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
onChange={(e)=>
setName(e.target.value)
}
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
onChange={(e)=>
setMobile(e.target.value)
}
/>

</div>

<div className="col-md-6 mb-3">

<label>Address</label>

<input
type="text"
className="form-control"
value={address}
onChange={(e)=>
setAddress(e.target.value)
}
/>

</div>

<div className="col-md-4 mb-3">

<label>City</label>

<input
type="text"
className="form-control"
value={city}
onChange={(e)=>
setCity(e.target.value)
}
/>

</div>

<div className="col-md-4 mb-3">

<label>State</label>

<input
type="text"
className="form-control"
value={state}
onChange={(e)=>
setState(e.target.value)
}
/>

</div>

<div className="col-md-4 mb-3">

<label>Pincode</label>

<input
type="text"
className="form-control"
value={pincode}
onChange={(e)=>
setPincode(e.target.value)
}
/>

</div>

<div className="col-md-12">

<button
className="btn btn-success me-2"
onClick={saveProfile}

>

Save Profile </button>

<button
className="btn btn-secondary"
onClick={() =>
setEditMode(false)
}

>

Cancel </button>

</div>

</div>

)}


          <button className="btn btn-primary" onClick={saveProfile}>
            Save Profile{" "}
          </button>

          <hr />

         
<hr />

<h4>
Change Password
</h4>

<div className="position-relative mb-3">

  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    className="form-control"
    placeholder="Current Password"
    value={currentPassword}
    onChange={(e) =>
      setCurrentPassword(
        e.target.value
      )
    }
  />

  <span
    style={{
      position: "absolute",
      right: "15px",
      top: "10px",
      cursor: "pointer",
    }}
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
  >
    {showPassword ? (
      <FaEyeSlash />
    ) : (
      <FaEye />
    )}
  </span>

</div>

<div className="position-relative mb-3">

  <input
    type={
      showNewPassword
        ? "text"
        : "password"
    }
    className="form-control"
    placeholder="New Password"
    value={newPassword}
    onChange={(e) =>
      setNewPassword(
        e.target.value
      )
    }
  />

  <span
    style={{
      position: "absolute",
      right: "15px",
      top: "10px",
      cursor: "pointer",
    }}
    onClick={() =>
      setShowNewPassword(
        !showNewPassword
      )
    }
  >
    {showNewPassword ? (
      <FaEyeSlash />
    ) : (
      <FaEye />
    )}
  </span>

</div>

<button
  className="btn btn-warning me-2"
  onClick={changePassword}
>
  Update Password
</button>

<button
  className="btn btn-danger"
  onClick={forgotPassword}
>
  Forgot Password
</button>

          <hr />

          <div className="alert alert-success">
            <h5>Total Orders :{ordersCount}</h5>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
