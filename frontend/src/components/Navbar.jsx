import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-logo">
          Neo-SIRA
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/calificaciones" className="nav-link">
          Calificaciones
        </Link>
        <Link to="/schedule" className="nav-link">
          Tabulado
        </Link>
        <Link to="/tramites" className="nav-link">
          Trámites
        </Link>
        <Link to="/profile" className="nav-link">
          Mi Perfil
        </Link>
      </div>

      <div className="navbar-actions">
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
