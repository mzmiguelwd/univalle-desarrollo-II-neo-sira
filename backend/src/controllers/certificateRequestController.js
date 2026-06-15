const CertificateRequest = require("../models/CertificateRequest");

const ALLOWED_CERTIFICATE_TYPES = ["Estudios", "Notas"];

const getStudentId = (req) =>
  req.user?.studentId ||
  req.studentId ||
  req.body.studentId ||
  req.body.userId ||
  "";

const isValidCertificateType = (value) =>
  ALLOWED_CERTIFICATE_TYPES.includes(value);

const createCertificateRequest = async (req, res) => {
  try {
    const studentId =
      typeof getStudentId(req) === "string" ? getStudentId(req).trim() : "";
    const certificateType =
      typeof req.body.certificateType === "string"
        ? req.body.certificateType.trim()
        : "";

    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: "No se pudo identificar al estudiante.",
      });
    }

    if (!isValidCertificateType(certificateType)) {
      return res.status(400).json({
        success: false,
        error: "Tipo de certificado inválido.",
      });
    }

    const certificateRequest = await CertificateRequest.create({
      studentId,
      certificateType,
      status: "Pendiente",
    });

    return res.status(201).json({
      success: true,
      message: "Solicitud de certificado creada con éxito.",
      data: {
        id: certificateRequest._id,
        studentId: certificateRequest.studentId,
        certificateType: certificateRequest.certificateType,
        status: certificateRequest.status,
      },
    });
  } catch (error) {
    console.error("Error creating certificate request:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor.",
    });
  }
};

module.exports = {
  createCertificateRequest,
  getStudentId,
  isValidCertificateType,
};
