import React, { useState, useEffect } from "react";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import AdminSidebar from "../components/AdminSidebar";

const Settings = () => {
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    shopName: "",
    shopEmail: "",
    shopPhone: "",
    shopAddress: "",
    deliveryCharge: "",
    freeDeliveryAbove: "",
    deliveryDays: "",
    gst: "",
    taxEnabled: true,
    websiteTitle: "",
    footerText: "",
    copyrightText: "",
    lowStockAlert: "5",
    darkMode: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const docRef = doc(db, "settings", "shopConfig");

    const snap = await getDoc(docRef);

    if (snap.exists()) {
      setSettings(snap.data());
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const saveSettings = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await setDoc(doc(db, "settings", "shopConfig"), settings);

      alert("Settings Saved Successfully");
    } catch (error) {
      console.log(error);

      alert("Error Saving Settings");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex">
                 <div style={{width:"20%"}}>
      <AdminSidebar />
</div>
      <div
        className="flex-grow-1 p-4"
        style={{
          background: "#f5f5f5",
          minHeight: "100vh",
          width:"80%"
        }}
      >
        <div className="card shadow">
          <div className="card-body">
            <h2 className="mb-4">Settings</h2>

            <form onSubmit={saveSettings}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    name="shopName"
                    placeholder="Shop Name"
                    className="form-control"
                    value={settings.shopName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <input
                    type="email"
                    name="shopEmail"
                    placeholder="Shop Email"
                    className="form-control"
                    value={settings.shopEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    name="shopPhone"
                    placeholder="Phone"
                    className="form-control"
                    value={settings.shopPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <textarea
                    name="shopAddress"
                    placeholder="Shop Address"
                    className="form-control"
                    rows="2"
                    value={settings.shopAddress}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <input
                    type="number"
                    name="deliveryCharge"
                    placeholder="Delivery Charge"
                    className="form-control"
                    value={settings.deliveryCharge}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <input
                    type="number"
                    name="freeDeliveryAbove"
                    placeholder="Free Delivery Above"
                    className="form-control"
                    value={settings.freeDeliveryAbove}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    name="deliveryDays"
                    placeholder="Delivery Days"
                    className="form-control"
                    value={settings.deliveryDays}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="number"
                    name="gst"
                    placeholder="GST %"
                    className="form-control"
                    value={settings.gst}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-check">
                    <input
                      type="checkbox"
                      name="taxEnabled"
                      className="form-check-input"
                      checked={settings.taxEnabled}
                      onChange={handleChange}
                    />

                    <span className="ms-2">Enable GST</span>
                  </label>
                </div>

                <div className="col-md-4 mb-3">
                  <input
                    type="number"
                    name="lowStockAlert"
                    placeholder="Low Stock Alert"
                    className="form-control"
                    value={settings.lowStockAlert}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    name="websiteTitle"
                    placeholder="Website Title"
                    className="form-control"
                    value={settings.websiteTitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    name="footerText"
                    placeholder="Footer Text"
                    className="form-control"
                    value={settings.footerText}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <input
                    type="text"
                    name="copyrightText"
                    placeholder="Copyright Text"
                    className="form-control"
                    value={settings.copyrightText}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-check">
                    <input
                      type="checkbox"
                      name="darkMode"
                      className="form-check-input"
                      checked={settings.darkMode}
                      onChange={handleChange}
                    />

                    <span className="ms-2">Dark Mode</span>
                  </label>
                </div>
                <div className="col-md-12">
                  <button
                    className="
btn
btn-primary
w-100
"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
