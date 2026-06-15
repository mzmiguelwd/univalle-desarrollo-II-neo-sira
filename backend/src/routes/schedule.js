const express = require("express");
const router = express.Router();
const Course = require("../models/Course.js");

// Enpoint GET /api/schedule/:userCode
router.get("/:usercode", async (req, res) => {
  try {
    const { usercode } = req.params;

    const courses = await Course.find({ usercode });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error obteniendo el tabulado:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor." });
  }
});

module.exports = router;
