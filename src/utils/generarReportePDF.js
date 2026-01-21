import jsPDF from "jspdf";

/* ===== Helpers visuales ===== */

const drawDivider = (doc, y) => {
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(14, y, 196, y);
};

const sectionTitle = (doc, text, y) => {
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(text.toUpperCase(), 14, y);
  drawDivider(doc, y + 2);
  return y + 10;
};

const metaText = (doc, label, value, y) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`${label}:`, 14, y);
  doc.setTextColor(0);
  doc.text(String(value), 60, y);
  return y + 6;
};

const agregarSeccionConteo = (doc, titulo, lista, y) => {
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(titulo.toUpperCase(), 14, y);
  y += 5;

  if (!lista || lista.length === 0) {
    doc.setTextColor(150);
    doc.text("Sin datos registrados", 18, y);
    return y + 6;
  }

  doc.setTextColor(0);
  lista.forEach((item) => {
    doc.text(item.etiqueta, 18, y);
    doc.text(String(item.total), 180, y, { align: "right" });
    y += 5;
  });

  return y + 4;
};

/* ===== PDF Principal ===== */

export const generarReportePDF = (reporte) => {
  const doc = new jsPDF();
  let y = 30;

  /* ===== Portada simple ===== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Reporte Trimestral", 14, y);

  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Resumen de actividades institucionales", 14, y);

  y += 12;
  drawDivider(doc, y);
  y += 10;

  /* ===== Metadata ===== */
  y = metaText(doc, "Año", reporte.anio, y);
  y = metaText(doc, "Trimestre", reporte.trimestre, y);

  y += 8;

  /* ===== TALLERES ===== */
  y = sectionTitle(doc, "Talleres", y);

  y = metaText(
    doc,
    "Total de talleres",
    reporte.talleres.totalActividades,
    y
  );
  y = metaText(
    doc,
    "Total de alumnos",
    reporte.talleres.totalPersonas,
    y
  );

  y += 6;
  y = agregarSeccionConteo(doc, "Por sexo", reporte.talleres.porSexo, y);
  y = agregarSeccionConteo(
    doc,
    "Por rango de edad",
    reporte.talleres.porRangoEdad,
    y
  );
  y = agregarSeccionConteo(doc, "Por país", reporte.talleres.porPais, y);
  y = agregarSeccionConteo(doc, "Por estado", reporte.talleres.porEstado, y);

  /* ===== Salto controlado ===== */
  if (y > 240) {
    doc.addPage();
    y = 30;
  }

  doc.setTextColor(100);
  /* ===== CONVOCATORIAS ===== */
  y = sectionTitle(doc, "Convocatorias", y);

  y = metaText(
    doc,
    "Total de convocatorias",
    reporte.convocatorias.totalActividades,
    y
  );
  y = metaText(
    doc,
    "Total de participantes",
    reporte.convocatorias.totalPersonas,
    y
  );

  y += 6;
  y = agregarSeccionConteo(
    doc,
    "Por sexo",
    reporte.convocatorias.porSexo,
    y
  );
  y = agregarSeccionConteo(
    doc,
    "Por rango de edad",
    reporte.convocatorias.porRangoEdad,
    y
  );
  y = agregarSeccionConteo(
    doc,
    "Por país",
    reporte.convocatorias.porPais,
    y
  );
  y = agregarSeccionConteo(
    doc,
    "Por estado",
    reporte.convocatorias.porEstado,
    y
  );

  /* ===== Footer sutil ===== */
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "Documento generado automáticamente",
    105,
    290,
    { align: "center" }
  );

  doc.save(
    `reporte_trimestral_${reporte.anio}_T${reporte.trimestre}.pdf`
  );
};
