import { useEffect, useState } from "react";
import Sidebar from "../../componentes/SiderBar.jsx";
import logoCaSa from "../../assets/images/logoCaSa.png";
import GridTallerD from '../../componentes/GirdTallerD.jsx'
import IconButton from '@mui/material/IconButton';
import IconDocente from '../../assets/images/docenteicon.png';
import { getDocenteById } from "@/apis/docenteService.js";
import VistaTaller from "@/componentes/VistaTaller.jsx";
import { getTalleresDocentes } from "@/apis/tallerDiplomadoService.js";

const HomeDocente = () => {
  const [docente, setDocente] = useState(null);
  const [talleres, setTalleres] = useState([]);
  const [vistaActual, setVistaActual] = useState("grid");
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const idUsuario = 'USU2025-00009';
    useEffect(() => {
    const fetchDocente = async () => {
      try {
        const data = await getDocenteById(idUsuario);
        console.log('data:',data);
        setDocente(data);
        const dataTalleres = await getTalleresDocentes(idUsuario);
        console.log("Talleres del docente:", dataTalleres);
        setTalleres(dataTalleres);
      } catch (error) {
        console.error("Error al obtener el docente:", error);
      }
    };

    fetchDocente();
  }, []);

   const handleTallerClick = (taller) => {
    setTallerSeleccionado(taller);
    setVistaActual("taller");
  };

  const handleVolver = () => {
    setVistaActual("grid");
  };


  return (
    <div className="flex h-screen bg-gray-100 pt-20">
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-6 py-4 border-b">
            <img src={logoCaSa} alt="Logo CaSa" width={60} />
            <h1 className="text-lg font-medium text-gray-700">Centro de las Artes de San Agustín</h1> 
            <div className="flex items-center">
                <h2 className="text-lg font-medium text-gray-700 mr-5">{docente ? docente.nombre : "Cargando..."}</h2>
                <div className="w-15 h-15 text-white flex items-center justify-center font-semibold">
                    <IconButton aria-label="delete">
                        <img src={IconDocente} alt="Icono Docente" className="w-8 h-8 object-cover"/>
                    </IconButton>
                </div>
            </div>
            
        </header>     

        <div className="flex flex-1 pt-2">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-6">
            {vistaActual === "grid" ? (
              <GridTallerD onTallerClick={handleTallerClick} talleres={talleres}  />
            ) : (
              <VistaTaller taller={tallerSeleccionado} modo="docente" onVolver={handleVolver} />
            )}
            </main>
        </div>
        <footer className="bg-gray-700 text-gray-200 text-sm text-center py-3">
          CompanyName © 2025. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default HomeDocente;
