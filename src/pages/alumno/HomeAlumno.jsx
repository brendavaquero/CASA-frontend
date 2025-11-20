import { useEffect, useState } from "react";
import Sidebar from "../../componentes/SiderBar.jsx";
import logoCaSa from "../../assets/images/logoCaSa.png";
import GridTallerD from '../../componentes/GirdTallerD.jsx'
import IconButton from '@mui/material/IconButton';
import IconDocente from '../../assets/images/docenteicon.png';
import { getAlumnoTalleres } from "@/apis/alumnoService.js";
import { getTalleres } from "@/apis/tallerDiplomadoService.js";

const HomeAlumno = () => {
  const [alumno, setAlumno] = useState(null);
  const [talleres, setTalleres] = useState([]);
  const idUsuario = 'USU2025-00007';
    useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const data = await getAlumnoTalleres(idUsuario);
        console.log('data:',data);
        const todosTalleres = await getTalleres();
        
        const talleresFiltrados = todosTalleres.filter(t =>
          data.some(a => a.idActividad === t.idActividad)
        );
        setAlumno(data[0]);
        setTalleres(talleresFiltrados);
        console.log('talleres Alum:',talleresFiltrados);
      } catch (error) {
        console.error("Error al obtener el alumno:", error);
      }
    };

    fetchAlumno();
  }, []);
  return (
    <div className="flex h-screen bg-gray-100 pt-20">
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-6 py-4 border-b">
            <img src={logoCaSa} alt="Logo CaSa" width={60} />
            <h1 className="text-lg font-medium text-gray-700">Centro de las Artes de San Agustín</h1> 
            <div className="flex items-center">
                <h2 className="text-lg font-medium text-gray-700 mr-5">{alumno ? alumno.nombre : "Cargando..."}</h2>
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
            <GridTallerD talleres={talleres}/> 
            </main>
        </div>
        <footer className="bg-gray-700 text-gray-200 text-sm text-center py-3">
          CompanyName © 2025. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default HomeAlumno;
