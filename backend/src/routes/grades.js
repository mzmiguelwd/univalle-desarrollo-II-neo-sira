const express = require('express');
const router = express.Router();
const Grades = require('../models/Grades');

// GET /api/grades/:userCode
router.get('/:userCode', async (req, res) => {
  try {
    const student = await Grades.findOne({ userCode: req.params.userCode });
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;