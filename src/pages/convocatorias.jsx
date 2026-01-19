import React, { useEffect, useState } from "react";
import { listConvocatorias } from "../apis/convocatoria_Service";
import { ConvocatoriaCard } from "../componentes/convocatoria-card";

export function Convocatorias() {
  const [convocatorias, setConvocatorias] = useState([]);

  useEffect(() => {
    async function cargarConvocatorias() {
      const data = await listConvocatorias();

      // Adaptar actividades
      const convocatoriasBase = data.map((t) => ({
        id: t.idActividad,
        titulo: t.titulo,
        descripcion: t.descripcion,
        imagen:`http://localhost:8080${t.imagen}` || "https://placehold.co/600x400",
        tipo: t.tipo,
        estado: t.estado,
        visible: t.visible,  
        fechaInicio: t.fechaInicio,
        fechaCierre: t.fechaCierre
      }));

      setConvocatorias(convocatoriasBase);
    }

    cargarConvocatorias();
  }, []);

  return (
    <section className="px-6 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-gray-800 mb-8 text-center">
        Convocatorias y Residencias
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {convocatorias.length ? (
          convocatorias.filter((convocatoria) => convocatoria.visible === true).map((convocatoria) => <ConvocatoriaCard key={convocatoria.id} {...convocatoria} />)
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No hay convocatorias disponibles.
          </p>
        )}
      </div>
    </section>
  );
}
export default Convocatorias;

