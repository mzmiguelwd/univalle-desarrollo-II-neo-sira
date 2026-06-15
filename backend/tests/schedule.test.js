const request = require("supertest");
const express = require("express");
const scheduleRouter = require("../src/routes/schedule.js");
const Course = require("../src/models/Course.js");

jest.mock("../src/models/Course.js");

const app = express();
app.use(express.json());
app.use("/api/schedule", scheduleRouter);

describe("Pruebas sobre el endpoint GET /api/schedule/:userCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debe retornar 200 y la lista de cursos si el usuario existe", async () => {
    // Simulamos los datos que devolvería MongoDB
    const mockCourses = [
      {
        code: "750008C",
        group: "80",
        name: "ANÁLISIS Y DISEÑO DE ALGORITMOS I",
        type: "AP",
        credits: 3,
        schedule: [
          {
            day: "Lunes",
            initialHour: "18:00",
            finalHour: "21:00",
            academicBuilding: "Edificio 320",
            classroom: "Laboratorio 3",
          },
        ],
      },
    ];

    // Le decimos al mock que cuando llamen a Course.find(), resuelva con nuestros mockCourses
    Course.find.mockResolvedValue(mockCourses);

    // Hacemos la petición simulada
    const response = await request(app).get("/api/schedule/2415330-2724");

    // Verificamos los resultados
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0].name).toBe(
      "ANÁLISIS Y DISEÑO DE ALGORITMOS I",
    );

    // Verificamos que Mongoose haya sido llamado con el usercode correcto
    expect(Course.find).toHaveBeenCalledWith({ usercode: "2415330-2724" });
  });

  test("Debe retornar 500 si hay un error en la base de datos", async () => {
    // Simulamos que la base de datos se cayó o arrojó un error
    Course.find.mockRejectedValue(new Error("Error de conexión a MongoDB"));

    // Guardamos el console.error original y lo mockeamos para no ensuciar la terminal del test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await request(app).get("/api/schedule/2415330-2724");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Error interno del servidor.");

    // Restauramos el console.error
    consoleSpy.mockRestore();
  });
});
