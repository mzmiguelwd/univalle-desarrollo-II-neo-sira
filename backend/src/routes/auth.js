const express = require("express");
const router = express.Router();
const User = require("../models/User");

const isValidUserCode = (value) => typeof value === "string" && /^[A-Za-z0-9-]+$/.test(value);

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const usercode = typeof req.body.usercode === "string" ? req.body.usercode.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!usercode || !password) {
      return res.status(400).json({
        success: false,
        error: "El 'Código' y la 'Contraseña' son obligatorios.",
      });
    }

    if (!isValidUserCode(usercode)) {
      return res.status(400).json({
        success: false,
        error: "Código de usuario inválido.",
      });
    }

    const user = await User.findOne({ usercode });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Credenciales inválidas.",
      });
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
    res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;