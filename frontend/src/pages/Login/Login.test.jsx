import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import Login from "./Login";

// Mock useNavigate from react-router-dom to test the navigation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Moch the fetch API to simulate server responses
global.fetch = jest.fn();

describe("Componente Login", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("Muestra un error si los campos están vacíos", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Por favor, ingresa usuario y contraseña",
    );
  });

  test("Muestra el error del backend si las credenciales son incorrectas", async () => {
    // Simulate a 401 response from the backend
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: "Credenciales inválidas." }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Código de Usuario"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    // waitFor is used to wait for the fetch promise to resolve and the component to update with the error message
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Credenciales inválidas.",
      );
    });
  });

  test("Redirige al dashboard si las credenciales son correctas", async () => {
    // Simulamos respuesta 200 exitosa del backend
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { usercode: "estudiante", name: "Estudiante de Prueba" },
      }),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Código de Usuario"), {
      target: { value: "estudiante" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
