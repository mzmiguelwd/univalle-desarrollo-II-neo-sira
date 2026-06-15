const express = require("express");
const {
  createCertificateRequest,
} = require("../controllers/certificateRequestController");

const router = express.Router();

// POST /api/tramites/certificados
router.post("/certificados", createCertificateRequest);

module.exports = router;
