import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const API_BASE = "";

function gradeColor(grade) {
  if (grade >= 4.5) return { text: "#1a7a4a", bg: "#eaf3de" };
  if (grade >= 3.5) return { text: "#185FA5", bg: "#E6F1FB" };
  if (grade >= 3) return { text: "#854F0B", bg: "#FAEEDA" };
  return { text: "#A32D2D", bg: "#FCEBEB" };
}

function gradeLabel(grade) {
  if (grade >= 4.5) return "Excelente";
  if (grade >= 3.5) return "Bueno";
  if (grade >= 3) return "Regular";
  return "Insuficiente";
}

function GradeBar({ grade }) {
  const safeGrade = typeof grade === "number" ? grade : 0;
  const { text } = gradeColor(safeGrade);
  const pct = ((safeGrade / 5) * 100).toFixed(1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: text, borderRadius: 99 }} />
      </div>
      <span style={{ fontWeight: 500, fontSize: 14, color: text, minWidth: 28, textAlign: "right" }}>
        {safeGrade.toFixed(1)}
      </span>
    </div>
  );
}

GradeBar.propTypes = {
  grade: PropTypes.number.isRequired,
};

export default function Calificaciones() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSem, setActiveSem] = useState(0);

  const userCode = localStorage.getItem("userCode");
  const storedName = localStorage.getItem("userName");

  const isValidUserCode = (value) => typeof value === "string" && /^[A-Za-z0-9-]+$/.test(value);

  useEffect(() => {
    if (!userCode || !isValidUserCode(userCode)) {
      setError("Por favor inicia sesión con un usuario válido para ver tus calificaciones.");
      setLoading(false);
      return;
    }

    const safeUserCode = encodeURIComponent(userCode);
    fetch(`${API_BASE}/api/grades/${safeUserCode}`)
      .then((r) => {
        if (!r.ok) throw new Error("No se encontraron calificaciones");
        return r.json();
      })
      .then((data) => {
        setStudent(data);
        setActiveSem(data.semesters.length - 1);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [userCode]);


  if (loading) {
    return (
      <div style={s.center}>
        <p style={{ color: "#64748b" }}>Cargando calificaciones…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.center}>
        <p style={{ color: "#dc2626" }}>⚠ {error}</p>
      </div>
    );
  }

  const { semesters } = student;
  const studentName = student.studentName || storedName || "Estudiante";
  const current = semesters[activeSem];
  const semAvg = current.average;
  const globalAvg = semesters.reduce((acc, sem) => acc + sem.average, 0) / semesters.length;
  const gc = gradeColor(globalAvg);

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Mis Calificaciones</h1>
          <p style={s.subtitle}>{studentName} · {userCode}</p>
        </div>
        <div style={s.avgBadge}>
          <span style={s.avgLabel}>Promedio acumulado</span>
          <span style={{ ...s.avgValue, color: gc.text }}>{globalAvg.toFixed(2)}</span>
        </div>
      </div>

      {/* Tabs de semestres */}
      <div style={s.tabsGrid}>
        {semesters.map((sem, i) => {
          const c = gradeColor(sem.average);
          const isActive = i === activeSem;
          return (
            <button
              key={sem.semester}
              onClick={() => setActiveSem(i)}
              style={{
                ...s.tab,
                border: isActive ? `1.5px solid ${c.text}` : "1px solid #e2e8f0",
                background: isActive ? "#fff" : "#f8fafc",
              }}
            >
              <span style={s.tabSemLabel}>Semestre</span>
              <span style={s.tabSemName}>{sem.semester}</span>
              <span style={{ ...s.tabAvg, color: c.text }}>{sem.average.toFixed(2)}</span>
            </button>
          );
        })}
      </div>

      {/* Panel detalle */}
      <div style={s.panel}>
        <div style={s.panelHeader}>
          <div>
            <p style={s.panelTitle}>Semestre {current.semester}</p>
            <p style={s.panelSub}>{current.subjects.length} materias</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={s.panelSub}>Promedio semestre</p>
            <p style={{ ...s.panelAvg, color: gradeColor(semAvg).text }}>
              {semAvg.toFixed(2)}
            </p>
          </div>
        </div>

        <table style={s.table}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ ...s.th, width: 40 }}>#</th>
              <th style={{ ...s.th, textAlign: "left" }}>Materia</th>
              <th style={{ ...s.th, minWidth: 160 }}>Nota</th>
              <th style={s.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {current.subjects.map((subj, i) => {
              const c = gradeColor(subj.grade);
              return (
                <tr key={subj.name} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...s.td, color: "#94a3b8", textAlign: "center" }}>{i + 1}</td>
                  <td style={{ ...s.td, color: "#1e293b", fontWeight: 400 }}>{subj.name}</td>
                  <td style={s.td}><GradeBar grade={subj.grade} /></td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: c.bg, color: c.text, fontWeight: 500, whiteSpace: "nowrap" }}>
                      {gradeLabel(subj.grade)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 780, margin: "0 auto", padding: "32px 16px", fontFamily: "Inter, system-ui, sans-serif" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", height: 200 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 },
  title: { margin: 0, fontSize: 24, fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: "4px 0 0", fontSize: 13, color: "#64748b" },
  avgBadge: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 18px", textAlign: "right" },
  avgLabel: { display: "block", fontSize: 11, color: "#94a3b8", marginBottom: 2 },
  avgValue: { display: "block", fontSize: 26, fontWeight: 700 },
  tabsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 },
  tab: { cursor: "pointer", borderRadius: 10, padding: "12px 8px", textAlign: "center", display: "flex", flexDirection: "column", gap: 3, transition: "all 0.15s" },
  tabSemLabel: { fontSize: 11, color: "#94a3b8" },
  tabSemName: { fontSize: 14, fontWeight: 600, color: "#1e293b" },
  tabAvg: { fontSize: 18, fontWeight: 700 },
  panel: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap", gap: 8 },
  panelTitle: { margin: 0, fontSize: 16, fontWeight: 600, color: "#1e293b" },
  panelSub: { margin: 0, fontSize: 12, color: "#94a3b8" },
  panelAvg: { margin: 0, fontSize: 22, fontWeight: 700 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center", borderBottom: "1px solid #f1f5f9" },
  td: { padding: "13px 16px", fontSize: 14, color: "#475569" },
};
