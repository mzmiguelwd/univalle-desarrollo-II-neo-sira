import { Link, useInRouterContext } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const inRouter = useInRouterContext();

  const handleLogout = () => {
    localStorage.clear();
    window.location.assign("/");
  };

  const NavItem = ({ to, className, children }) =>
    inRouter ? (
      <Link to={to} className={className}>
        {children}
      </Link>
    ) : (
      <a href={to} className={className}>
        {children}
      </a>
    );

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <NavItem to="/dashboard" className="brand-logo">
            Neo-SIRA
          </NavItem>
        </div>

        <div className="navbar-links">
          <NavItem to="/calificaciones" className="nav-link">
            Calificaciones
          </NavItem>
          <NavItem to="/schedule" className="nav-link">
            Tabulado
          </NavItem>
          <NavItem to="/tramites" className="nav-link">
            Trámites
          </NavItem>
          <NavItem to="/profile" className="nav-link">
            Mi Perfil
          </NavItem>
        </div>

        <div className="navbar-actions">
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
