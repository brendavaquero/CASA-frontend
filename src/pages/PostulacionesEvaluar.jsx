import { useEffect, useState } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import PostulacionesJuradoTable from "../componentes/PostulacionesJuradoTable";
import { getPendientesParaJurado } from "../apis/postulacion_Service";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PostulacionesEvaluar({jurado, onVolver}) {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ronda = 1;

  const { user } = useAuth();
  console.log("jurado: ", user);
  //const jurado = user;

  useEffect(() => {
    const cargarPostulaciones = async () => {
      try {
        const data = await getPendientesParaJurado(jurado.idUsuario, ronda);
        setPostulaciones(data);
      } catch (err) {
        setError("No se pudieron cargar las postulaciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPostulaciones();
  }, [jurado.idUsuario, ronda]);

  console.log("PostulacionesEvaluar render");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button
        onClick={onVolver}
        className="text-black px-4 py-2"
      >
        <ChevronLeft size={30} />
    </button>
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
