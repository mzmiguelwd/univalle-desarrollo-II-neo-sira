import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🎓 Bienvenido al Dashboard de Neo-SIRA</h1>
      <p>
        A partir de aquí, podrás gestionar tus cursos, revisar tus
        calificaciones y mucho más. ¡Explora las opciones disponibles y saca el
        máximo provecho de tu experiencia académica!
      </p>
      <button
        onClick={() => navigate("/calificaciones")}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        Ver calificaciones
      </button>
      <button
        onClick={() => navigate("/tramites")}
        style={{
          marginTop: 12,
          marginLeft: 8,
          padding: "10px 16px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          background: "#0f766e",
          color: "white",
          cursor: "pointer",
        }}
      >
        Ir a trámites
      </button>
    </div>
  );
};

export default Dashboard;
