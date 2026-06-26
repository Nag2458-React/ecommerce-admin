import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdminSidebar from "../components/AdminSidebar";

const TopSellingProducts = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    const snapshot = await getDocs(
      collection(db, "orders")
    );

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const salesMap = {};

    orders.forEach(order => {

      order.products?.forEach(product => {

        const key = product.productName;

        if (!salesMap[key]) {

          salesMap[key] = {

            productName: product.productName,

            image: product.imagePath,

            sold: 0,

            revenue: 0,

            stock: product.stock || 0,

            category: product.category || "-"

          };

        }

        salesMap[key].sold += Number(product.qty || 1);

        salesMap[key].revenue +=
          Number(product.discountPrice || product.price || 0) *
          Number(product.qty || 1);

      });

    });

    const result = Object.values(salesMap)
      .sort((a,b)=>b.sold-a.sold);

    setProducts(result);

  };

  return (

<div className="d-flex">

<AdminSidebar/>

<div className="container-fluid p-4">

<h2 className="fw-bold mb-4">

🏆 Top Selling Products

</h2>

<div className="card shadow border-0">

<div className="table-responsive">

<table className="table table-hover align-middle mb-0">

<thead className="table-dark">

<tr>

<th>#</th>

<th>Image</th>

<th>Product</th>

<th>Sold Qty</th>

<th>Revenue</th>

</tr>

</thead>

<tbody>

{
products.map((item,index)=>(

<tr key={index}>

<td>

{index+1}

</td>

<td>

<img

src={item.image}

alt=""

style={{

width:"70px",

height:"70px",

objectFit:"cover",

borderRadius:"8px"

}}

/>

</td>

<td>

<h6 className="mb-1">

{item.productName}

</h6>

</td>

<td>

<span className="badge bg-primary">

{item.sold}

</span>

</td>

<td className="fw-bold text-success">

₹{item.revenue.toLocaleString()}

</td>

</tr>

))
}

</tbody>

</table>

</div>

</div>

</div>

</div>

  );
};

export default TopSellingProducts;