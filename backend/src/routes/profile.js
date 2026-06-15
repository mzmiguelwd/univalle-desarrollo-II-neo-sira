const express = require("express");
const router = express.Router();

const User = require("../models/User");

const isValidUserCode = (value) =>
  typeof value === "string" && /^[A-Za-z0-9-]+$/.test(value);

// =======================
// GET PROFILE
// =======================
router.get("/:usercode", async (req, res) => {
  try {
    const usercode = req.params.usercode;

    if (!isValidUserCode(usercode)) {
      return res.status(400).json({
        success: false,
        error: "Código de usuario inválido.",
      });
    }

    const user = await User.findOne({ usercode }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor.",
    });
  }
});

// =======================
// UPDATE PROFILE
// =======================
router.put("/:usercode", async (req, res) => {
  try {
    const usercode = req.params.usercode;

    if (!isValidUserCode(usercode)) {
      return res.status(400).json({
        success: false,
        error: "Código de usuario inválido.",
      });
    }

    const {
      name,
      email,
      phone,
      address,
      residence_city,
      birth_city,
      district,
      birth_date,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !residence_city ||
      !birth_city ||
      !district ||
      !birth_date
    ) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios.",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { usercode },
      {
        name,
        email,
        phone,
        address,
        residence_city,
        birth_city,
        district,
        birth_date,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor.",
    });
  }
});

module.exports = router;