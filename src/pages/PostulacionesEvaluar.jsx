import { useEffect, useState } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import PostulacionesJuradoTable from "../componentes/PostulacionesJuradoTable";
import { getPendientesParaJurado } from "../apis/postulacion_Service";

export default function PostulacionesEvaluar() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // luego vendrán de auth / contexto
  const idJurado = "JUR2025-00001";
  const ronda = 1;

  useEffect(() => {
    const cargarPostulaciones = async () => {
      try {
        const data = await getPendientesParaJurado(idJurado, ronda);
        setPostulaciones(data);
      } catch (err) {
        setError("No se pudieron cargar las postulaciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPostulaciones();
  }, [idJurado, ronda]);

  console.log("PostulacionesEvaluar render");

  return (
    <div className="p-6 max-w-7xl mx-auto pt-24">
      <Typography variant="h4" className="mb-6">
        Postulaciones pendientes de evaluar
      </Typography>

      {loading && (
        <div className="flex justify-center py-10">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {error && (
        <Typography color="red" className="mb-4">
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <PostulacionesJuradoTable postulaciones={postulaciones} />
      )}
    </div>
  );
}
