import jsPDF from "jspdf";
import "jspdf-autotable";

export const generarConstancia = async (taller, docente, alumno) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  // Fondo base
  doc.setFillColor(245, 245, 250);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Fondo con opacidad
  const fondo = await loadImageWithOpacity("/fondoConsta.png", 1);
  doc.addImage(fondo, "PNG", 0, 0, pageWidth, pageHeight);

  // Logo centrado
  const logo = await loadImage("/LOGO_CASA.png");
  doc.addImage(logo, "PNG", centerX - 25, 15, 50, 50);

  // Título
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CONSTANCIA DE PARTICIPACIÓN", centerX, 70, { align: "center" });

  // Texto intro
  doc.setFont("Times", "italic");
  doc.setFontSize(14);
  doc.text(
    "El Centro de las Artes de San Agustín extiende la presente constancia a:",
    centerX,
    90,
    { align: "center", maxWidth: pageWidth - 60 }
  );

  // Nombre alumno
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(24);
  doc.text(`${alumno.nombre} ${alumno.apellidos}`, centerX, 110, {
    align: "center",
  });

  // Participación
  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text(`Por su destacada participación en el ${taller.tipo}`, centerX, 130, {
    align: "center",
    maxWidth: pageWidth - 60,
  });

  // Taller
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(19);
  doc.text(`${taller.titulo}`, centerX, 150, {
    align: "center",
    maxWidth: pageWidth - 60,
  });

  // Docente
  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text("Impartido por:", centerX, 170, { align: "center" });

  doc.setFont("Times", "bolditalic");
  doc.setFontSize(17);
  doc.text(
    `${docente.nombre} ${docente.apellidos}`,
    centerX,
    182,
    { align: "center" }
  );

  // Periodo
  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text(
    `Periodo: ${taller.fechaInicioTaller}  a  ${taller.fechaCierreTaller}`,
    centerX,
    200,
    { align: "center" }
  );

  // ===== FIRMA ABAJO DERECHA =====
  const firma = await loadImage("/FIRMA_DIRECTOR.png");

  const firmaWidth = 55;
  const firmaHeight = 28;
  const marginRight = 25;
  const marginBottom = 25;

  const firmaX = pageWidth - firmaWidth - marginRight;
  const firmaY = pageHeight - firmaHeight - marginBottom;

  doc.addImage(firma, "PNG", firmaX, firmaY, firmaWidth, firmaHeight);

  // Texto director debajo de firma (alineado derecha)
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.text(
    "Director del Centro de las Artes",
    firmaX + firmaWidth / 2,
    firmaY + firmaHeight + 8,
    { align: "center" }
  );
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.text(
    "de San Agustín",
    firmaX + firmaWidth / 2,
    firmaY + firmaHeight + 15,
    { align: "center" }
  );

  // Lugar centrado al final
  doc.setFont("Times", "italic");
  doc.setFontSize(12);
  doc.text("San Agustín Etla, Oaxaca.", centerX, pageHeight - 10, {
    align: "center",
  });

  doc.save(`Constancia_${alumno.nombre}.pdf`);
};


// -------- CARGA NORMAL ----------
const loadImage = async (url) => {
  const blob = await fetch(url).then((res) => res.blob());
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};


// -------- OPACIDAD SIMULADA ----------
const loadImageWithOpacity = async (url, opacity = 0.15) => {
  const img = new Image();
  img.src = url;

  await new Promise((res) => (img.onload = res));

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.globalAlpha = opacity;
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL("image/png");
};
