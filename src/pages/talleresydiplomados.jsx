import React, { useEffect, useState } from "react";
import { listTalleresDiplomados, getDocenteByTaller } from "../services/TallerDiplomadoService";
import { TallerCard } from "../componentes/taller-card";

export function Aprender() {
  const [talleres, setTalleres] = useState([]);

  useEffect(() => {
    async function cargarTalleres() {
      const data = await listTalleresDiplomados();

      // 1. Cargar talleres iniciales
      let talleresAdaptados = data.map((t) => ({
        id: t.idActividad,
        titulo: t.titulo,
        descripcion: t.descripcion,
        imagen: t.imagen || "https://placehold.co/600x400",
        tipo: t.tipo,
        estado: t.estado,
        fechaInicio: t.fechaInicio,
        fechaCierre: t.fechaCierre,

        // Inicialmente no tenemos docente
        docente: "Cargando...",
        docenteFoto:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80",
      }));

      setTalleres(talleresAdaptados);

      // 2. Por cada taller pedir su docente
      const talleresConDocentes = await Promise.all(
        talleresAdaptados.map(async (taller) => {
          try {
            const docente = await getDocenteByTaller(taller.id);

            if (docente && docente.nombre) {
              return {
                ...taller,
                docente: `${docente.nombre} ${docente.apellidos || ""}`,
                docenteFoto: docente.foto || taller.docenteFoto,
              };
            }
          } catch (e) {
            console.log("El taller no tiene docente", taller.id);
          }

          return { ...taller, docente: "Docente no asignado" };
        })
      );

      setTalleres(talleresConDocentes);
    }

    cargarTalleres();
  }, []);

  return (
    <section className="px-6 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-gray-800 mb-8 text-center">
        Talleres y Diplomados
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {talleres.length > 0 ? (
          talleres.map((taller, index) => (
            <TallerCard key={index} {...taller} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No hay talleres disponibles.
          </p>
        )}
      </div>
    </section>
  );
}

export default Aprender;

