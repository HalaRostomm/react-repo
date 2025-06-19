import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { FaEdit, FaTrash } from "react-icons/fa";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    adminService
      .getAllCompanies()
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setMessage("❌ Failed to load companies. Please try again.");
        setLoading(false);
        console.error("Error fetching companies:", error);
      });
  };

  const deleteCompany = (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    adminService
      .deleteCompany(id)
      .then(() => {
        setMessage(`✅ Company with ID ${id} deleted successfully!`);
        setCompanies((prev) => prev.filter((c) => c.companyId !== id));
      })
      .catch((error) => {
        setMessage("❌ Failed to delete the company. Please try again.");
        console.error("Error:", error);
      });
  };

  const updateCompany = (id) => {
    navigate(`/admin/updatecompany/${id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "50px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#1e293b",
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(90deg, #9c27b0, #d63384)",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            padding: "20px 30px",
          }}
        >
          <h2 style={{ margin: 0, fontWeight: "700" }}>Companies List</h2>
          <p style={{ margin: 0, color: "#f3e5f5", fontWeight: "400" }}>
            Here is a subtitle for this table
          </p>
        </div>

        {message && (
          <div
            className={`alert ${
              message.startsWith("✅") ? "alert-success" : "alert-danger"
            } text-center fw-semibold`}
            style={{
              borderRadius: "0",
              marginBottom: 0,
            }}
          >
            {message}
          </div>
        )}

        <div style={{ padding: "30px" }}>
          <div className="text-end mb-3">
            <button
              onClick={() => navigate("/admin/addcompany")}
              className="btn"
              style={{
                backgroundColor: "#9c27b0",
                color: "#fff",
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "30px",
                border: "none",
                boxShadow: "0 4px 12px rgba(156, 39, 176, 0.6)",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#7b1fa2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#9c27b0")}
            >
              ➕ Add Company
            </button>
          </div>

          {loading ? (
            <div className="text-center text-muted fs-5">
              <i className="fas fa-spinner fa-spin me-2"></i> Loading companies...
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", color: "#e0e0e0" }}>
                <thead>
                  <tr style={{ color: "#c3baf0", textAlign: "left" }}>
                    <th style={{ padding: "12px 10px" }}>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length > 0 ? (
                    companies.map((company) => (
                      <tr
                        key={company.companyId}
                        style={{
                          borderTop: "1px solid #334155",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#1a2235")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <td style={{ padding: "12px 10px" }}>{company.companyId}</td>
                        <td>{company.companyName}</td>
                        <td>{company.companyAddress}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => updateCompany(company.companyId)}
                            style={{
                              backgroundColor: "#6f42c1",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 10px",
                              marginRight: "8px",
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteCompany(company.companyId)}
                            style={{
                              backgroundColor: "#e53935",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 10px",
                            }}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted fst-italic py-3">
                        No companies available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
