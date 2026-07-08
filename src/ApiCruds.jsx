import React, { useState, useEffect } from "react";
import AdminSidebar from "./admin/components/AdminSidebar";
import axios from "axios";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ApiCruds = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchUsers();
  }, [limit, page, search, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const skip = (page - 1) * limit;

      let url = "";

      if (search.trim() !== "") {
        url = `https://dummyjson.com/users/search?q=${search}&limit=${limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
      }

      const response = await axios.get(url);

      let list = response.data.users;

      list.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.firstName.localeCompare(b.firstName);
        } else {
          return b.firstName.localeCompare(a.firstName);
        }
      });

      setUsers(list);
      setTotal(response.data.total);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    XLSX.writeFile(workbook, "Users.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Users List", 14, 15);

    autoTable(doc, {
      startY: 22,

      head: [["ID", "First Name", "Last Name", "Age", "Gender"]],

      body: users.map((u) => [
        u.id,
        u.firstName,
        u.lastName,
        u.age,
        u.gender,
      ]),
    });

    doc.save("Users.pdf");
  };
   



 


  

  return (
    <div className="d-flex">

      <div style={{ width: "20%" }}>
        <AdminSidebar />
      </div>

      <div className="p-4" style={{ width: "80%" }}>

        <h3 className="mb-4">
          API CRUD
        </h3>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <h5 className="mt-3">
              Loading Users...
            </h5>
          </div>
        ) : (
          <>
          <div className="row mb-2">

  {/* Show Records */}
  <div className="col-md-3 d-flex">

    <label className="me-2 fw-bold">
      Show Records :
    </label>

    <select
      className="form-select"
      value={limit}
      onChange={(e) => {
        setLimit(Number(e.target.value));
        setPage(1);
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={30}>30</option>
    </select>

  </div>

  {/* Search */}
  <div className="col-md-3">

    <input
      type="text"
      className="form-control"
      placeholder="Search User..."
      value={searchText}
      onChange={(e) =>
        setSearchText(e.target.value)
      }
    />

  </div>

  <div className="col-md-2">

    <button
      className="btn btn-primary w-100"
      onClick={() => {
        setSearch(searchText);
        setPage(1);
      }}
    >
      Search
    </button>

  </div>

  {/* Sorting */}
  {/* <div className="col-md-2">

    <select
      className="form-select"
      value={sortOrder}
      onChange={(e) =>
        setSortOrder(e.target.value)
      }
    >
      <option value="asc">
        ASC
      </option>

      <option value="desc">
        DESC
      </option>

    </select> */}
 <div className="col-md-4 text-end">

    <button
      className="btn btn-success me-2"
      onClick={exportExcel}
    >
      Excel
    </button>

    <button
      className="btn btn-danger"
      onClick={exportPDF}
    >
      PDF
    </button>

  </div>
  </div>

  {/* Export Buttons */}
 



<div className="table-responsive">

<table className="table table-bordered table-striped table-hover">

<thead className="table-dark">

<tr>

<th>ID</th>

<th>First Name</th>

<th>Last Name</th>

<th>Age</th>

<th>Gender</th>

</tr>

</thead>

<tbody>

{
users.length > 0 ?

users.map((user)=>(

<tr key={user.id}>

<td>{user.id}</td>

<td>{user.firstName}</td>

<td>{user.lastName}</td>

<td>{user.age}</td>

<td>{user.gender}</td>

</tr>

))

:

<tr>

<td
colSpan="5"
className="text-center text-danger fw-bold"
>

No Records Found

</td>

</tr>

}

</tbody>

</table>

</div>
<div className="row mt-3">

  <div className="col-md-6">

    <p className="mt-2">

      Showing

      <b> {(page - 1) * limit + 1} </b>

      to

      <b> {Math.min(page * limit, total)} </b>

      of

      <b> {total} </b>

      Records

    </p>

  </div>

  <div className="col-md-6">

    <nav>

      <ul className="pagination justify-content-end">

        {/* Previous */}

        <li
          className={`page-item ${
            page === 1 ? "disabled" : ""
          }`}
        >

          <button
            className="page-link"
            onClick={() =>
              setPage(page - 1)
            }
          >
            Previous
          </button>

        </li>

        {/* Page Numbers */}

        {Array.from(
          { length: totalPages },
          (_, i) => i + 1
        )
          .filter(
            (p) =>
              p >= Math.max(1, page - 2) &&
              p <=
                Math.min(
                  totalPages,
                  page + 2
                )
          )
          .map((p) => (

            <li
              key={p}
              className={`page-item ${
                page === p
                  ? "active"
                  : ""
              }`}
            >

              <button
                className="page-link"
                onClick={() =>
                  setPage(p)
                }
              >
                {p}
              </button>

            </li>

          ))}

        {/* Next */}

        <li
          className={`page-item ${
            page === totalPages
              ? "disabled"
              : ""
          }`}
        >

          <button
            className="page-link"
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next
          </button>

        </li>

      </ul>

    </nav>

  </div>

</div>

          </>
        )}

      </div>

    </div>
  );
};

export default ApiCruds;