import React, { useState } from "react";

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers({ ...users, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setData([...data, users]);
    setUsers({
      name: "",
      email: "",
      mobile: "",
      address: "",
      gender: "",
      dob: "",
    });
  };
  return (
    <div className="container py-4">
      {/* Form Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">  
          <h4 className="mb-0">Add Record</h4>
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
                  placeholder="Enter Email"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  value={users.mobile}
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
                  onChange={handleChange}
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
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Records List</h4>
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
                        <button className="btn btn-danger btn-sm">
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
  );
};

export default Cruds;
