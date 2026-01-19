import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/SiderBar.jsx";
import logoCaSa from "../../assets/images/logoCaSa.png";
import GridTallerD from '../../componentes/GirdTallerD.jsx'
import IconButton from '@mui/material/IconButton';
import IconDocente from '../../assets/images/docenteicon.png';
import VistaTaller from "@/componentes/VistaTaller.jsx";
import { getTalleres } from "@/apis/tallerDiplomado_Service.js";
import { useAuth } from "@/context/AuthContext";
import ModalMensaje from "@/componentes/ModalMensaje.jsx";

const HomeAuxiliar = () => {
  const [talleres, setTalleres] = useState([]);
  const [vistaActual, setVistaActual] = useState("grid");
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
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
          } catch (error) {
            console.error("Error al cargar datos:", error);
          }
        };
    
        cargarDatos();
      }, []);

   const handleTallerClick = (taller) => {
    setTallerSeleccionado(taller);
    setSeccion("DETALLE_TALLER");
  };

  const handleVolver = () => {
    setSeccion("TALLERES_DIPLO");
  };


  return (
    <div className="flex h-screen bg-gray-100 pt-20">
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-6 py-4 border-b">
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

        <div className="flex flex-1 pt-2">
            <Sidebar role={auxiliar.rol} open={sidebarOpen} activeSection={seccion}
              onToggle={() => setSidebarOpen(!sidebarOpen)} 
              onSelect={(key) => {
                setSeccion(key);
                setVistaActual("grid");
              }}
              onLogoutClick={() => setOpenLogoutModal(true)}
              />

            <main className="flex-1 overflow-y-auto p-6">
            {seccion === "TALLERES_DIPLO" && (
              <GridTallerD
                onTallerClick={handleTallerClick}
                talleres={talleres}
              />
            )}

            {seccion === "DETALLE_TALLER" && (
              <VistaTaller
                taller={tallerSeleccionado}
                modo={auxiliar.rol}
                onVolver={handleVolver}
              />
            )}
            </main>
        </div>
        <footer className="bg-gray-700 text-gray-200 text-sm text-center py-3">
          CompanyName © 2025. All rights reserved.
        </footer>
      </div>
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
