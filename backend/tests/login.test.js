const request = require("supertest");
const app = require("../src/app.js");
const User = require("../src/models/User.js");

// Mock the User model so we don't have to interact with the actual database during testing
jest.mock("../src/models/User.js");

describe("POST /api/auth/login", () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  // Clear the mocks before each test so they don't interfere with each other
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debe retornar 400 si faltan credenciales (Código o Contraseña)", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ usercode: "estudiante" }); // Send it without the password

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(
      "El 'Código' y la 'Contraseña' son obligatorios.",
    );
  });

  test("Debe retornar 401 si el usuario no existe en la base de datos", async () => {
    // Simulate that the database didn't find any user with the given usercode
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ usercode: "fantasma", password: "123" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Credenciales inválidas.");
  });

  test("Debe retornar 401 si la contraseña es incorrecta", async () => {
    // Simulate that the database finds the user, but the real password is different
    User.findOne.mockResolvedValue({
      usercode: "estudiante",
      password: "passwordReal",
      name: "Estudiante de Prueba",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ usercode: "estudiante", password: "passwordEquivocada" });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Credenciales inválidas.");
  });

  test("Debe retornar 200 y los datos del usuario si el login es exitoso", async () => {
    // Simulate that the database finds the user and the password matches
    User.findOne.mockResolvedValue({
      usercode: "estudiante",
      password: "123456",
      name: "Estudiante de Prueba",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ usercode: "estudiante", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Inicio de sesión exitoso.");
    expect(response.body.data.usercode).toBe("estudiante");
    expect(response.body.data.name).toBe("Estudiante de Prueba");
  });

  test("Debe retornar 500 si ocurre un error interno del servidor (caída de BD)", async () => {
    // Simulate that the database throws an error when trying to find the user
    User.findOne.mockRejectedValue(new Error("Error de conexión"));

    const response = await request(app)
      .post("/api/auth/login")
      .send({ usercode: "estudiante", password: "123456" });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Error interno del servidor.");
  });
});
