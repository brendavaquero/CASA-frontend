import jsPDF from "jspdf";
import "jspdf-autotable";

export const generarConstancia = async (
  taller,
  docente,
  alumno,
  instituciones = [],
  director
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  doc.setFillColor(245, 245, 250);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  const fondo = await loadImageWithOpacity("/fondoConsta.png", 1);
  //const fondo = await loadImageWithOpacity("/fondo2.png", 1);

  doc.addImage(fondo, "PNG", 0, 0, pageWidth, pageHeight);


  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CONSTANCIA DE PARTICIPACIÓN", centerX, 70, {
    align: "center",
  });


  doc.setFont("Times", "italic");
  doc.setFontSize(14);
  doc.text(
    "El Centro de las Artes de San Agustín extiende la presente constancia a:",
    centerX,
    90,
    { align: "center", maxWidth: pageWidth - 60 }
  );


  doc.setFont("Times", "bolditalic");
  doc.setFontSize(24);
  doc.text(`${alumno.nombre} ${alumno.apellidos}`, centerX, 110, {
    align: "center",
  });

  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text(
    `Por su destacada participación en el ${taller.tipo}`,
    centerX,
    130,
    { align: "center", maxWidth: pageWidth - 60 }
  );

  doc.setFont("Times", "bolditalic");
  doc.setFontSize(19);
  doc.text(`${taller.titulo}`, centerX, 150, {
    align: "center",
    maxWidth: pageWidth - 60,
  });

  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text("Impartido por:", centerX, 170, { align: "center" });

  doc.setFont("Times", "bolditalic");
  doc.setFontSize(17);
  doc.text(`${docente.nombre} ${docente.apellidos}`, centerX, 182, {
    align: "center",
  });

  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text(
    `Periodo: ${taller.fechaInicioTaller} a ${taller.fechaCierreTaller}`,
    centerX,
    200,
    { align: "center" }
  );


  if (instituciones.length > 0) {
    const logoSize = 22;
    const gap = 8;
    const totalWidth =
      instituciones.length * logoSize +
      (instituciones.length - 1) * gap;

    let startX = (pageWidth - totalWidth) / 2;
    const logosY = 25;

    for (const inst of instituciones) {
      if (!inst.logoUrl) continue;

      try {
        const logoUrl = inst.logoUrl.startsWith("http")
          ? inst.logoUrl
          : `http://localhost:8080${inst.logoUrl}`;

        const logo = await loadImage(logoUrl);
        doc.addImage(logo, "PNG", startX, logosY, logoSize, logoSize);
        startX += logoSize + gap;
      } catch (error) {
        console.warn("No se pudo cargar logo:", inst.nombre);
      }
    }
  }


  if (director?.firma) {
    try {
      const firmaUrl = director.firma.startsWith("http")
        ? director.firma
        : `http://localhost:8080${director.firma}`;

      const firma = await loadImage(firmaUrl);

      const firmaWidth = 55;
      const firmaHeight = 28;

      const firmaX = pageWidth - firmaWidth - 25;
      const firmaY = pageHeight - firmaHeight - 25;

      doc.addImage(firma, "PNG", firmaX, firmaY, firmaWidth, firmaHeight);

      doc.setFont("Times", "bolditalic");
      doc.setFontSize(13);
      doc.text(
        `${director.nombre}`,
        firmaX + firmaWidth / 2,
        firmaY + firmaHeight + 8,
        { align: "center" }
      );

      doc.setFont("Times", "italic");
      doc.text(
        director.cargo || "Director del Centro de las Artes",
        firmaX + firmaWidth / 2,
        firmaY + firmaHeight + 15,
        { align: "center" }
      );
    } catch (error) {
      console.error("Error cargando firma del director", error);
    }
  }

  doc.setFont("Times", "italic");
  doc.setFontSize(12);
  doc.text("San Agustín Etla, Oaxaca.", centerX, pageHeight - 10, {
    align: "center",
  });

  doc.save(`Constancia_${alumno.nombre}_${alumno.apellidos}.pdf`);
};


const loadImage = async (url) => {
  const blob = await fetch(url).then((res) => res.blob());
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

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
