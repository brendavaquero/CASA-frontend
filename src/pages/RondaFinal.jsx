import { useEffect, useState } from "react";
//import { useParams, useNavigate,useLocation  } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner,
} from "@material-tailwind/react";

import FinalistaCard from "../componentes/FinalistaCard";
import { entrarRondaFinal  } from "../apis/rondaUno_Service";
import { confirmarGanador } from "../apis/ganador_Service";
import { enviarCorreo } from "@/apis/emailService";
import ModalMensaje from "@/componentes/ModalMensaje";

const RondaFinal = ({convocatoria,onVolver}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");
  console.log('convoFinal:',convocatoria);
  const confirmar = async () => {
  console.log("Finalista enviado al backend:", finalistaSeleccionado);
  const enviarCorreoGanador = async (finalista) => {
    if (!finalista?.correo) {
      console.warn("El finalista no tiene correo registrado");
      return;
    }
    /* const nombre = finalista.infantil
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
      Centro de las Artes de San Agustin`,
    }; */
    try {
      await enviarCorreo(dataCorreo);
      setModalTitle("Éxito");
      setModalMessage("Se envio el correo al ganador");
      setModalOpen(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Ocurrio un error al mandar el correo, ",error);
      setModalOpen(true);
    }

  };


  try {
    await confirmarGanador(finalistaSeleccionado);
    await enviarCorreoGanador(finalistaSeleccionado);
    setModalTitle("Éxito");
    setModalMessage("Ganador confirmado correctamente");
    setModalOpen(true);
    cerrarModal();
  } catch (error) {
    alert("Error al confirmar ganador");
  }
};
  const [finalistas, setFinalistas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [finalistaSeleccionado, setFinalistaSeleccionado] = useState(null);

  useEffect(() => {
    if (convocatoria?.idActividad) {
      cargarFinalistas();
    }
  }, [convocatoria]);


const cargarFinalistas = async () => {
  try {
    const data = await entrarRondaFinal (convocatoria.idActividad);
    console.log('idAct',convocatoria.idActividad);
    console.log('data',data);
    setFinalistas(data);
  } catch (error) {
  console.error("Error al confirmar ganador");
  console.error("Status:", error.response?.status);
  console.error("Data:", error.response?.data);
  console.error("Message:", error.message);
  throw error;
}
 finally {
    setLoading(false); // 
  }
};


  const abrirModal = (finalista) => {
    setFinalistaSeleccionado(finalista);
    setOpen(true);
  };

  const cerrarModal = () => {
    setOpen(false);
    setFinalistaSeleccionado(null);
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

      {/* MODAL */}
      <Dialog open={open} handler={cerrarModal} size="sm">
        <DialogHeader className="text-center justify-center">Confirmar ganador</DialogHeader>

        <DialogBody>
          {finalistaSeleccionado && (
            <>
              <Typography color="gray" className="mt-2 font-medium text-center">
                {finalistaSeleccionado.infantil
                  ? finalistaSeleccionado.postulante
                  : `${finalistaSeleccionado.nombre} ${finalistaSeleccionado.apellidos}`}
              </Typography>
              <Typography color="gray" className="mt-2 text-center">
                Obra: <span className="font-medium">
                  {finalistaSeleccionado.nombreObra}
                </span>
              </Typography>

              <Typography color="gray" className="mt-2 text-center">
                Promedio final: {finalistaSeleccionado.promedio}
              </Typography>
            </>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="text" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button  onClick={confirmar}>
            Confirmar ganador
            {/* correo */}
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