import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import "../sharedPageStyles.css";

const INITIAL_STUDENT_ID = localStorage.getItem("userCode") || "2020001";
const CERTIFICATE_TYPES = ["Estudios", "Notas"];

const isSuccessResponse = (response) => response.ok;

const Tramites = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [studentId, setStudentId] = useState(INITIAL_STUDENT_ID);
  const [certificateType, setCertificateType] = useState("Estudios");

  // Retrieve API URL from environment variables
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api/tramites/certificados";

  const handleRequestCertificate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError(false);

    const trimmedStudentId = studentId.trim();
    const trimmedCertificateType = certificateType.trim();

    if (!trimmedStudentId || !trimmedCertificateType) {
      setError(true);
      setMessage("Completa el ID del estudiante y el tipo de certificado.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: trimmedStudentId,
          certificateType: trimmedCertificateType,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!isSuccessResponse(response)) {
        setError(true);
        setMessage(
          data.error || "No se pudo crear la solicitud de certificado.",
        );
        return;
      }

      setMessage("Solicitud de certificado creada con éxito.");
    } catch {
      setError(true);
      setMessage("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-content">
        <div
          className="page-container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <section
            data-testid="tramites-card"
            aria-label="Trámites Académicos"
            className="page-card"
            style={{ width: "100%", maxWidth: 460 }}
          >
            <h1 className="page-title">Trámites Académicos</h1>

            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              Solicita tu certificado de forma rápida y sin filas innecesarias.
            </p>

            <form onSubmit={handleRequestCertificate} className="page-form">
              <label className="page-field">
                <span className="page-label">ID del estudiante</span>
                <input
                  data-testid="tramites-student-id"
                  aria-label="ID del estudiante"
                  type="text"
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                  className="page-input"
                />
              </label>

              <label className="page-field">
                <span className="page-label">Tipo de certificado</span>
                <select
                  data-testid="tramites-certificate-type"
                  aria-label="Tipo de certificado"
                  value={certificateType}
                  onChange={(event) => setCertificateType(event.target.value)}
                  className="page-select"
                >
                  {CERTIFICATE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                data-testid="tramites-submit"
                aria-label="Solicitar certificado académico"
                disabled={loading}
                className="primary-button"
              >
                {loading
                  ? "Procesando..."
                  : "Solicitar Certificado de Estudios"}
              </button>
            </form>

            <button
              type="button"
              data-testid="tramites-back-dashboard"
              aria-label="Volver al dashboard"
              onClick={handleBackToDashboard}
              className="secondary-button"
              style={{ width: "100%", marginTop: 12 }}
            >
              Volver al dashboard
            </button>

            {message ? (
              <p
                data-testid="tramites-message"
                role={error ? "alert" : "status"}
                aria-live="polite"
                className={
                  error ? "alert alert--error" : "alert alert--success"
                }
                style={{ marginTop: 18, marginBottom: 0 }}
              >
                {message}
              </p>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Tramites;
