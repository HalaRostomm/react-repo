import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AdminService from "../service/adminService";
import { FaBoxOpen } from "react-icons/fa";

const AddPp = () => {
  const [productProvider, setProductProvider] = useState({
    username: "",
    password: "",
    company: { companyId: "", companyName: "" },
  });

  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await AdminService.getAllCompanies();
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "company") {
      const selectedCompany = companies.find(
        (c) => c?.companyId?.toString() === value
      );
      setProductProvider((prev) => ({
        ...prev,
        company: selectedCompany || { companyId: "", companyName: "" },
      }));
    } else {
      setProductProvider((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const AddNewPP = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt_token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("User roles:", decoded.roles || decoded.authorities);
    }

    const companyId = productProvider.company?.companyId;

    try {
      await AdminService.addNewPP(productProvider, companyId);
      setMessage("✅ Product Provider added successfully!");
      setProductProvider({
        username: "",
        password: "",
        company: { companyId: "", companyName: "" },
      });
    } catch (error) {
      console.error("Error adding product provider:", error);
      if (error.response && error.response.data) {
        setMessage(`❌ ${error.response.data}`);
      } else {
        setMessage("❌ Failed to add Product Provider. Please try again.");
      }
    }
  };

  return (
    <>
      {/* Make placeholders white */}
      <style>
        {`
          input::placeholder, select:required:invalid {
            color: rgba(255, 255, 255, 0.8);
          }

          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 9999s ease-in-out 0s;
          }
        `}
      </style>
<style>
  {`
    input::placeholder,
    select::placeholder,
    textarea::placeholder {
      color: rgba(255, 255, 255, 0.85) !important;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:hover {
      -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
      -webkit-text-fill-color: white !important;
    }
  `}
</style>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          padding: "50px 20px",
          fontFamily: "'Segoe UI', sans-serif",
          color: "#e0e0e0",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(90deg, #9c27b0, #d63384)",
              padding: "20px 30px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              color: "#fff",
            }}
          >
            <FaBoxOpen size={24} />
            <h3 style={{ margin: 0, fontWeight: "700" }}>Add Product Provider</h3>
          </div>

          {/* Message */}
          {message && (
            <div
              className="text-center fw-semibold"
              style={{
                backgroundColor: message.startsWith("✅")
                  ? "#c8e6c9"
                  : "#f8d7da",
                color: message.startsWith("✅") ? "#256029" : "#842029",
                padding: "12px",
                fontWeight: "600",
              }}
            >
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={AddNewPP} style={{ padding: "30px" }}>
            <div className="mb-4">
              <input
                type="email"
                name="username"
                className="form-control bg-dark text-white"
                placeholder="Email"
                value={productProvider.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                className="form-control bg-dark text-white"
                placeholder="Password"
                value={productProvider.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <select
                name="company"
                className="form-select bg-dark text-white"
                value={productProvider.company?.companyId || ""}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Company --</option>
                {companies.map((company) => (
                  <option key={company.companyId} value={company.companyId}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#9c27b0",
                color: "#fff",
                fontWeight: "600",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              Add Product Provider
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPp;
