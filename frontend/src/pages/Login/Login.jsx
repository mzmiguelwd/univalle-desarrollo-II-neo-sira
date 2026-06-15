import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usercode, setUsercode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!usercode || !password) {
      setError("Por favor, ingresa usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usercode, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("userCode", data.data.usercode);
        localStorage.setItem("userName", data.data.name);
        navigate("/dashboard");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ maxWidth: "300px", margin: "50px auto" }}
    >
      <h2>Iniciar Sesión en Neo-SIRA</h2>

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Código de Usuario"
          value={usercode}
          onChange={(e) => setUsercode(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verificando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
};

export default Login;
