import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AdminSidebar from "../components/AdminSidebar";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(data);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        orderStatus: status,
      });

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
   
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">📦 Placed Orders</h2>
      
<div className="row">
      {orders.length === 0 ? (
        <h4>No Orders Found</h4>
      ) : (
        orders.map((order) => (
          <div className="col-md-4">
          <div key={order.id} className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <div>
                <strong>Order #{order.id.slice(0, 8)}</strong>

                <div className="small text-muted">{order.customerName}</div>
              </div>

              <select
                className="form-select w-auto"
                value={order.orderStatus}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
              >
                <option value="Pending">Pending</option>

                <option value="Processing">Processing</option>

                <option value="Shipped">Shipped</option>

                <option value="Delivered">Delivered</option>

                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Customer</strong>
                  <div>{order.customerName}</div>
                </div>

                <div className="col-md-4">
                  <strong>Mobile</strong>
                  <div>{order.mobile}</div>
                </div>

                <div className="col-md-4">
                  <strong>Total</strong>
                  <div>₹{Number(order.totalAmount || 0).toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-3">
                <strong>Address</strong>

                <div>
                  {order.address},{order.city},{order.state} -{order.pincode}
                </div>
              </div>

              <hr />

              {order.products?.map((product, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center border-bottom py-3"
                >
                  <img
                    src={product.imagePath}
                    alt=""
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-1">{product.productName}</h6>

                    <small>Qty : {product.qty}</small>

                    <br />

                    <small>Size :{product.selectedSize}</small>

                    {product.selectedColor && (
                      <>
                        <br />
                        <small>Color :{product.selectedColor?.name}</small>
                      </>
                    )}
                  </div>

                  <h6 className="text-success">
                    ₹{product.discountPrice || product.price}
                  </h6>
                </div>
              ))}
            </div>
          </div>
          </div>
        ))
      )}
    </div>
    </div>
     </div>
  );
};

export default AdminOrders;
