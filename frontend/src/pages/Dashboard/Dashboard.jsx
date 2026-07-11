import Navbar from "../../components/Navbar";
import "../sharedPageStyles.css";

const Dashboard = () => {
  const userName = localStorage.getItem("userName") || "Estudiante";

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-content">
        <div className="page-container">
          <section className="page-card dashboard-card">
            <span className="dashboard-icon">🎓</span>
            <h1 className="page-title">¡Bienvenido, {userName}!</h1>
            <p className="dashboard-message">
              Esta es tu plataforma Neo-SIRA. Desde aquí puedes gestionar tus
              actividades académicas, consultar calificaciones y realizar tus
              trámites administrativos de forma centralizada.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
