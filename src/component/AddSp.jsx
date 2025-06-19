import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", padding: "50px 0" }}>
      <style>
      {`
        input.form-control,
        select.form-select {
          color: white !important;
          background-color: #0f172a !important;
        }

        input::placeholder,
        select::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #0f172a inset !important;
          -webkit-text-fill-color: white !important;
        }

        option {
          color: black !important; /* for dropdown list items */
        }
      `}
    </style>
      <div className="container" style={{ maxWidth: "500px" }}>
        <div
          className="card shadow-lg rounded-4 border-0"
          style={{ backgroundColor: "#1e293b", color: "white" }}
        >
          <div
            className="card-header text-white text-center fw-bold fs-4"
            style={{
              backgroundColor: "#6f42c1",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
            }}
          >
            Add New Service Provider
          </div>

          <div className="card-body px-4">
            {message && (
              <div
                className={`alert ${
                  message.startsWith("✅") ? "alert-success" : "alert-danger"
                } text-center`}
                role="alert"
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
    borderColor: "#6f42c1",
    backgroundColor: "#0f172a",
    color: "white",
    caretColor: "white",             // blinking cursor color
    placeholderColor: "white",       // may not work alone
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
                    borderColor: "#6f42c1",
                    backgroundColor: "#0f172a",
                    color: "white",
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
                    borderColor: "#6f42c1",
                    backgroundColor: "#0f172a",
                    color: "white",
                  }}
                >
                  <option value="">-- Select Company --</option>
                  {companies.map((company) => (
                    <option
                      key={company.companyId}
                      value={company.companyId}
                      style={{ color: "black" }}
                    >
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-purple w-100 fw-semibold"
                style={{
                  backgroundColor: "#6f42c1",
                  borderColor: "#6f42c1",
                  transition: "background-color 0.3s ease",
                  color: "white",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#5a32a3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6f42c1")
                }
              >
                Add Service Provider
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSp;
