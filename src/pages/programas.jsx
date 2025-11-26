

import { useEffect, useState } from "react";
import SimpleCard from "../componentes/programa-card";
import { getProgramasByUsuario, getById, descargarZipEvidencias } from "../apis/programaService";

export function ProgramasUsuarioPage() {
  const [programas, setProgramas] = useState([]);
  const usuarioId = "USU2025-00007"; // prueba

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

  const handleDescargar = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/programas/${idPrograma}/evidencias/zip`,
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `evidencias_programa_${idPrograma}.zip`;
    link.click();

    window.URL.revokeObjectURL(url);
  };


  return (
    <div className="px-6 py-10 pt-24 bg-gray-50">
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
    console.log("Click en", programa.idPrograma);
    descargarZipEvidencias(programa.idPrograma);
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