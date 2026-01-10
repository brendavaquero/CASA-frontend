import { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";

import FileViewer from "../componentes/FileViewer";
import EvaluacionForm from "../componentes/EvaluacionForm";
import EvaluacionConfirmModal from "../componentes/EvaluacionConfirmModal";

import {
  getEvaluacionRonda1,
  EvaluacionService,
} from "../apis/evaluacion_Service";

export default function RondaUnoEvaluacion() {
  const { idPostulacion } = useParams();

  const [obra, setObra] = useState(null);
  const navigate = useNavigate();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);

  // 👉 AQUÍ guardamos temporalmente la evaluación
  const [datosEvaluacion, setDatosEvaluacion] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const postulacion = await getEvaluacionRonda1(idPostulacion);

      const archivoUrl = `http://localhost:8080${postulacion.ruta}`;
      const autor = !postulacion.infantil
        ? `${postulacion.nombre} ${postulacion.apellidos} "${postulacion.seudonimo}"`
        : postulacion.postulante;

      setObra({
        idPostulacion,
        titulo: postulacion.nombreObra,
        autor,
        tipoArchivo: postulacion.tipo,
        archivoUrl,
      });
    };

    cargarDatos();
  }, [idPostulacion]);

  // 👉 Se ejecuta cuando el jurado CONFIRMA en el modal
  const ID_JURADO_ESTATICO = "JUR2025-00001";
  const confirmarEnvio = async () => {
    try {
      setCargando(true);

      console.log({ idPostulacion, idJurado: ID_JURADO_ESTATICO, calificacion: datosEvaluacion.calificacion, justificacion: datosEvaluacion.justificacion });

      await EvaluacionService.evaluarRondaUno({
        idPostulacion,
         idJurado: ID_JURADO_ESTATICO,
        ...datosEvaluacion, // calificacion + justificacion
      });
      
      setMostrarModal(false);
      navigate("/evaluar");
    } finally {
      setCargando(false);
    }
  };

  if (!obra) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <FileViewer obra={obra} />

        <EvaluacionForm
          obra={obra}
          onEnviar={(data) => {
            setDatosEvaluacion(data); // 👈 guardamos la evaluación
            setMostrarModal(true);    // 👈 abrimos modal
          }}
        />
      </div>

      <EvaluacionConfirmModal
        open={mostrarModal}
        loading={cargando}
        onCancel={() => setMostrarModal(false)}
        onConfirm={confirmarEnvio}
      />
    </div>
  );
}
