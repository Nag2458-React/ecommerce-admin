import React, { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import AdminSidebar from "../components/AdminSidebar";

const Customers = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [todayCustomers, setTodayCustomers] = useState(0);

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));

      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCustomers(users);

      setTotalCustomers(users.length);

      const today = new Date().toDateString();

      const todayCount = users.filter((user) => {
        if (!user.createdAt) return false;

        const date = user.createdAt?.toDate().toDateString();

        return date === today;
      });

      setTodayCustomers(todayCount.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div
        className="flex-grow-1 p-4"
        style={{
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h2 className="mb-4">Customers Dashboard</h2>

        {/* CARDS */}

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 className="text-muted">Total Customers</h6>

                <h2>{totalCustomers}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 className="text-muted">New Customers Today</h6>

                <h2 className="text-success">{todayCustomers}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h6 className="text-muted">Active Customers</h6>

                <h2 className="text-primary">{totalCustomers}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="card shadow border-0">
          <div className="card-body">
            <h4 className="mb-3">Customer List</h4>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.length > 0 ? (
                    customers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>

                        <td>{user.name || "-"}</td>

                        <td>{user.email || "-"}</td>

                        <td>
                          {user.createdAt
                            ? user.createdAt.toDate().toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No Customers Found
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
  );
};

export default Customers;
