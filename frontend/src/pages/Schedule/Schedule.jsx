import { useState, useEffect } from "react";

const Schedule = () => {
  const usercode = localStorage.getItem("userCode");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const response = await fetch(`/api/schedule/${usercode}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setCourses(data.data);
        } else {
          setError(data.error || "No se pudo cargar el tabulado.");
        }
      } catch (error) {
        setError("Error de conexión con el servidor.");
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

  if (loading) return <div>Cargando tu tabulado...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

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
            // Retornamos el curso y también los detalles de este bloque de horario específico
            return { courseDetails: course, scheduleDetails: scheduleItem };
          }
        }
      }
    }
    return null;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Mi Tabulado y Horario Semanal</h2>

      {/* SECCIÓN 2: El Resumen Oficial */}
      <div>
        <h3>Resumen de Asignaturas Matriculadas</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "2px solid #333",
                backgroundColor: "#f9f9f9",
              }}
            >
              <th style={{ padding: "10px" }}>Código</th>
              <th style={{ padding: "10px" }}>Grupo</th>
              <th style={{ padding: "10px" }}>Asignatura</th>
              <th style={{ padding: "10px" }}>Tipo</th>
              <th style={{ padding: "10px" }}>Créditos</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{course.code}</td>
                <td style={{ padding: "10px" }}>{course.group}</td>
                <td style={{ padding: "10px" }}>{course.name}</td>
                <td style={{ padding: "10px" }}>{course.type}</td>
                <td style={{ padding: "10px" }}>{course.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECCIÓN 1: La Cuadrícula Visual */}
      <div style={{ marginBottom: "40px", overflowX: "auto" }}>
        <h3>Horario Gráfico</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Hora
              </th>
              {weekDays.map((dia) => (
                <th
                  key={dia}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hora) => (
              <tr key={hora}>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {hora}
                </td>
                {weekDays.map((dia) => {
                  const result = getClassForSlot(dia, hora);
                  return (
                    <td
                      key={`${dia}-${hora}`}
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        backgroundColor: result ? "#e6f7ff" : "white",
                        color: result ? "#0050b3" : "inherit",
                        verticalAlign: "top",
                      }}
                    >
                      {result ? (
                        <div style={{ fontSize: "0.85em", lineHeight: "1.4" }}>
                          <strong>{result.courseDetails.name}</strong>
                          <br />
                          Gr: {result.courseDetails.group}
                          <br />
                          <span style={{ fontSize: "0.9em", color: "#555" }}>
                            Edificio: {result.scheduleDetails.academicBuilding}
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
    </div>
  );
};

export default Schedule;
