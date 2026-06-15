import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Calificaciones from "./pages/Calificaciones/Calificaciones.jsx";
import Tramites from "./pages/Tramites/Tramites.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calificaciones" element={<Calificaciones />} />
        <Route path="/tramites" element={<Tramites />} />
      </Routes>
    </Router>
  );
}

export default App;
