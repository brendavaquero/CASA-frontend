

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleCard from "../componentes/programa-card";
import { getProgramasByUsuario, getById, descargarZipEvidencias } from "../apis/programa_Service";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@material-tailwind/react";

export function ProgramasUsuarioPage() {
  const [programas, setProgramas] = useState([]);
  const navigate = useNavigate();
  const { user,logout } = useAuth();
  const invitado = user;
  //const usuarioId = "USU2025-00007"; // prueba

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProgramasByUsuario(invitado.idUsuario);
        setProgramas(data);
      } catch (error) {
        console.error("Error al cargar programas:", error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = () => {
    logout();              
    navigate("/login");  
  };
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
      <div className="flex justify-end mb-4">
        <Button
          color="black"
          variant="outlined"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </div>
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