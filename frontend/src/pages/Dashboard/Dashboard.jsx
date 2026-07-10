import "./Dashboard.css";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  const userName = localStorage.getItem("userName") || "Estudiante";

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-content">
        <div className="welcome-card">
          <span className="welcome-icon">🎓</span>
          <h1>¡Bienvenido, {userName}!</h1>
          <p className="welcome-message">
            Esta es tu plataforma Neo-SIRA. Desde aquí puedes gestionar tus
            actividades académicas, consultar calificaciones y realizar tus
            trámites administrativos de forma centralizada.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
