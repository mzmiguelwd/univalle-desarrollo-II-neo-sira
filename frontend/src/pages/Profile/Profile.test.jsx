import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "./Profile";

global.fetch = jest.fn();
global.alert = jest.fn();

const mockUser = {
  success: true,
  data: {
    usercode: "2415330-2724",
    name: "JUAN MIGUEL MANJARREZ ZULUAGA",
    email: "prueba@correo.com",
    phone: "3012156657",
    address: "cra 43 #15-17",
    residence_city: "Cali",
    birth_city: "Cali",
    district: "Las Granjas",
    birth_date: "1995-09-13T00:00:00.000Z",
  },
};

describe("Componente Profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("userCode", "2415330-2724");
  });

  afterEach(() => {
    localStorage.clear();
  });

  // =========================
  // LOADING STATE
  // =========================
  test("Muestra estado de carga inicialmente", () => {
    fetch.mockImplementation(() => new Promise(() => {}));

    render(<Profile />);

    expect(screen.getByText(/cargando perfil/i)).toBeInTheDocument();
  });

  // =========================
  // GET SUCCESS
  // =========================
  test("Muestra los datos del usuario al cargar correctamente", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("JUAN MIGUEL MANJARREZ ZULUAGA")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("prueba@correo.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3012156657")).toBeInTheDocument();
  });

  // =========================
  // GET ERROR BACKEND
  // =========================
  test("Muestra error si el backend falla", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/no se pudo cargar el perfil/i)).toBeInTheDocument();
    });
  });

  // =========================
  // NO USERCODE
  // =========================
  test("Muestra error si no hay userCode", async () => {
    localStorage.clear();

    render(<Profile />);

    await waitFor(() => {
      expect(
        screen.getByText(/usuario inválido/i)
      ).toBeInTheDocument();
    });
  });

  // =========================
  // UPDATE PROFILE SUCCESS
  // =========================
  test("Permite actualizar el perfil correctamente", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: "Perfil actualizado correctamente",
          data: mockUser.data,
        }),
      });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("prueba@correo.com")).toBeInTheDocument();
    });

    const phoneInput = screen.getByDisplayValue("3012156657");
    fireEvent.change(phoneInput, {
      target: { name: "phone", value: "3119999999" },
    });

    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Perfil actualizado correctamente"
      );
    });
  });

  // =========================
  // UPDATE ERROR
  // =========================
  test("Muestra error si falla la actualización", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          error: "Error al actualizar",
        }),
      });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("prueba@correo.com")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Error al actualizar");
    });
  });
});