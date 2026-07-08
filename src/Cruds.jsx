import React, { useState,useEffect  } from "react";
import {  collection,  addDoc,  getDocs,deleteDoc,doc} from "firebase/firestore";
import { db } from "./firebase/firebase";
import AdminSidebar from "./admin/components/AdminSidebar";

const Cruds = () => {
  const [users, setUsers] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    gender: "",
    dob: "",
  });
  const [data, setData] = useState([]);
  useEffect(() => {
  fetchUsers();
}, []);
const fetchUsers = async () => {

  const snapshot1 = await getDocs(
    collection(db, "cruds")
  );

  const list = snapshot1.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setData(list);

};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers({ ...users, [name]: value });
  };
const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    await addDoc(
      collection(db, "cruds"),
      users
    );

    fetchUsers();

    setUsers({
      name:"",
      email:"",
      mobile:"",
      address:"",
      gender:"",
      dob:"",
    });

    alert("Saved Successfully");

  } catch(err){

    console.log(err);

  }

};

const handleDelete = async (id) =>{
  const deletes = window.confirm("are you sure delete");
  if(!deletes) return;
  
    try{
        await deleteDoc(doc(db, "cruds", id));
        alert("delete succesfully");
        fetchUsers();  
    }
    catch(err) {
alert("delete failed");
    }
  
}
  return (
    <div className="">
    <div className="d-flex">
      <div style={{width:"20%"}}>
       <AdminSidebar />
       </div>
    <div className="p-4 py-4" style={{width:"80%"}}>
      {/* Form Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header  text-white" style={{background:"#3e25c3",padding:"3px"}}>   
          <h4 className="mb-0" style={{fontSize:"25px"}}>Add Record</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={users.name}
                  onChange={handleChange}
                  name="name"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={users.email}
                  onChange={handleChange}
                  name="email"
                  required
                  placeholder="Enter Email"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  value={users.mobile}
                  required
                  onChange={handleChange}
                  name="mobile"
                  placeholder="Enter Mobile Number"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={users.address}
                  required
                  onChange={handleChange}
                  rows="1"
                  placeholder="Enter Address"
                ></textarea>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={users.gender}
                  required
                  onChange={handleChange}
                  style={{    height: "42px"}}
                >
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={users.dob}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-light text-black">
          <h4 className="mb-0" style={{fontSize:"25px"}}>Records List</h4>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th width="150">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.address}</td>
                      <td>{user.gender}</td>
                      <td>{user.dob}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2">
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() =>handleDelete (user.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Cruds;
