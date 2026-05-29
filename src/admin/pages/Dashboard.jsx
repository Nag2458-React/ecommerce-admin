import React from "react";

import {  Navigate} from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

const Dashboard = () => {

  const isAdmin =    localStorage.getItem("admin");

  // PROTECT ADMIN PAGE

  if(!isAdmin){

    return <Navigate to="/login" />;
  }

  return (

    <div className="d-flex">

      {/* SIDEBAR */}

      <AdminSidebar />



      {/* CONTENT */}

      <div
        className="
          flex-grow-1
          p-4
        "
        style={{
          background: "#f5f5f5",
          minHeight: "100vh"
        }}
      >

        <h1 className="mb-4">
          Admin Dashboard
        </h1>

        <div className="row">

          <div className="col-md-3 mb-4">

            <div
              className="
                card
                shadow
                border-0
              "
            >

              <div className="card-body">

                <h5>
                  Total Products
                </h5>

                <h2>
                  120
                </h2>

              </div>

            </div>

          </div>



          <div className="col-md-3 mb-4">

            <div
              className="
                card
                shadow
                border-0
              "
            >

              <div className="card-body">

                <h5>
                  Orders
                </h5>

                <h2>
                  450
                </h2>

              </div>

            </div>

          </div>



          <div className="col-md-3 mb-4">

            <div
              className="
                card
                shadow
                border-0
              "
            >

              <div className="card-body">

                <h5>
                  Customers
                </h5>

                <h2>
                  220
                </h2>

              </div>

            </div>

          </div>



          <div className="col-md-3 mb-4">

            <div
              className="
                card
                shadow
                border-0
              "
            >

              <div className="card-body">

                <h5>
                  Revenue
                </h5>

                <h2>
                  ₹5,50,000
                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;