import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/SiderBar.jsx";
import logoCaSa from "../../assets/images/logoCaSa.png";
import GirdConvocatoria from "@/componentes/GirdConvocatoria.jsx";
import IconButton from '@mui/material/IconButton';
import IconDocente from '../../assets/images/docenteicon.png';
import { getConvocatorias, getByIdConvocatoria } from "@/apis/convocatorias.js";
import VistaConvocatoria from "@/componentes/VistaConvocatoria.jsx";
import { getConvocatoriasByJurado } from "@/apis/jurado.js";
import { useAuth } from "@/context/AuthContext";
import ModalMensaje from "@/componentes/ModalMensaje.jsx";
import { PostulacionesEvaluar } from "../index.js";

const HomeJurado = () => {
  const [vistaActual, setVistaActual] = useState("grid");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [seccion, setSeccion] = useState("TALLERES");
  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const { user } = useAuth();
  const jurado = user;
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      const cargarDatos = async () => {
        try {
          await cargarConvocatorias();
        } catch (error) {
          console.error("Error al obtener el jurado:", error);
        }
      };
  
      cargarDatos();
    }, []);

  const cargarConvocatorias = async () => {
    try {
      const dataConvocatorias = await getConvocatoriasByJurado(jurado.idUsuario);
      console.log('convocatorias',dataConvocatorias);
      setConvocatorias(dataConvocatorias);
    } catch (error) {
      console.error("Error al cargar convocatorias", error);
    }
  };

  const handleConvocatoriaClick = (convocatoria) => {
    console.log('selecciomada:',convocatoria);
    setConvocatoriaSeleccionada(convocatoria);
    setVistaActual("convocatoria");
    console.log(vistaActual);
  };

  const recargarConvocatoriaSeleccionada = async () => {
    if (!convocatoriaSeleccionada?.idActividad) return;

    const data = await getByIdConvocatoria(convocatoriaSeleccionada.idActividad);
    setConvocatoriaSeleccionada(data);
  };
    const convocatoriasFiltradas =
  filtroEstado === "TODOS"
    ? convocatorias
    : convocatorias.filter(c => c.estado === filtroEstado);
  const handleNavigateConvocatoria = (vista) => {
    setVistaActual(vista);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 pt-20">
        <header className="flex justify-between items-center bg-white px-6 py-4 border-b shrink-0">
            <img src={logoCaSa} alt="Logo CaSa" width={60} />
            <h1 className="text-lg font-medium text-gray-700">Centro de las Artes de San Agustín</h1> 
            <div className="flex items-center">
                <h2 className="text-lg font-medium text-gray-700 mr-5">{jurado? `${jurado.nombre} ${jurado.apellidos}` : "Cargando..."}</h2>
                <div className="w-15 h-15 text-white flex items-center justify-center font-semibold">
                    <IconButton aria-label="delete">
                        <img src={IconDocente} alt="Icono Docente" className="w-8 h-8 object-cover"/>
                    </IconButton>
                </div>
            </div>
            
        </header>     

        <div className="flex flex-1 overflow-hidden">
            <Sidebar role={jurado.rol} open={sidebarOpen} activeSection={seccion}
              onToggle={() => setSidebarOpen(!sidebarOpen)} 
              onSelect={(key) => {
                setSeccion(key);
                setVistaActual("grid");
              }}
              onLogoutClick={() => setOpenLogoutModal(true)}
            />

            <main className="flex-1 overflow-y-auto p-8">
              {seccion === "CONVOCATORIAS_RESI" && (
                <>
                  {vistaActual === "grid" && (
                    <>
                      <GirdConvocatoria
                        convocatorias={convocatoriasFiltradas}
                        onConvocatoriaClick={handleConvocatoriaClick}
                      />
                    </>)}

                      {vistaActual === "convocatoria" && (
                        <PostulacionesEvaluar
                        jurado={jurado}
                        onVolver={() => setVistaActual("grid")}
                        />
                      )}
                     
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

export default HomeJurado;
