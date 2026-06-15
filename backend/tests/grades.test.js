const request = require("supertest");
const app = require("../src/app.js");
const Grades = require("../src/models/Grades.js");

// Mock the Grades model so we don't have to interact with the actual database during testing
jest.mock("../src/models/Grades.js");

const mockStudent = {
  userCode: "2415330-2724",
  studentName: "JUAN MIGUEL MANJARREZ ZULUAGA",
  semesters: [
    {
      semester: "2024-1",
      subjects: [
        { name: "Cálculo Diferencial", grade: 3.8 },
        { name: "Álgebra Lineal", grade: 4.1 },
        { name: "Lógica de Programación", grade: 4.5 },
        { name: "Inglés I", grade: 4.0 },
      ],
      average: 4.1,
    },
    {
      semester: "2024-2",
      subjects: [
        { name: "Fundamentos de Programación", grade: 4.3 },
        { name: "Matemáticas Discretas", grade: 4.0 },
        { name: "Introducción al Desarrollo de Software", grade: 4.5 },
        { name: "Bases de Datos I", grade: 4.2 },
      ],
      average: 4.25,
    },
    {
      semester: "2025-1",
      subjects: [
        { name: "Programación Orientada a Objetos", grade: 4.7 },
        { name: "Estructuras de Datos", grade: 4.4 },
        { name: "Bases de Datos II", grade: 4.6 },
        { name: "Redes de Computadores", grade: 3.9 },
      ],
      average: 4.4,
    },
    {
      semester: "2025-2",
      subjects: [
        { name: "Ingeniería de Software", grade: 4.8 },
        { name: "Sistemas Operativos", grade: 4.2 },
        { name: "Desarrollo Web", grade: 4.9 },
        { name: "Ética Profesional", grade: 4.5 },
      ],
      average: 4.6,
    },
  ],
};

describe("GET /api/grades/:userCode", () => {
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

  test("Debe retornar 200 y las calificaciones del estudiante si el userCode existe", async () => {
    // Simulate that the database finds the student with the given userCode
    Grades.findOne.mockResolvedValue(mockStudent);

    const response = await request(app).get("/api/grades/2415330-2724");

    expect(response.status).toBe(200);
    expect(response.body.userCode).toBe("2415330-2724");
    expect(response.body.studentName).toBe("JUAN MIGUEL MANJARREZ ZULUAGA");
    expect(response.body.semesters).toHaveLength(4);
    expect(response.body.semesters[0].semester).toBe("2024-1");
    expect(response.body.semesters[0].subjects).toHaveLength(4);
    expect(response.body.semesters[0].average).toBe(4.1);
  });

  test("Debe retornar 404 si el estudiante no existe en la base de datos", async () => {
    // Simulate that the database didn't find any student with the given userCode
    Grades.findOne.mockResolvedValue(null);

    const response = await request(app).get("/api/grades/0000000-0000");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Estudiante no encontrado");
  });

  test("Debe retornar los 4 semestres con 4 materias cada uno", async () => {
    // Simulate that the database finds the student with complete semester data
    Grades.findOne.mockResolvedValue(mockStudent);

    const response = await request(app).get("/api/grades/2415330-2724");

    expect(response.status).toBe(200);
    response.body.semesters.forEach((sem) => {
      expect(sem.subjects).toHaveLength(4);
      expect(sem.average).toBeDefined();
    });
  });

  test("Debe retornar 500 si ocurre un error interno del servidor (caída de BD)", async () => {
    // Simulate that the database throws an error when trying to find the student
    Grades.findOne.mockRejectedValue(new Error("Error de conexión"));

    const response = await request(app).get("/api/grades/2415330-2724");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error del servidor");
  });
});