import React,{useState,useEffect} from 'react'
import AdminSidebar from './admin/components/AdminSidebar';
import axios from "axios";
 const ApiCruds = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
const [searchText, setSearchText] = useState("");
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);
   useEffect(() => {
  fetchUsers();
}, [limit, search, page]);
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

    setUsers(response.data.users);
    setTotal(response.data.total);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
    const totalPages = Math.ceil(total / limit);
    
  return (
    <div className="d-flex">
      <div style={{width:"20%"}}>
        <AdminSidebar />
        </div>
    <div className='p-4' style={{width:"80%"}}><h3>API CRUD</h3>

    {
        loading ? 
        (<h2>Loading data</h2>):
        (
            <>
            <div className="row">
              <div className="col-md-6 text-start">
            <div className="mb-3">

  <label className="me-2">
    Show Records :
  </label>

 <select
    className="form-select d-inline"
    value={limit}
    onChange={(e) => {
        setLimit(Number(e.target.value));
        setPage(1);
    }}
    style={{ width: "15%" }}
>
  <option value={5}>5</option>
  <option value={10}>10</option>
  <option value={20}>20</option>
  <option value={30}>30</option>
</select>

</div>
</div>
<div className="col-md-6 d-flex text-end">
<input
  type="text"
  className="form-control"
  placeholder="Search..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>

<button
    className="btn btn-primary ms-2"
    onClick={() => {
        setSearch(searchText);
        setPage(1);
    }}
>
    Search
</button>
</div>
</div>
             <table className="table table-bordered" style={{width:"100%"}}>

  <thead>

    <tr>

      <th>ID</th>
     <th>First name</th>
      <th>Last Name</th>
      <th>Age</th>
      <th>Gender</th>

    </tr>
    
  </thead>

  <tbody>
    {
        users.map((user) => (
         
                   
                 <tr  key={user.id}>
                    <td>{user.id}</td>
                    
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.age}</td>
                    <td>{user.gender}</td>
                  </tr>
            )
           
         
        )
    }
   
  </tbody>
  </table>
  <div className="row">
    <div className="col-md-6"></div>
    <div className="col-md-6 text-end">
  <nav className="">
  <ul className="pagination justify-content-end">

    {/* Previous */}
    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>
    </li>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(
        (p) =>
          p >= Math.max(1, page - 2) &&
          p <= Math.min(totalPages, page + 2)
      )
      .map((p) => (
        <li
          key={p}
          className={`page-item ${page === p ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        </li>
      ))}

    {/* Next */}
    <li
      className={`page-item ${
        page === totalPages ? "disabled" : ""
      }`}
    >
      <button
        className="page-link"
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </li>

  </ul>
</nav>
</div>
</div>
  </>
        )

    }

   
    </div>
    </div>
  )
}
export default ApiCruds;