import React, { useEffect, useState } from "react";
import { listTalleresDiplomados, getDocenteByTaller } from "../apis/tallerDiplomadoService";
import { TallerCard } from "../componentes/taller-card";

export function Aprender() {
  const [talleres, setTalleres] = useState([]);

  useEffect(() => {
    async function cargarTalleres() {
      const data = await listTalleresDiplomados();

      // Adaptar talleres
      const talleresBase = data.map((t) => ({
        id: t.idActividad,
        titulo: t.titulo,
        descripcion: t.descripcion,
        imagen: t.imagen || "https://placehold.co/600x400",
        tipo: t.tipo,
        estado: t.estado,
        fechaInicio: t.fechaInicio,
        fechaCierre: t.fechaCierre,
        docente: null,
        docenteFoto: null,
      }));

      // Obtener docentes por taller
      const talleresConDocentes = await Promise.all(
        talleresBase.map(async (t) => {
          try {
            const docente = await getDocenteByTaller(t.id);

            return {
              ...t,
              docente: docente ? `${docente.nombre} ${docente.apellidos || ""}` : "Docente no asignado",
              docenteFoto:
                docente?.foto ||
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80",
            };
          } catch (err) {
            return {
              ...t,
              docente: "Docente no asignado",
              docenteFoto:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80",
            };
          }
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
        {talleres.length ? (
          talleres.map((taller) => <TallerCard key={taller.id} {...taller} />)
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

