import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/SiderBar.jsx";
import logoCaSa from "../../assets/images/logoCaSa.png";
import GridTallerD from '../../componentes/GirdTallerD.jsx';
import GirdConvocatoria from "@/componentes/GirdConvocatoria.jsx";
import IconButton from '@mui/material/IconButton';
import IconDocente from '../../assets/images/docenteicon.png';
import { Requisitar_Taller } from "../index.js";
import { getTalleres } from "@/apis/tallerDiplomado_Service.js";
import { getConvocatorias, getByIdConvocatoria } from "@/apis/convocatorias.js";
import CrearTaller from "./CrearTaller.jsx";
import VistaTaller from "@/componentes/VistaTaller.jsx";
import CrearConvocatoria from "./CrearConvocatoria.jsx";
import VistaConvocatoria from "@/componentes/VistaConvocatoria.jsx";
import ListaJurados from "./ListaJurados.jsx";
import ListaEvaluaciones from "./ListaEvaluaciones.jsx";
import ListaParticipantes from "./ListaParticipantes.jsx";
import EditarConvocatoria from "@/componentes/EditarConvocatoria.jsx";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import ModalMensaje from "@/componentes/ModalMensaje.jsx";
import { PerfilGanador } from "../index.js";
import UsuariosPage from "./UsuariosPage.jsx";
import { RondaFinal } from "../index.js";
import AsignarJurados from "./AsignarJurados.jsx";
import CrearPrograma from "./CrearPrograma.jsx";
import Perfil from "../perfil/Perfil.jsx";
import { DashboardTrimestral } from "../index.js";
import { Footer } from "@/widgets/layout/index.js";

