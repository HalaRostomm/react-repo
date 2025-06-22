import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import AdminService from "../service/adminService";

const AddSp = () => {
  const [serviceProvider, setServiceProvider] = useState({
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
      setServiceProvider((prev) => ({
        ...prev,
        company: selectedCompany || { companyId: "", companyName: "" },
      }));
    } else {
      setServiceProvider((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const AddNewSP = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt_token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("User roles:", decoded.roles || decoded.authorities);
    }

    const companyId = serviceProvider.company?.companyId;

    try {
      await AdminService.addNewSP(companyId, serviceProvider);
      setMessage("✅ Service Provider added successfully!");
      setServiceProvider({
        username: "",
        password: "",
        company: { companyId: "", companyName: "" },
      });
    } catch (error) {
      console.error("Error adding service provider:", error);
      if (error.response && error.response.data) {
        setMessage(`❌ ${error.response.data}`);
      } else {
        setMessage("❌ Failed to add Service Provider. Please try again.");
      }
    }
  };

  return (
    <>
      {/* Raleway font import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          padding: "50px 0",
          fontFamily: "'Raleway', sans-serif",
          color: "#D0D5CE",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            padding: "0 15px",
          }}
        >
          <div
            className="card shadow-lg rounded-4 border-0"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#D0D5CE",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              borderRadius: "1rem",
            }}
          >
            <div
              className="card-header text-center fw-bold fs-4"
              style={{
                backgroundColor: "#D0D5CE",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                color: "#000000",
                fontWeight: 700,
              }}
            >
              Add New Service Provider
            </div>

            <div className="card-body px-4">
              {message && (
                <div
                  className={`alert ${
                    message.startsWith("✅")
                      ? "alert-success"
                      : "alert-danger"
                  } text-center`}
                  role="alert"
                  style={{
                    backgroundColor: message.startsWith("✅")
                      ? "#d4edda"
                      : "#f8d7da",
                    color: message.startsWith("✅") ? "#155724" : "#721c24",
                    fontWeight: "600",
                    borderRadius: "6px",
                    padding: "10px",
                    marginBottom: "1rem",
                  }}
                >
                  {message}
                </div>
              )}

              <form onSubmit={AddNewSP}>
                <div className="mb-4">
                  <input
                    type="email"
                    name="username"
                    className="form-control"
                    placeholder="Email"
                    value={serviceProvider.username}
                    onChange={handleChange}
                    required
                    style={{
                      borderColor: "#a398a8",
                      backgroundColor: "#f3f4f2",
                      color: "#000000",
                      caretColor: "#000000",
                      borderRadius: "6px",
                      padding: "10px",
                      fontSize: "1rem",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={serviceProvider.password}
                    onChange={handleChange}
                    required
                    style={{
                      borderColor: "#a398a8",
                      backgroundColor: "#f3f4f2",
                      color: "#000000",
                      caretColor: "#000000",
                      borderRadius: "6px",
                      padding: "10px",
                      fontSize: "1rem",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div className="mb-4">
                  <select
                    name="company"
                    className="form-select"
                    value={serviceProvider.company?.companyId || ""}
                    onChange={handleChange}
                    required
                    style={{
                      borderColor: "#a398a8",
                      backgroundColor: "#f3f4f2",
                      color: "#000000",
                      borderRadius: "6px",
                      padding: "10px",
                      fontSize: "1rem",
                      width: "100%",
                      boxSizing: "border-box",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">-- Select Company --</option>
                    {companies.map((company) => (
                      <option
                        key={company.companyId}
                        value={company.companyId}
                        style={{ color: "#000000" }}
                      >
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-semibold"
                  style={{
                    backgroundColor: "#000000",
                    borderColor: "#a398a8",
                    color: "#D0D5CE",
                    fontWeight: "600",
                    padding: "12px",
                    fontSize: "1.1rem",
                    borderRadius: "30px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#827a88")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#a398a8")
                  }
                >
                  Add Service Provider
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSp;
