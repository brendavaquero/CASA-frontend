import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TallerDetalle from "../componentes/taller-detalle";

export function TallerIndividual() {
  const { id } = useParams(); // obtenemos el id desde la URL
  const [actividad, setActividad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerTaller = async () => {
      try {
        const respuesta = await fetch(`http://localhost:8080/api/talleresydiplomados/${id}`);


        if (!respuesta.ok) throw new Error("No se pudo cargar el taller");

        const data = await respuesta.json();
        setActividad(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerTaller();
  }, [id]);

  if (cargando)
    return (
      <div className="pt-24 p-6">
        <p>Cargando información...</p>
      </div>
    );

  if (error)
    return (
      <div className="pt-24 p-6 text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  if (!actividad)
    return (
      <div className="pt-24 p-6">
        <p>No se encontró este taller.</p>
      </div>
    );

  return (
    <div className="pt-24 w-full min-h-screen">
      <TallerDetalle actividad={actividad} />
    </div>
  );
}
 export default TallerIndividual;