const HomeAdmin = () => {
  const [talleres, setTalleres] = useState([]);
  const [vistaActual, setVistaActual] = useState("dashboard");
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const { user } = useAuth();
  const administrador = user;
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [seccion, setSeccion] = useState("DASHBOARD");
  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState(null);
  const [jurados, setJurados] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [ganadores, setGanadores] = useState([]);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        cargarTalleres();
        await cargarConvocatorias();
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  const cargarTalleres = async () => {
    try {
      const data = await getTalleres();
      setTalleres(data);
    } catch (error) {
      console.error("Error al cargar talleres", error);
    }
};

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

    const estadosVistaTaller = [
      "AUTORIZADA",
      "CONVOCATORIA_ABIERTA",
      "CONVOCATORIA_CERRADA",
      "EN_CURSO",
      "FINALIZADA"
    ];

    if (taller.estado === "PENDIENTE") {
      setVistaActual("revisionTaller");
      return;
    }

    if (estadosVistaTaller.includes(taller.estado)) {
      setVistaActual("vistaTaller");
      return;
    }

    // fallback
    setVistaActual("revisionTaller");
  };


  
  const handleConvocatoriaClick = async (convocatoria) => {
    await recargarConvocatoriaSeleccionada(convocatoria.idActividad);
    setVistaActual("convocatoria");
  };

  const handleConvocatoriaJurados = (convocatoria) => {
    console.log('selecciomada:',convocatoria);
    setConvocatoriaSeleccionada(convocatoria);
    setVistaActual("asignar");
    console.log(vistaActual);
  };

  const recargarConvocatoriaSeleccionada = async (idActividad) => {
    if (!idActividad) return;

    try {
      const data = await getByIdConvocatoria(idActividad);
      setConvocatoriaSeleccionada(data);
    } catch (error) {
      console.error("Error al recargar convocatoria", error);
    }
  };

  const handleVolver = async  () => {
     await cargarTalleres();
    setVistaActual("grid");
  };

  const talleresFiltrados =
    filtroEstado === "TODOS"
      ? talleres
      : talleres.filter(t => t.estado === filtroEstado);


  const convocatoriasFiltradas =
    filtroEstado === "TODOS"
      ? convocatorias
      : convocatorias.filter(c => c.estado === filtroEstado);
    const handleNavigateConvocatoria = (vista) => {
      setVistaActual(vista);
  };
  const convocatoriasAbiertas = convocatorias.filter(
    c => c.estado === "CONVOCATORIA_ABIERTA"
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 pt-20">
        <header className="flex justify-between items-center bg-white px-6 py-4 border-b shrink-0">
                        <div className="flex items-center">
                <h2 className="text-lg font-medium text-gray-700 mr-5">{administrador? `${administrador.nombre} ${administrador.apellidos}` : "Cargando..."}</h2>
                <div className="w-15 h-15 text-white flex items-center justify-center font-semibold">
                    
                </div>
            </div>
            
        </header>     

        <div className="flex flex-1 overflow-hidden">
            <Sidebar role={administrador.rol} open={sidebarOpen} activeSection={seccion}
              onToggle={() => setSidebarOpen(!sidebarOpen)} 
              onSelect={(key) => {
                setSeccion(key);

                if (key === "DASHBOARD") {
                  setVistaActual("dashboard");
                } else {
                  setVistaActual("grid");
                }
              }}
              onLogoutClick={() => setOpenLogoutModal(true)}
            />

            <main className="flex-1 overflow-y-auto p-8">
              {seccion === "DASHBOARD" && (
                  <DashboardTrimestral />
                )}
               {seccion === "TALLERES_DIPLO" && (
                <>
                  {vistaActual === "grid" && (
                    <>
                      <div className="flex items-center">
                        <span>Filtrar por estado:</span>
                        <FormControl size="small" sx={{ minWidth: 240 }}>
                          <Select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            displayEmpty
                            sx={{
                              backgroundColor: "#eeeeee",
                              borderRadius: "10px",
                              fontSize: "0.9rem",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#bdbdbd",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#9e9e9e",
                              },
                            }}
                          >
                            <MenuItem value="TODOS">Todos</MenuItem>
                            <MenuItem value="PENDIENTE">Pendientes</MenuItem>
                            <MenuItem value="AUTORIZADA">Autorizado</MenuItem>
                            <MenuItem value="RECHAZADA">Rechazado</MenuItem>
                            <MenuItem value="EN_CURSO">En Curso</MenuItem>
                            <MenuItem value="CONVOCATORIA_ABIERTA">Convocatoria Abierta</MenuItem>
                            <MenuItem value="CONVOCATORIA_CERRADA">Convocatoria Cerrada</MenuItem>
                            <MenuItem value="FINALIZADA">Finalizado</MenuItem>
                            <MenuItem value="CANCELADA">Cancelado</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      <GridTallerD
                        talleres={talleresFiltrados}
                        onTallerClick={handleTallerClick}
                      />
                    </>
                  )}

                  {vistaActual === "revisionTaller" && (
                    <Requisitar_Taller
                      modo="ADMINISTRADOR"
                      taller={tallerSeleccionado}
                      onVolver={() => setVistaActual("grid")}
                      onAprobar={() => setVistaActual("crearTaller")}
                      docente=""
                    />
                  )}

                  {vistaActual === "crearTaller" && (
                    <CrearTaller
                      taller={tallerSeleccionado}
                      onVolver={async () => {
                        await cargarTalleres();
                        setVistaActual("grid");
                      }}
                    />
                  )}

                  {vistaActual === "vistaTaller" && (
                    <VistaTaller
                      modo={administrador.rol}
                      taller={tallerSeleccionado}
                      administrador={administrador}
                      onVolver={() => setVistaActual("grid")}
                    />
                  )}
                </>
              )}

              {seccion === "CONVOCATORIAS_RESI" && (
                <>
                  {vistaActual === "grid" && (
                    <>
                    <div className="flex items-center">
                      <span>Filtrar por estado:</span>
                      <FormControl size="small" sx={{ minWidth: 240 }}>
                        <Select
                          value={filtroEstado}
                          onChange={(e) => setFiltroEstado(e.target.value)}
                          displayEmpty
                          sx={{
                            backgroundColor: "#eeeeee",
                            borderRadius: "10px",
                            fontSize: "0.9rem",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#bdbdbd",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#9e9e9e",
                            },
                          }}
                        >
                          
                          <MenuItem value="TODOS">Todas</MenuItem>
                          <MenuItem value="AUTORIZADA">Autorizada</MenuItem>
                          <MenuItem value="FINALIZADA">Finalizada</MenuItem>
                          <MenuItem value="RECHAZADA">Rechazada</MenuItem>
                          <MenuItem value="CONVOCATORIA_ABIERTA">Convocatoria Abierta</MenuItem>
                          <MenuItem value="CONVOCATORIA_CERRADA">Convocatoria Cerrada</MenuItem>
                          <MenuItem value="CANCELADA">Cancelada</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                      

                      <GirdConvocatoria
                        convocatorias={convocatoriasFiltradas}
                        onConvocatoriaClick={handleConvocatoriaClick}
                      />
                    </>)}

                      {vistaActual === "convocatoria" && (
                        <VistaConvocatoria
                          convocatoria={convocatoriaSeleccionada}
                          jurados={jurados}
                          evaluaciones={evaluaciones}
                          participantes={participantes}
                          ganadores={ganadores}
                          onVolver={() => setVistaActual("grid")}
                          onNavigate={handleNavigateConvocatoria}
                          setJurados={setJurados} 
                          setEvaluaciones={setEvaluaciones}
                          setParticipantes={setParticipantes}
                          setGanadores={setGanadores}
                          recargarConvocatoria={recargarConvocatoriaSeleccionada}
                        />
                      )}
                      {vistaActual === "jurados" && (
                        <ListaJurados
                          convocatoria={convocatoriaSeleccionada}
                          jurados={jurados}
                          onVolver={() => setVistaActual("convocatoria")}
                        />
                      )}
                      {vistaActual === "evaluaciones" && (
                        <ListaEvaluaciones
                          convocatoria={convocatoriaSeleccionada}
                          evaluaciones={evaluaciones}
                          onNavigate={handleNavigateConvocatoria} 
                          onVolver={() => setVistaActual("convocatoria")}
                        />
                      )}
                      {vistaActual === "selectGanador" && (
                        <RondaFinal
                          convocatoria = {convocatoriaSeleccionada}
                          onVolver={() => setVistaActual("evaluaciones")}
                        />
                      )}
                      {vistaActual === "participantes" && (
                        <ListaParticipantes
                          convocatoria={convocatoriaSeleccionada}
                          participantes={participantes}
                          onVolver={() => setVistaActual("convocatoria")}
                        />
                      )}
                      {vistaActual === "ganadores" && (
                        <PerfilGanador
                          onVolver={() => setVistaActual("convocatoria")}
                          ganadores={ganadores}
                        />
                      )}
                      {vistaActual === "editarConvocatoria" && (
                        <EditarConvocatoria
                          convocatoria={convocatoriaSeleccionada}
                          onVolver={() => setVistaActual("convocatoria")}
                          onConvocatoriaActualizada={async () => {
                            await cargarConvocatorias();
                            await recargarConvocatoriaSeleccionada(convocatoriaSeleccionada.idActividad);
                            setVistaActual("convocatoria");
                          }}
                        />
                      )}
                  </>
              )}

              {seccion === "CREAR_CONVOCATORIA" && (
                <>
                  <CrearConvocatoria onConvocatoriaCreada={async () => {
                    await cargarConvocatorias();
                    setSeccion("CONVOCATORIAS_RESI");
                    setVistaActual("grid");
                  }} />
                </>
              )}
              {seccion === "ASIGNAR_JURADOS" && (
                <>
                  {vistaActual === "grid" && (
                    <>
                      <GirdConvocatoria
                        convocatorias={convocatoriasAbiertas}
                        onConvocatoriaClick={handleConvocatoriaJurados}
                      />
                    </>)}
                  {vistaActual === "asignar" && (
                    <>
                      <AsignarJurados 
                        convocatoria={convocatoriaSeleccionada}
                        onVolver={() => setVistaActual("gird")}
                      />
                    </>)}
                </>
              )}
              {seccion === "PROGRAMAS" && (
                <>
                  <CrearPrograma />
                </>
              )}
              {seccion === "USUARIOS" && (
                <>
                  <UsuariosPage />
                </>
              )}
              {seccion === "PERFIL" && (
                <>
                  <Perfil 
                  usuario={administrador}/>
                </>
              )}
            </main>
        </div>
        <Footer/>
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

export default HomeAdmin;
