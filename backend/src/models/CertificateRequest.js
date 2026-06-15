const mongoose = require("mongoose");

const certificateRequestSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    certificateType: {
      type: String,
      required: true,
      enum: ["Estudios", "Notas"],
    },
    status: {
      type: String,
      required: true,
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CertificateRequest", certificateRequestSchema);
