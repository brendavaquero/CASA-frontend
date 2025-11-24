import { useEffect, useState } from "react";
import Sidebar from "../../componentes/SiderBar.jsx";
import logoCaSa from "../../assets/images/logoCaSa.png";
import GridTallerD from '../../componentes/GirdTallerD.jsx'
import IconButton from '@mui/material/IconButton';
import IconDocente from '../../assets/images/docenteicon.png';
import { Requisitar_Taller } from "../index.js";
import { getTalleres } from "@/apis/tallerDiplomadoService.js";
import { getUsuarioById } from "@/apis/usuarios.js";
import CrearTaller from "./CrearTaller.jsx";

const HomeAdmin = () => {
  const [administrador, setAdministrador] = useState(null);
  const [talleres, setTalleres] = useState([]);
  const [vistaActual, setVistaActual] = useState("grid");
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const idUsuario = 'USU2025-00011';
    useEffect(() => {
    const fetchAuxiliar = async () => {
      try {
        const data = await getUsuarioById(idUsuario);
        console.log('data:',data);
        setAdministrador(data);
        const dataTalleres = await getTalleres();
        setTalleres(dataTalleres);
      } catch (error) {
        console.error("Error al obtener el docente:", error);
      }
    };

    fetchAuxiliar();
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
                <h2 className="text-lg font-medium text-gray-700 mr-5">{administrador ? administrador.nombre : "Cargando..."}</h2>
                <div className="w-15 h-15 text-white flex items-center justify-center font-semibold">
                    <IconButton aria-label="delete">
                        <img src={IconDocente} alt="Icono Docente" className="w-8 h-8 object-cover"/>
                    </IconButton>
                </div>
            </div>
            
        </header>     

        <div className="flex flex-1 pt-2">
            {/*<Sidebar />*/}

            <main className="flex-1 overflow-y-auto p-6">
            {vistaActual === "grid" ? (
                <GridTallerD onTallerClick={handleTallerClick} talleres={talleres} />
            ) : vistaActual === "taller" ? (
                <Requisitar_Taller
                modo="administrador"
                taller={tallerSeleccionado}
                onVolver={handleVolver}
                onAprobar={() => {
                    console.log("Aprobando taller:", tallerSeleccionado);
                    setVistaActual("crearTaller");
                }}
                />
            ) : vistaActual === "crearTaller" ? (
                <CrearTaller taller={tallerSeleccionado} onVolver={handleVolver} />
            ) : null}
            </main>
        </div>
        <footer className="bg-gray-700 text-gray-200 text-sm text-center py-3">
          CompanyName © 2025. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default HomeAdmin;
