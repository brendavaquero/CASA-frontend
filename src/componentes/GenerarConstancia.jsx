import jsPDF from "jspdf";
import "jspdf-autotable";

export const generarConstancia = async (taller, docente, alumno) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  doc.setFillColor(245, 245, 250);
  doc.rect(0, 0, 220, 280, "F");


  doc.setDrawColor(120, 120, 160);
  doc.setLineWidth(1.2);
  doc.roundedRect(10, 10, 192, 260, 3, 3);

  doc.setLineWidth(0.6);
  doc.roundedRect(15, 15, 182, 250, 3, 3);

  doc.setLineWidth(0.4);
  doc.line(50, 45, 160, 45);

  const logo = await loadImage("/logoCaSa.png");
  const logoWidth = 50;
  const aspectRatio = 1; 
  const logoHeight = logoWidth * aspectRatio;

  doc.addImage(logo, "PNG", 105 - logoWidth / 2, 15, logoWidth, logoHeight); 


  
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CONSTANCIA DE PARTICIPACIÓN", 105, 70, { align: "center" });


  doc.setFont("Times", "italic");
  doc.setFontSize(14);
  doc.text(
    "El Centro de las Artes de San Agustín extiende la presente constancia a:",
    105,
    95,
    { align: "center" }
  );

  doc.setFont("Times", "bolditalic");
  doc.setFontSize(22);
  doc.text(`${alumno.nombre} ${alumno.apellidos}`, 105, 115, {
    align: "center",
  });


  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text(`Por su destacada participación en el ${taller.tipo}`, 105, 135, {
    align: "center",
  });


  doc.setFont("Times", "bolditalic");
  doc.setFontSize(19);
  doc.text(`${taller.titulo}`, 105, 155, { align: "center" });


  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text("Impartido por:", 105, 175, { align: "center" });

  doc.setFont("Times", "bolditalic");
  doc.setFontSize(17);
  doc.text(
    `${docente.nombre} ${docente.apellidos}`,
    105,
    188,
    { align: "center" }
  );

  doc.setFont("Times", "italic");
  doc.setFontSize(15);
  doc.text(
    `Periodo: ${taller.fechaInicio}  a  ${taller.fechaCierre}`,
    105,
    205,
    { align: "center" }
  );


  const firma = await loadImage("/firma_director.jpg");
  doc.addImage(firma, "PNG", 128, 215, 55, 28);

  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.text("Director del Centro de las Artes", 155, 247, {
    align: "center",
  });

  doc.setFont("Times", "italic");
  doc.setFontSize(12);
  doc.text("San Agustín Etla, Oaxaca.", 105, 258, { align: "center" });


  doc.save(`Constancia_${alumno.nombre}.pdf`);
};


const loadImage = async (url) => {
  const blob = await fetch(url).then((res) => res.blob());
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};
