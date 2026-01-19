import { useEffect, useState } from "react";
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
import { obtenerFinalistas } from "../apis/rondaUno_Service";
import { confirmarGanador } from "../apis/ganador_Service";



const RondaFinal = () => {
  const confirmar = async () => {
  console.log("Finalista enviado al backend:", finalistaSeleccionado);

  try {
    await confirmarGanador(finalistaSeleccionado);
    alert("Ganador confirmado correctamente");
    cerrarModal();
  } catch (error) {
    alert("Error al confirmar ganador");
  }
};
  const [finalistas, setFinalistas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [finalistaSeleccionado, setFinalistaSeleccionado] = useState(null);

  const idConvocatoria = "ACT2025-00027"; // luego vendrá de params o contexto

  useEffect(() => {
  cargarFinalistas();
}, []);

const cargarFinalistas = async () => {
  try {
    const data = await obtenerFinalistas(idConvocatoria);
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
          </Button>
        </DialogFooter>
      </Dialog>

    </div>
  );
};

export default RondaFinal;
