

import { useEffect, useState } from "react";
import SimpleCard from "../componentes/programa-card";
import { getProgramasByUsuario, getById } from "../apis/ProgramaService";

export function ProgramasUsuarioPage() {
  const [programas, setProgramas] = useState([]);
  const usuarioId = "USU2025-00008"; // prueba

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProgramasByUsuario(usuarioId);
        setProgramas(data);
      } catch (error) {
        console.error("Error al cargar programas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-6 py-10 pt-24">
      <h1 className="text-3xl font-bold text-blue-gray-800 mb-8 text-center">
        Programas
      </h1>

      <div className="flex flex-wrap gap-6">
        {programas.length === 0 ? (
          <p>No hay programas asignados.</p>
        ) : (
          programas.map((programa) => (
            <SimpleCard
              key={programa.idPrograma}
              title={programa.nombre}
              content={programa.descripcion?.substring(0, 150) + "..."}
              buttonText="Descargar evidencias"
              onButtonClick={() => {
                console.log("Ir a", programa.idPrograma);
                // Aquí más adelante puedes usar router.push(`/programas/${programa.idPrograma}`)
              }}
              className="w-full sm:w-80"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProgramasUsuarioPage;