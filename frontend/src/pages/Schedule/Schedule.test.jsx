import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Schedule from "./Schedule";

// Mock the browser's localStorage variable
const mockGetItem = jest.fn();
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: mockGetItem,
  },
  writable: true,
});

// Mock the fetch function to simulate API responses
global.fetch = jest.fn();

describe("Componente Schedule", () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Simulate that user "2415330-2724" is logged in
    mockGetItem.mockReturnValue("2415330-2724");
  });

  test("Debe mostrar el estado de carga inicialmente", () => {
    // Simulate a pending fetch by returning a promise that never resolves
    fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<Schedule />);

    expect(screen.getByText("Cargando tu tabulado...")).toBeInTheDocument();
  });

  test("Debe mostrar un mensaje de error si el servidor falla", async () => {
    // Simulate backend failure with error 404 or 500
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "No se pudo cargar el tabulado.",
      }),
    });

    render(<Schedule />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("No se pudo cargar el tabulado."),
      ).toBeInTheDocument();
    });
  });

  test("Debe renderizar la cuadricula y el resumen si los datos son correctos", async () => {
    // Simulate successful API response with mock schedule data
    const mockCourses = [
      {
        _id: "1",
        code: "750008C",
        group: "80",
        name: "ANÁLISIS Y DISEÑO DE ALGORITMOS I",
        type: "AP",
        credits: 3,
        schedule: [
          {
            day: "Lunes",
            initialHour: "18:00", // De 6 PM a 9 PM
            finalHour: "21:00",
            academicBuilding: "Edificio 320",
            classroom: "Laboratorio 3",
          },
        ],
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockCourses }),
    });

    render(<Schedule />);

    // Verificar que quite el "Cargando..." y muestre el título principal
    await waitFor(() => {
      expect(
        screen.getByText("Mi Tabulado y Horario Semanal"),
      ).toBeInTheDocument();
    });

    // Verificar la tabla de Resumen Inferior
    const courseNames = screen.getAllByText(
      "ANÁLISIS Y DISEÑO DE ALGORITMOS I",
    );
    expect(courseNames[0]).toBeInTheDocument();

    const courseCodes = screen.getAllByText("750008C");
    expect(courseCodes[0]).toBeInTheDocument();

    const buildings = screen.getAllByText(/Edificio 320/i);
    expect(buildings[0]).toBeInTheDocument();
    expect(buildings).toHaveLength(3);

    const classrooms = screen.getAllByText(/Laboratorio 3/i);
    expect(classrooms[0]).toBeInTheDocument();
    expect(classrooms).toHaveLength(3);
  });

  test("Debe mostrar error si el usuario no existe en localStorage", async () => {
    // Simulamos que el usuario NO ha iniciado sesión
    mockGetItem.mockReturnValue(null);

    // Simulamos un error del backend por falta de usercode
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "El código de usuario es requerido.",
      }),
    });

    render(<Schedule />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "No se encontró sesión de usuario. Por favor, inicia sesión.",
        ),
      ).toBeInTheDocument();
    });
  });
});
