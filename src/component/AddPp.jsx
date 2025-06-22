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
      setMessage(
        `❌ ${
          error.response?.data || "Failed to add Product Provider. Please try again."
        }`
      );
    }
  };

  return (
    <>
      <style>
        {`
          input::placeholder,
          select::placeholder {
            color: rgba(0, 0, 0, 0.6);
          }

          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: #000 !important;
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          padding: "50px 20px",
          fontFamily: "'Raleway', sans-serif",
          color: "#000",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#D0D5CE",
            borderRadius: "12px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            border: "1px solid #D0D5CE",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#D0D5CE",
              padding: "20px 30px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              color: "#000000",
              borderBottom: "1px solid #D0D5CE",
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
                backgroundColor: message.startsWith("✅") ? "#e0f2f1" : "#fce4ec",
                color: message.startsWith("✅") ? "#004d40" : "#880e4f",
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
                className="form-control"
                placeholder="Email"
                value={productProvider.username}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000",
                  border: "1px solid #D0D5CE",
                }}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={productProvider.password}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000",
                  border: "1px solid #D0D5CE",
                }}
              />
            </div>

            <div className="mb-4">
              <select
                name="company"
                className="form-select"
                value={productProvider.company?.companyId || ""}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000",
                  border: "1px solid #D0D5CE",
                }}
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
                backgroundColor: "#000000",
                color: "#ffffff",
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
