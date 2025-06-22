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
    <>
      {/* Load Raleway font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff", // white background
          padding: "50px",
          fontFamily: "'Raleway', sans-serif", // Raleway font
          color: "#000000", // black text
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            backgroundColor: "#ffffff", // light muted greenish card background
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
            background: "#D0D5CE", // muted greenish background)",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              padding: "20px 30px",
            }}
          >
            <h2 style={{ margin: 0, fontWeight: "700", color: "#000000" }}>
              Companies List
            </h2>
            <p
              style={{
                margin: 0,
                color: "#333",
                fontWeight: "400",
              }}
            >
              Manage your companies efficiently
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
                backgroundColor: message.startsWith("✅") ? "#d0f0c0" : "#f8d7da",
                color: message.startsWith("✅") ? "#3a7d2d" : "#721c24",
                padding: "10px",
                fontWeight: "600",
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
                  backgroundColor: "#D0D5CE",
                  color: "#000000",
                  fontWeight: "600",
                  padding: "8px 20px",
                  borderRadius: "30px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#333333")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#000000")}
              >
                ➕ Add Company
              </button>
            </div>

            {loading ? (
              <div className="text-center text-muted fs-5" style={{ color: "#555" }}>
                <i className="fas fa-spinner fa-spin me-2"></i> Loading companies...
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", color: "#000000" }}>
                  <thead>
                    <tr style={{ color: "#333", textAlign: "left" }}>
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
                            borderTop: "1px solid #bbb",
                            transition: "background-color 0.3s ease",
                            cursor: "default",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#e6e9e8")
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
                                backgroundColor: "#000000",
                                color: "#D0D5CE",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                marginRight: "8px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#333333")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#000000")
                              }
                              aria-label="Edit company"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteCompany(company.companyId)}
                              style={{
                                backgroundColor: "#8B0000",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "6px 10px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#7b1212")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#b71c1c")
                              }
                              aria-label="Delete company"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center fst-italic py-3"
                          style={{ color: "#666" }}
                        >
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
    </>
  );
};

export default CompanyList;
