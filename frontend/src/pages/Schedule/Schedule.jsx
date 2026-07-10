import { useState, useEffect } from "react";

import Navbar from "../../components/Navbar";
import "../sharedPageStyles.css";

const Schedule = () => {
  const usercode = localStorage.getItem("userCode");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "";

  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const hours = Array.from({ length: 16 }, (_, i) => `${7 + i}:00`);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${API_URL}/api/schedule/${usercode}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setCourses(data.data);
        } else {
          setError(data.error || "No se pudo cargar el tabulado.");
        }
      } catch (fetchError) {
        setError("Error de conexión con el servidor.");
        console.log("Error de conexión con el servidor:", fetchError);
      } finally {
        setLoading(false);
      }
    };

    if (usercode) {
      fetchSchedule();
    } else {
      setError("No se encontró sesión de usuario. Por favor, inicia sesión.");
      setLoading(false);
    }
  }, [usercode]);

  if (loading) {
    return (
      <div className="page-center">
        <div className="status-card">
          <p className="status-text">Cargando tu tabulado...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <div className="status-card">
          <p className="status-text status-text--error">{error}</p>
        </div>
      </div>
    );
  }

  const getClassForSlot = (day, hour) => {
    if (!courses || courses.length === 0) return null;

    for (const course of courses) {
      if (course.schedule && Array.isArray(course.schedule)) {
        for (const scheduleItem of course.schedule) {
          const courseStart = Number.parseInt(
            scheduleItem.initialHour.split(":")[0],
          );
          const duration =
            Number.parseInt(scheduleItem.finalHour.split(":")[0]) - courseStart;

          if (
            scheduleItem.day === day &&
            courseStart <= Number.parseInt(hour) &&
            Number.parseInt(hour) < courseStart + duration
          ) {
            return { courseDetails: course, scheduleDetails: scheduleItem };
          }
        }
      }
    }

    return null;
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-content">
        <div className="page-container">
          <div className="page-hero">
            <div>
              <h1 className="page-title">Mi Tabulado y Horario Semanal</h1>
              <p className="page-subtitle">
                Consulta el resumen de asignaturas y la cuadrícula semanal con
                la identidad visual institucional.
              </p>
            </div>
          </div>

          <section className="table-card" style={{ marginBottom: 28 }}>
            <div style={{ padding: "24px 24px 16px" }}>
              <h3 className="section-title">
                Resumen de Asignaturas Matriculadas
              </h3>
              <p className="section-copy">
                Información oficial del periodo activo.
              </p>
            </div>
            <div className="table-scroll">
              <table
                className="institution-table"
                style={{ textAlign: "left" }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Código</th>
                    <th>Grupo</th>
                    <th style={{ textAlign: "left" }}>Asignatura</th>
                    <th>Tipo</th>
                    <th>Créditos</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td style={{ textAlign: "left" }}>{course.code}</td>
                      <td style={{ textAlign: "center" }}>{course.group}</td>
                      <td style={{ textAlign: "left", fontWeight: 500 }}>
                        {course.name}
                      </td>
                      <td style={{ textAlign: "center" }}>{course.type}</td>
                      <td style={{ textAlign: "center" }}>{course.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="table-card">
            <div style={{ padding: "24px 24px 16px" }}>
              <h3 className="section-title">Horario Gráfico</h3>
              <p className="section-copy">
                Bloques semanales con referencia de edificio y salón.
              </p>
            </div>
            <div className="table-scroll">
              <table
                className="institution-table"
                style={{ textAlign: "center" }}
              >
                <thead>
                  <tr>
                    <th>Hora</th>
                    {weekDays.map((dia) => (
                      <th key={dia}>{dia}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hours.map((hora) => (
                    <tr key={hora}>
                      <td style={{ fontWeight: 700, color: "#1e293b" }}>
                        {hora}
                      </td>
                      {weekDays.map((dia) => {
                        const result = getClassForSlot(dia, hora);
                        return (
                          <td
                            key={`${dia}-${hora}`}
                            style={{
                              backgroundColor: result ? "#fff1f1" : "#ffffff",
                              color: result ? "#7f1d1d" : "#475569",
                              verticalAlign: "top",
                            }}
                          >
                            {result ? (
                              <div
                                style={{
                                  fontSize: "0.85em",
                                  lineHeight: "1.5",
                                }}
                              >
                                <strong>{result.courseDetails.name}</strong>
                                <br />
                                Gr: {result.courseDetails.group}
                                <br />
                                <span
                                  style={{
                                    fontSize: "0.9em",
                                    color: "#64748b",
                                  }}
                                >
                                  Edificio:{" "}
                                  {result.scheduleDetails.academicBuilding}
                                  <br />
                                  Salón: {result.scheduleDetails.classroom}
                                </span>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
