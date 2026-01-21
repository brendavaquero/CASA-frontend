import jsPDF from "jspdf";
import { obtenerActaPorConvocatoria } from "../apis/convocatorias";

const BotonDescargarActa = ({ idConvocatoria }) => {

  const generarPDF = (acta) => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 20;

    // Título
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("ACTA DE DICTAMEN", 105, y, { align: "center" });

    y += 10;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(
      `${acta.lugar}, a ${acta.fecha}`,
      105,
      y,
      { align: "center" }
    );

    y += 15;

    // Texto principal
    const texto = `
En la presente acta se hace constar que, tras el proceso de evaluación
correspondiente a la convocatoria "${acta.nombreConvocatoria}", convocada por
${acta.convocantes}, el jurado designado determinó como ganador(a) a:

${acta.nombreGanador}

con la obra titulada "${acta.nombreObra}", la cual obtuvo una calificación final
de ${acta.calificacionFinal} puntos.

El premio otorgado consiste en: ${acta.premio}.
    `;

    doc.text(texto.trim(), 20, y, { maxWidth: 170 });

    y += 60;

    // Jurado
    doc.setFont("times", "bold");
    doc.text("Jurado:", 20, y);

    y += 8;
    doc.setFont("times", "normal");

    acta.jurados.forEach((jurado) => {
      doc.text(`• ${jurado}`, 25, y);
      y += 6;
    });

    y += 20;

    // Firmas
    doc.setFont("times", "bold");
    doc.text("Firmas:", 20, y);

    y += 20;
    doc.setFont("times", "normal");

    // Director
    doc.line(20, y, 90, y);
    doc.text("Daniel Efrén Brena Wilson", 20, y + 6);
    doc.text("Director", 20, y + 12);

    // Jurado
    doc.line(120, y, 190, y);
    doc.text("Jurado", 120, y + 6);

    doc.save(`Acta_${acta.nombreConvocatoria}.pdf`);
  };

  const handleDescargar = async () => {
    try {
      const acta = await obtenerActaPorConvocatoria(idConvocatoria);
      generarPDF(acta);
    } catch (error) {
      alert("No fue posible generar el acta");
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleDescargar}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Descargar acta en PDF
    </button>
  );
};

export default BotonDescargarActa;
