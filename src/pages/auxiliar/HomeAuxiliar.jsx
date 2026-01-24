import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/SiderBar.jsx";
import logoCaSa from "../../assets/images/logoCaSa.png";
import GridTallerD from '../../componentes/GirdTallerD.jsx'
import IconButton from '@mui/material/IconButton';
import IconDocente from '../../assets/images/docenteicon.png';
import { getTalleres } from "@/apis/tallerDiplomado_Service.js";
import { useAuth } from "@/context/AuthContext";
import ModalMensaje from "@/componentes/ModalMensaje.jsx";
import EvidenciasTaller from "./EvidenciasTaller.jsx";
import GirdConvocatoria from "@/componentes/GirdConvocatoria.jsx";
import { getConvocatorias } from "@/apis/convocatoria_Service.js";
import RegistroPostalAux from "@/componentes/RegistroPostAux.jsx";
import Perfil from "../perfil/Perfil.jsx";


const HomeAuxiliar = () => {
  const [talleres, setTalleres] = useState([]);
  const [vistaActual, setVistaActual] = useState("grid");
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [seccion, setSeccion] = useState("TALLERES");
  const { user } = useAuth();
  const auxiliar = user;
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
          try {
            const dataTalleres = await getTalleres();
            setTalleres(dataTalleres);
            await cargarConvocatorias();
          } catch (error) {
            console.error("Error al cargar datos:", error);
          }
        };
    
        cargarDatos();
      }, []);

    const cargarConvocatorias = async () => {
        try {
          const dataConvocatorias = await getConvocatorias();
          setConvocatorias(dataConvocatorias);
        } catch (error) {
          console.error("Error al cargar convocatorias", error);
        }
      };

   const handleTallerClick = (taller) => {
    setTallerSeleccionado(taller);
    setSeccion("DETALLE_TALLER");
  };
  const handleTallerVista = (taller) => {
    setTallerSeleccionado(taller);
    setVistaActual("postulacion");
  };

  const handleVolver = () => {
    setSeccion("EVIDENCIAS");
  };
  const handleConvocatoriaClick = (convocatoria) => {
    console.log('selecciomada:',convocatoria);
    setConvocatoriaSeleccionada(convocatoria);
    setVistaActual("postulacion");
    console.log(vistaActual);
  };

 const convocatoriasAbiertas = convocatorias.filter(
    c => c.estado === "CONVOCATORIA_ABIERTA"
  );
  const tallresAbiertos = talleres.filter(
    c => c.estado === "CONVOCATORIA_ABIERTA"
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 pt-20">
        <header className="flex justify-between items-center bg-white px-6 py-4 border-b shrink-0">
            <img src={logoCaSa} alt="Logo CaSa" width={60} />
            <h1 className="text-lg font-medium text-gray-700">Centro de las Artes de San Agustín</h1> 
            <div className="flex items-center">
                <h2 className="text-lg font-medium text-gray-700 mr-5">{auxiliar ? auxiliar.nombre : "Cargando..."}</h2>
                <div className="w-15 h-15 text-white flex items-center justify-center font-semibold">
                    <IconButton aria-label="delete">
                        <img src={IconDocente} alt="Icono Docente" className="w-8 h-8 object-cover"/>
                    </IconButton>
                </div>
            </div>
            
        </header>     

        <div className="flex flex-1 overflow-hidden">
            <Sidebar role={auxiliar.rol} open={sidebarOpen} activeSection={seccion}
              onToggle={() => setSidebarOpen(!sidebarOpen)} 
              onSelect={(key) => {
                setSeccion(key);
                setVistaActual("grid");
              }}
              onLogoutClick={() => setOpenLogoutModal(true)}
              />

            <main className="flex-1 overflow-y-auto p-8">
            {seccion === "EVIDENCIAS" && (
              <GridTallerD
                onTallerClick={handleTallerClick}
                talleres={talleres}
              />
            )}

            {seccion === "DETALLE_TALLER" && (
              <EvidenciasTaller
                taller={tallerSeleccionado}
                onVolver={handleVolver}
              />
            )}
            {seccion === "CONVOCATORIAS_RESI" && (
                <>
                  {vistaActual === "grid" && (
                    <>
                      <GirdConvocatoria
                        convocatorias={convocatoriasAbiertas}
                        onConvocatoriaClick={handleConvocatoriaClick}
                      />
                    </>)}
                    {vistaActual === "postulacion" && (
                    <>
                      <RegistroPostalAux
                       actividad={convocatoriaSeleccionada}
                       onVolver={() => setVistaActual("grid")}
                      />
                    </>)}
                  </>
            )}
            {seccion === "PERFIL" && (
               <>
              <Perfil
               usuario={auxiliar}/>
              </>
            )}
            </main>
        </div>
        <footer className="bg-gray-700 text-gray-200 text-sm text-center py-3">
          CompanyName © 2025. All rights reserved.
        </footer>
      <ModalMensaje
        open={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        type="confirm"
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Sí, salir"
        cancelText="Cancelar"
        onConfirm={() => {
          logout();
          navigate("/login");
        }}
      />
    </div>
  );
};

export default HomeAuxiliar;
