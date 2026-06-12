import React, {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import AdminSidebar from "../components/AdminSidebar";

const Categories = () => {

  const [categories, setCategories] =
    useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {

    try {

      const snapshot =
        await getDocs(
          collection(db, "products")
        );

      const products =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      const categoryData = {};

      products.forEach((item) => {

        if (
          !categoryData[item.category]
        ) {

          categoryData[item.category] = {
            category:
              item.category,
            totalProducts: 0,
            totalStock: 0,
            totalPrice: 0,
          };
        }

        categoryData[
          item.category
        ].totalProducts += 1;

        categoryData[
          item.category
        ].totalStock += Number(
          item.stock || 0
        );

        categoryData[
          item.category
        ].totalPrice += Number(
          item.discountPrice ||
          item.price ||
          0
        );

      });

      const finalData =
        Object.values(
          categoryData
        ).map((item) => ({
          ...item,

          averagePrice:
            Math.round(
              item.totalPrice /
              item.totalProducts
            ),
        }));

      setCategories(
        finalData
      );

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
          background:
            "#f5f5f5",
          minHeight:
            "100vh",
        }}
      >

        <h2 className="mb-4">
          Categories
        </h2>

        {/* TOP CARDS */}

        <div className="row mb-4">

          <div className="col-md-4">

            <div className="card shadow">

              <div className="card-body">

                <h6>
                  Total Categories
                </h6>

                <h2>
                  {
                    categories.length
                  }
                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="card shadow">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-bordered table-hover">

                <thead>

                  <tr>

                    <th>
                      Category
                    </th>

                    <th>
                      Products
                    </th>

                    <th>
                      Total Stock
                    </th>

                    <th>
                      Average Price
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {categories.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={index}
                      >

                        <td>
                          {
                            item.category
                          }
                        </td>

                        <td>
                          {
                            item.totalProducts
                          }
                        </td>

                        <td>
                          {
                            item.totalStock
                          }
                        </td>

                        <td>
                          ₹
                          {
                            item.averagePrice
                          }
                        </td>

                      </tr>

                    )
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

export default Categories;