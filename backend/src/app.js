const express = require("express");
const User = require("./models/User.js");

const app = express();

// Security: Disable X-Powered-By header to hide technology stack
app.disable("x-powered-by");
app.use(express.json());

// Endpoint POST /api/login
app.post("/api/login", async (req, res) => {
  try {
    const { usercode, password } = req.body;

    if (!usercode || !password) {
      return res.status(400).json({
        success: false,
        error: "El 'Código' y la 'Contraseña' son obligatorios.",
      });
    }

    const user = await User.findOne({ usercode });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ success: false, error: "Credenciales inválidas." });
    }

    // Always return a consistent structure
    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso.",
      data: {
        usercode: user.usercode,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = app;
