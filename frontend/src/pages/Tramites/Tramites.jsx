import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/tramites/certificados";

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <section
        data-testid="tramites-card"
        aria-label="Trámites Académicos"
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h1
          style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#0f172a" }}
        >
          Trámites Académicos
        </h1>

        <p
          style={{
            marginTop: 10,
            marginBottom: 24,
            color: "#475569",
            lineHeight: 1.5,
          }}
        >
          Solicita tu certificado de forma rápida y sin filas innecesarias.
        </p>

        <form
          onSubmit={handleRequestCertificate}
          style={{ display: "grid", gap: 14 }}
        >
          <label
            style={{ display: "grid", gap: 6, color: "#334155", fontSize: 14 }}
          >
            ID del estudiante
            <input
              data-testid="tramites-student-id"
              aria-label="ID del estudiante"
              type="text"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 15,
                outline: "none",
              }}
            />
          </label>

          <label
            style={{ display: "grid", gap: 6, color: "#334155", fontSize: 14 }}
          >
            Tipo de certificado
            <select
              data-testid="tramites-certificate-type"
              aria-label="Tipo de certificado"
              value={certificateType}
              onChange={(event) => setCertificateType(event.target.value)}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 15,
                outline: "none",
                background: "#fff",
              }}
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
            style={{
              width: "100%",
              border: "none",
              borderRadius: 12,
              padding: "14px 18px",
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#94a3b8" : "#2563eb",
              color: "#ffffff",
            }}
          >
            {loading ? "Procesando..." : "Solicitar Certificado de Estudios"}
          </button>
        </form>

        <button
          type="button"
          data-testid="tramites-back-dashboard"
          aria-label="Volver al dashboard"
          onClick={handleBackToDashboard}
          style={{
            width: "100%",
            marginTop: 12,
            border: "1px solid #cbd5e1",
            borderRadius: 12,
            padding: "13px 18px",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            background: "#f8fafc",
            color: "#0f172a",
          }}
        >
          Volver al dashboard
        </button>

        {message ? (
          <p
            data-testid="tramites-message"
            role={error ? "alert" : "status"}
            aria-live="polite"
            style={{
              marginTop: 18,
              marginBottom: 0,
              color: error ? "#b91c1c" : "#166534",
              background: error ? "#fef2f2" : "#f0fdf4",
              border: `1px solid ${error ? "#fecaca" : "#bbf7d0"}`,
              borderRadius: 12,
              padding: "12px 14px",
            }}
          >
            {message}
          </p>
        ) : null}
      </section>
    </div>
  );
};

export default Tramites;
