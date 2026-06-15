import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Calificaciones from "./Calificaciones";

// Mock the fetch API to simulate server responses
global.fetch = jest.fn();

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

const mockStudentWithLowGrades = {
  userCode: "2415330-2724",
  studentName: "JUAN MIGUEL MANJARREZ ZULUAGA",
  semesters: [
    {
      semester: "2024-1",
      subjects: [
        { name: "Cálculo Diferencial", grade: 2.8 },
        { name: "Álgebra Lineal", grade: 3.2 },
        { name: "Lógica de Programación", grade: 3.5 },
        { name: "Inglés I", grade: 2.4 },
      ],
      average: 2.95,
    },
  ],
};

describe("Componente Calificaciones", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simulate that the user is logged in with a valid userCode
    localStorage.setItem("userCode", "2415330-2724");
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("Muestra el estado de carga mientras se obtienen los datos", () => {
    // Simulate a fetch that never resolves so we can see the loading state
    fetch.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Calificaciones />
      </MemoryRouter>,
    );

    expect(screen.getByText(/cargando calificaciones/i)).toBeInTheDocument();
  });

  test("Muestra el nombre del estudiante y sus semestres al cargar correctamente", async () => {
    // Simulate a successful response from the backend
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudent,
    });

    render(
      <MemoryRouter>
        <Calificaciones />
      </MemoryRouter>,
    );

    // waitFor is used to wait for the fetch promise to resolve and the component to update
    await waitFor(() => {
      expect(screen.getByText(/JUAN MIGUEL MANJARREZ ZULUAGA/i)).toBeInTheDocument();
    });

    expect(screen.getByText("2024-1")).toBeInTheDocument();
    expect(screen.getByText("2024-2")).toBeInTheDocument();
    expect(screen.getByText("2025-1")).toBeInTheDocument();
    expect(screen.getByText("2025-2")).toBeInTheDocument();
  });

  test("Muestra las materias del último semestre por defecto", async () => {
    // Simulate a successful response — the component should default to the last semester
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudent,
    });

    render(
      <MemoryRouter>
        <Calificaciones />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Ingeniería de Software")).toBeInTheDocument();
    });

    expect(screen.getByText("Sistemas Operativos")).toBeInTheDocument();
    expect(screen.getByText("Desarrollo Web")).toBeInTheDocument();
    expect(screen.getByText("Ética Profesional")).toBeInTheDocument();
  });

  test("Cambia las materias al seleccionar un semestre diferente", async () => {
    // Simulate a successful response from the backend
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudent,
    });

    render(
      <MemoryRouter>
        <Calificaciones />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("2024-1")).toBeInTheDocument();
    });

    // Click on the first semester tab
    fireEvent.click(screen.getByText("2024-1"));

    await waitFor(() => {
      expect(screen.getByText("Cálculo Diferencial")).toBeInTheDocument();
    });

    expect(screen.getByText("Álgebra Lineal")).toBeInTheDocument();
    expect(screen.getByText("Lógica de Programación")).toBeInTheDocument();
    expect(screen.getByText("Inglés I")).toBeInTheDocument();
  });

  test("Muestra un error si el estudiante no es encontrado en el backend", async () => {
    // Simulate a 404 response from the backend
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "No se encontraron calificaciones" }),
    });

    render(
      <MemoryRouter>
        <Calificaciones />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron calificaciones/i)).toBeInTheDocument();
    });
  });

  test("Muestra mensaje de inicio de sesión si no hay userCode en localStorage", async () => {
    localStorage.clear();

    render(
      <MemoryRouter>
        <Calificaciones />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/por favor inicia sesión para ver tus calificaciones/i)).toBeInTheDocument();
    });
  });

  test("Muestra etiquetas Regular e Insuficiente para calificaciones bajas", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudentWithLowGrades,
    });

    render(
      <MemoryRouter>
        <Calificaciones />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/insuficiente/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/regular/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Cálculo Diferencial")).toBeInTheDocument();
    expect(screen.getByText("Álgebra Lineal")).toBeInTheDocument();
  });
});