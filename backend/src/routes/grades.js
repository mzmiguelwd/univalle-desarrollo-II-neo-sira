const express = require('express');
const router = express.Router();
const Grades = require('../models/Grades');

const isValidUserCode = (value) => typeof value === 'string' && /^[A-Za-z0-9-]+$/.test(value);

// GET /api/grades/:userCode
router.get('/:userCode', async (req, res) => {
  try {
    const userCode = req.params.userCode;
    if (!isValidUserCode(userCode)) {
      return res.status(400).json({ error: 'User code inválido' });
    }

    const student = await Grades.findOne({ userCode });
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