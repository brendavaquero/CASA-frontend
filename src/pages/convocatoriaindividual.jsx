import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConvocatoriaDetalle from "../componentes/convocatoria-detalle";

export function ConvocatoriaIndividual() {
  const { id } = useParams(); // obtenemos el id desde la URL
  const [actividad, setActividad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerAct = async () => {
      try {
        const respuesta = await fetch(`http://localhost:8080/api/convocatoriasyresidencias/${id}`);


        if (!respuesta.ok) throw new Error("No se pudo cargar la actividad");

        const data = await respuesta.json();
        setActividad(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerAct();
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
        <p>No se encontró esta actividad.</p>
      </div>
    );

  return (
    <div className="pt-24 w-full min-h-screen">
      <ConvocatoriaDetalle actividad={actividad} />
    </div>
  );
}
 export default ConvocatoriaIndividual;