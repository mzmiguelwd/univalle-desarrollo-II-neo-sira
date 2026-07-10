import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [usercode, setUsercode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || "";

  // Handle the authentication submission
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!usercode || !password) {
      setError("Por favor, ingresa usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usercode, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data on successful authentication
        localStorage.setItem("userCode", data.data.usercode);
        localStorage.setItem("userName", data.data.name);
        navigate("/dashboard");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
      console.log("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to quick-fill test credentials
  const fillTestCredentials = () => {
    setUsercode("2415330-2724");
    setPassword("2415330-2724");
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión en Neo-SIRA</h2>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label">Código de Usuario</label>
            <input
              type="text"
              className="login-input"
              placeholder="Código de Usuario"
              value={usercode}
              onChange={(e) => setUsercode(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <input
              type="password"
              className="login-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        <div className="test-credentials-hint">
          <p className="hint-title">¿Evaluando la aplicación?</p>
          <p className="hint-text">
            Usuario y Contraseña: <strong>2415330-2724</strong>
          </p>
          <button
            type="button"
            className="auto-fill-button"
            onClick={fillTestCredentials}
          >
            Autocompletar credenciales
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
