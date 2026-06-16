const request = require("supertest");
const app = require("../src/app.js");
const User = require("../src/models/User.js");

jest.mock("../src/models/User.js");

// Usuario REAL del sistema (MongoDB)
const mockUser = {
  usercode: "2415330-2724",
  password: "2415330-2724",
  name: "JUAN MIGUEL MANJARREZ ZULUAGA",
  email: "prueba@correo.com",
  phone: "3012156657",
  address: "cra 43 #15-17",
  residence_city: "Cali",
  birth_city: "Cali",
  district: "Las Granjas",
  birth_date: new Date("1995-09-13"),
};

describe("USER PROFILE API", () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // GET PROFILE
  // =========================

  test("Debe retornar 400 si el usercode es inválido", async () => {
    const response = await request(app).get("/api/profile/invalid!code");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Código de usuario inválido.");
  });

  test("Debe retornar 404 si el usuario no existe", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app).get("/api/profile/0000000-0000");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Usuario no encontrado.");
  });

  test("Debe retornar 200 y el perfil del usuario real", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const response = await request(app).get("/api/profile/2415330-2724");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.usercode).toBe("2415330-2724");
    expect(response.body.data.name).toBe(mockUser.name);
    expect(response.body.data.email).toBe(mockUser.email);
  });

  test("Debe retornar 500 si ocurre error interno (GET)", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const response = await request(app).get("/api/profile/2415330-2724");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Error interno del servidor.");
  });

  // =========================
  // PUT PROFILE
  // =========================

  test("Debe retornar 400 si el usercode es inválido (PUT)", async () => {
    const response = await request(app)
      .put("/api/profile/invalid!code")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Código de usuario inválido.");
  });

  test("Debe retornar 400 si faltan campos obligatorios", async () => {
    const response = await request(app)
      .put("/api/profile/2415330-2724")
      .send({
        name: "Juan",
        email: "prueba@correo.com",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Todos los campos son obligatorios.");
  });

  test("Debe retornar 404 si el usuario no existe (PUT)", async () => {
    User.findOneAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .put("/api/profile/0000000-0000")
      .send({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        address: mockUser.address,
        residence_city: mockUser.residence_city,
        birth_city: mockUser.birth_city,
        district: mockUser.district,
        birth_date: "1995-09-13",
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Usuario no encontrado.");
  });

  test("Debe actualizar correctamente el usuario real", async () => {
    const updatedMock = {
      ...mockUser,
      phone: "3119999999",
      district: "Sur",
    };

    User.findOneAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(updatedMock),
    });

    const response = await request(app)
      .put("/api/profile/2415330-2724")
      .send({
        name: mockUser.name,
        email: mockUser.email,
        phone: "3119999999",
        address: mockUser.address,
        residence_city: mockUser.residence_city,
        birth_city: mockUser.birth_city,
        district: "Sur",
        birth_date: "1995-09-13",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Perfil actualizado correctamente."
    );
    expect(response.body.data.phone).toBe("3119999999");
  });

  test("Debe retornar 500 si ocurre error interno (PUT)", async () => {
    User.findOneAndUpdate.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const response = await request(app)
      .put("/api/profile/2415330-2724")
      .send({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        address: mockUser.address,
        residence_city: mockUser.residence_city,
        birth_city: mockUser.birth_city,
        district: mockUser.district,
        birth_date: "1995-09-13",
      });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Error interno del servidor.");
  });
});