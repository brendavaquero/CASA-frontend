import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import jsPDF from "jspdf";
import {
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner,
} from "@material-tailwind/react";

import { obtenerActaPorConvocatoria, getInstitucionesByActividad } from "@/apis/convocatorias";
import { obtenerFinalistas, entrarRondaFinal } from "../apis/rondaUno_Service";
import { confirmarGanador } from "../apis/ganador_Service";
import { enviarCorreo } from "@/apis/emailService";
import FinalistaCard from "../componentes/FinalistaCard";
import ModalMensaje from "@/componentes/ModalMensaje";
import { getDirectores } from "@/apis/director";

/* =========================
   HELPER PARA CARGAR IMÁGENES
========================= */
const loadImage = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo cargar imagen");

  const blob = await response.blob();

  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const RondaFinal = ({ convocatoria, onVolver }) => {
  const [finalistas, setFinalistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [finalistaSeleccionado, setFinalistaSeleccionado] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const [director, setDirector] = useState(null);

  /* =========================
     CARGAR FINALISTAS
  ========================= */
  useEffect(() => {
    if (convocatoria?.idActividad) {
      cargarFinalistas();
    }
  }, [convocatoria]);

  const cargarFinalistas = async () => {
    try {
      const data = await obtenerFinalistas(convocatoria.idActividad);
      setFinalistas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const fetchDirector = async () => {
    try {
      const data = await getDirectores();
      setDirector(data[0]);
    } catch (error) {
      console.error("Error al cargar director", error);
    }
  };

  fetchDirector();
}, []);

  const abrirModal = (finalista) => {
    setFinalistaSeleccionado(finalista);
    setOpen(true);
  };

  const cerrarModal = () => {
    setOpen(false);
    setFinalistaSeleccionado(null);
  };

  /* =========================
     CONFIRMAR GANADOR + CORREO
  ========================= */
  const confirmar = async () => {
    console.log("Finalista enviado al backend:", finalistaSeleccionado);

    const enviarCorreoGanador = async (finalista) => {
      if (!finalista?.correo) {
        console.warn("El finalista no tiene correo registrado");
        return;
      }

      const nombre = finalista.infantil
        ? finalista.postulante
        : `${finalista.nombre} ${finalista.apellidos}`;

      const dataCorreo = {
        to: finalista.correo,
        subject: "¡Felicidades! Eres ganador de la convocatoria",
        body: `
Hola ${nombre},

Nos complace informarte que has sido seleccionado como GANADOR de la convocatoria:

"${convocatoria.titulo}"

Obra ganadora:
"${finalista.nombreObra}"

¡Felicidades por tu talento!

Pronto nos pondremos en contacto contigo para los siguientes pasos.

Atentamente,
Centro de las Artes de San Agustín
        `,
      };

      try {
        await enviarCorreo(dataCorreo);
        setModalTitle("Éxito");
        setModalMessage("Se envió el correo al ganador");
        setModalOpen(true);
      } catch (error) {
        setModalTitle("Error");
        setModalMessage("Ocurrió un error al mandar el correo");
        setModalOpen(true);
      }
    };

    try {
      await confirmarGanador(finalistaSeleccionado);
      await descargarActa();
      await enviarCorreoGanador(finalistaSeleccionado);

      setModalTitle("Éxito");
      setModalMessage("Ganador confirmado correctamente");
      setModalOpen(true);

      cerrarModal();
    } catch (error) {
      alert("Error al confirmar ganador");
    }
  };


  const generarPDF = async (acta, instituciones = [],director) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();


    if (instituciones.length > 0) {
      const logoSize = 18;
      const gap = 8;
      const totalWidth =
        instituciones.length * logoSize +
        (instituciones.length - 1) * gap;

      let startX = (pageWidth - totalWidth) / 2;
      const logosY = 10;

      for (const inst of instituciones) {
        if (!inst.logoUrl) continue;

        try {
          const logoUrl = inst.logoUrl.startsWith("http")
            ? inst.logoUrl
            : `http://localhost:8080${inst.logoUrl}`;

          const logo = await loadImage(logoUrl);
          doc.addImage(logo, "PNG", startX, logosY, logoSize, logoSize);
          startX += logoSize + gap;
        } catch {
          console.warn("No se pudo cargar logo:", inst.nombre);
        }
      }
    }

    let y = 40;

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("ACTA DE DICTAMEN", pageWidth / 2, y, { align: "center" });

    y += 8;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(`${acta.lugar}, a ${acta.fecha}`, pageWidth / 2, y, { align: "center" });

    y += 15;

    const texto = `
En la presente acta se hace constar que, tras el proceso de evaluación
correspondiente a la convocatoria "${acta.nombreConvocatoria}", convocada por
${acta.convocantes}, el jurado designado determinó como ganador(a) a:

${acta.nombreGanador}

con la obra titulada "${acta.nombreObra}", la cual obtuvo una calificación final
de ${acta.calificacionFinal} puntos.

El premio otorgado consiste en: ${acta.premio}.
    `;

    doc.text(texto.trim(), 20, y, {
      maxWidth: 170,
      lineHeightFactor: 1.5,
    });

    y += 95;
    
    doc.setFont("times", "bold");
    doc.text("Firmas del Jurado", 20, y);

    y += 15;
    doc.setFont("times", "normal");

    const col1X = 20;
    const col2X = 110;
    const lineWidth = 70;
    let currentY = y;

    acta.jurados.forEach((jurado, index) => {
      const x = index % 2 === 0 ? col1X : col2X;

      if (index % 2 === 0 && index !== 0) currentY += 25;

      doc.line(x, currentY, x + lineWidth, currentY);
      doc.text(jurado, x, currentY + 6);
      doc.setFontSize(9);
      doc.text("Jurado", x, currentY + 11);
      doc.setFontSize(11);
    });

    currentY += 40;

    doc.setFont("times", "bold");
    doc.text("Dirección", 20, currentY);

    currentY += 15;
    doc.setFont("times", "normal");
    doc.line(20, currentY, 90, currentY);

    doc.text(
      director?.nombre || "Director del Centro de las Artes",
      20,
      currentY + 6
    );

    doc.setFontSize(9);
    doc.text(
      "Director General del Centro de las Artes de San Agustín",
      20,
      currentY + 11
    );
    doc.setFontSize(11);


    doc.save(`Acta_${acta.nombreConvocatoria}.pdf`);
  };

  const descargarActa = async () => {
    try {
      const acta = await obtenerActaPorConvocatoria(convocatoria.idActividad);
      const instituciones = await getInstitucionesByActividad(convocatoria.idActividad);
      await generarPDF(acta, instituciones,director);
    } catch (error) {
      console.error(error);
      setModalTitle("Error");
      setModalMessage("No fue posible generar el acta PDF");
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={onVolver}>
        <ChevronLeft size={28} />
      </button>

      <Typography variant="h4" className="mb-6">
        Ronda Final – Selección de Ganador
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalistas.map((finalista) => (
          <FinalistaCard
            key={finalista.idResultado}
            finalista={finalista}
            onSeleccionar={abrirModal}
          />
        ))}
      </div>

      <Dialog open={open} handler={cerrarModal} size="sm">
        <DialogHeader className="text-center">Confirmar ganador</DialogHeader>

        <DialogBody>
          {finalistaSeleccionado && (
            <>
              <Typography className="text-center font-medium">
                {finalistaSeleccionado.infantil
                  ? finalistaSeleccionado.postulante
                  : `${finalistaSeleccionado.nombre} ${finalistaSeleccionado.apellidos}`}
              </Typography>
              <Typography className="text-center mt-2">
                Obra: <strong>{finalistaSeleccionado.nombreObra}</strong>
              </Typography>
              <Typography className="text-center mt-2">
                Promedio final: {finalistaSeleccionado.promedio}
              </Typography>
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="text" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button onClick={confirmar}>
            Confirmar ganador
          </Button>
        </DialogFooter>
      </Dialog>

      <ModalMensaje
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        autoClose
        autoCloseTime={10000}
      />
    </div>
  );
};

export default RondaFinal;
