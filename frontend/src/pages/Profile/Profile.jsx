import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Navbar from "../../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "";

function Profile() {
  const rawUserCode = localStorage.getItem("userCode");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    residence_city: "",
    birth_city: "",
    district: "",
    birth_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isValidUserCode = (value) =>
    typeof value === "string" && /^[A-Za-z0-9-]+$/.test(value);

  // 🔒 Sanitización explícita (clave para Sonar)
  const safeUserCode = isValidUserCode(rawUserCode) ? rawUserCode : null;

  const buildProfileUrl = (code) => {
    if (!isValidUserCode(code)) return null;
    return `${API_URL}/api/profile/${encodeURIComponent(code)}`;
  };

  // =========================
  // GET PROFILE
  // =========================
  useEffect(() => {
    if (!safeUserCode) {
      setError("Usuario inválido. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    const url = buildProfileUrl(safeUserCode);
    if (!url) {
      setError("Usuario inválido.");
      setLoading(false);
      return;
    }

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar el perfil");
        return r.json();
      })
      .then((data) => {
        if (!data.success) throw new Error(data.error);

        setForm({
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
          residence_city: data.data.residence_city || "",
          birth_city: data.data.birth_city || "",
          district: data.data.district || "",
          birth_date: data.data.birth_date
            ? data.data.birth_date.split("T")[0]
            : "",
        });

        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [safeUserCode]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!safeUserCode) {
      setError("Usuario inválido.");
      return;
    }

    const url = buildProfileUrl(safeUserCode);
    if (!url) {
      setError("Usuario inválido.");
      return;
    }

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      alert("Perfil actualizado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================
  // UI STATES
  // =========================
  if (loading) {
    return (
      <div style={s.center}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.center}>
        <p style={{ color: "red" }}>⚠ {error}</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div style={s.page}>
      <Navbar />
      <h1 style={s.title}>Mi Perfil</h1>

      <form onSubmit={handleSubmit} style={s.form}>
        <Input
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          label="Correo"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          label="Teléfono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          label="Dirección"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
        <Input
          label="Ciudad de residencia"
          name="residence_city"
          value={form.residence_city}
          onChange={handleChange}
        />
        <Input
          label="Ciudad de nacimiento"
          name="birth_city"
          value={form.birth_city}
          onChange={handleChange}
        />
        <Input
          label="Barrio de residencia"
          name="district"
          value={form.district}
          onChange={handleChange}
        />
        <Input
          label="Fecha de nacimiento"
          name="birth_date"
          type="date"
          value={form.birth_date}
          onChange={handleChange}
        />

        <button type="submit" style={s.button}>
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

// =========================
// INPUT COMPONENT
// =========================
function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input
        style={s.input}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// =========================
// PROP TYPES (FIX SONARQUBE)
// =========================
Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

// =========================
// STYLES
// =========================
const s = {
  page: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "30px 16px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: "#64748b",
  },
  input: {
    padding: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    padding: "10px",
    background: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  center: {
    display: "flex",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Profile;
