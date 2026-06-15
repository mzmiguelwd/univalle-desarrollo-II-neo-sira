import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tramites from "./Tramites";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

globalThis.fetch = jest.fn();

describe("Componente Tramites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra el estado de carga y el mensaje de éxito al crear la solicitud", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Solicitud de certificado creada con éxito.",
      }),
    });

    render(<Tramites />);

    fireEvent.change(screen.getByTestId("tramites-student-id"), {
      target: { value: "2020456" },
    });
    fireEvent.change(screen.getByTestId("tramites-certificate-type"), {
      target: { value: "Notas" },
    });

    const button = screen.getByTestId("tramites-submit");
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Procesando...");

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/tramites/certificados",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            studentId: "2020456",
            certificateType: "Notas",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("tramites-message")).toHaveTextContent(
        "Solicitud de certificado creada con éxito.",
      );
    });
  });

  test("muestra una validación si faltan datos del formulario", () => {
    render(<Tramites />);

    fireEvent.change(screen.getByTestId("tramites-student-id"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByTestId("tramites-submit"));

    expect(screen.getByTestId("tramites-message")).toHaveTextContent(
      "Completa el ID del estudiante y el tipo de certificado.",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  test("muestra error si el backend responde con fallo", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Tipo de certificado inválido." }),
    });

    render(<Tramites />);

    fireEvent.change(screen.getByTestId("tramites-student-id"), {
      target: { value: "2020456" },
    });
    fireEvent.change(screen.getByTestId("tramites-certificate-type"), {
      target: { value: "Notas" },
    });

    fireEvent.click(screen.getByTestId("tramites-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("tramites-message")).toHaveTextContent(
        "Tipo de certificado inválido.",
      );
    });
  });

  test("muestra error si falla la conexión", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Tramites />);

    fireEvent.change(screen.getByTestId("tramites-student-id"), {
      target: { value: "2020456" },
    });

    fireEvent.click(screen.getByTestId("tramites-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("tramites-message")).toHaveTextContent(
        "Error de conexión con el servidor.",
      );
    });
  });

  test("permite volver al dashboard", () => {
    render(<Tramites />);

    fireEvent.click(screen.getByTestId("tramites-back-dashboard"));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
