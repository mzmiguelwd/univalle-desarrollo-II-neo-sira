const request = require("supertest");
const app = require("../src/app");
const CertificateRequest = require("../src/models/CertificateRequest");
const {
  getStudentId,
} = require("../src/controllers/certificateRequestController");

jest.mock("../src/models/CertificateRequest");

describe("POST /api/tramites/certificados", () => {
  // 🤐 Apaga por completo console.error antes de arrancar los tests de este archivo
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  // 🔊 Restaura el comportamiento original de la consola al finalizar todo
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debe retornar 400 si no se puede identificar al estudiante", async () => {
    const response = await request(app)
      .post("/api/tramites/certificados")
      .send({ certificateType: "Estudios" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("No se pudo identificar al estudiante.");
  });

  test("Debe retornar 400 si el tipo de certificado no es válido", async () => {
    const response = await request(app)
      .post("/api/tramites/certificados")
      .send({ studentId: "2020001", certificateType: "Matrícula" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Tipo de certificado inválido.");
  });

  test("Debe crear la solicitud con estado Pendiente (ID desde body.studentId)", async () => {
    CertificateRequest.create.mockResolvedValue({
      _id: "req-1",
      studentId: "2020001",
      certificateType: "Estudios",
      status: "Pendiente",
    });

    const response = await request(app)
      .post("/api/tramites/certificados")
      .send({ studentId: "2020001", certificateType: "Estudios" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.studentId).toBe("2020001");
  });

  // 🔥 NUEVO TEST 1: Cubre el camino de req.body.userId (Líneas 18-22)
  test("Debe crear la solicitud si el ID viene en body.userId", async () => {
    CertificateRequest.create.mockResolvedValue({
      _id: "req-2",
      studentId: "3030002",
      certificateType: "Notas",
      status: "Pendiente",
    });

    const response = await request(app)
      .post("/api/tramites/certificados")
      .send({ userId: "3030002", certificateType: "Notas" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  // 🔥 NUEVO TEST 2: Valida que maneje strings no limpios (Línea 18-22 del trim)
  test("Debe limpiar espacios en blanco del studentId y certificateType", async () => {
    CertificateRequest.create.mockResolvedValue({
      _id: "req-3",
      studentId: "4040003",
      certificateType: "Estudios",
      status: "Pendiente",
    });

    const response = await request(app)
      .post("/api/tramites/certificados")
      .send({ studentId: "   4040003   ", certificateType: "  Estudios  " });

    expect(response.status).toBe(201);
    expect(CertificateRequest.create).toHaveBeenCalledWith({
      studentId: "4040003",
      certificateType: "Estudios",
      status: "Pendiente",
    });
  });

  // 🔥 NUEVO TEST 3: Retorna 500 si ocurre un error inesperado (Bloque catch)
  test("Debe retornar 500 si ocurre un error inesperado en el servidor", async () => {
    CertificateRequest.create.mockRejectedValue(
      new Error("Error interno de la base de datos"),
    );

    const response = await request(app)
      .post("/api/tramites/certificados")
      .send({ studentId: "2020001", certificateType: "Estudios" });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Error interno del servidor.");
  });

  describe("Pruebas de la función auxiliar getStudentId", () => {
    test("Debe extraer el ID desde req.user.studentId", () => {
      const req = { user: { studentId: "USER-123" } };
      expect(getStudentId(req)).toBe("USER-123");
    });

    test("Debe extraer el ID desde req.studentId", () => {
      const req = { studentId: "REQ-123" };
      expect(getStudentId(req)).toBe("REQ-123");
    });

    test("Debe retornar vacío si no hay ningún ID válido", () => {
      const req = { body: {} };
      expect(getStudentId(req)).toBe("");
    });
  });

  // 🔥 SOLUCIÓN PARA LAS LÍNEAS 18-22: Simulamos que envían números en lugar de strings
  test("Debe retornar 400 si los campos no son tipo string", async () => {
    const response = await request(app)
      .post("/api/tramites/certificados")
      // Enviamos números en vez de texto, esto fallará la validación typeof === "string"
      .send({ studentId: 12345, certificateType: 999 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Debe retornar 500 si ocurre un error inesperado en el servidor", async () => {
    // Apagamos la consola temporalmente para este test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    CertificateRequest.create.mockRejectedValue(
      new Error("Error interno de la base de datos"),
    );

    const response = await request(app)
      .post("/api/tramites/certificados")
      .send({ studentId: "2020001", certificateType: "Estudios" });

    expect(response.status).toBe(500);

    // Restauramos la consola
    consoleSpy.mockRestore();
  });
});
