import { Home, Aprender, RondaUnoEvaluacion, PostulacionesEvaluar, Convocatorias, ConvocatoriaIndividual, TallerIndividual, PostulacionForm, PostulacionConvocatoriaForm, ProgramasUsuarioPage, PostulacionesPendientesPage } from "@/pages";
import { DashboardTrimestral, InstitucionesPage, Requisitar_Taller, RondaFinal, PerfilGanador, RegistroPostal, RegistroParticipante} from "@/pages";
import HomeDocente from "./pages/docente/HomeDocente";
import HomeAlumno from "./pages/alumno/HomeAlumno";
import HomeAuxiliar from "./pages/auxiliar/HomeAuxiliar";
import HomeAdmin from "./pages/admin/HomeAdmin";
import HomeJurado from "./pages/jurado/HomeJurado";
import Login from "./pages/login/Login";
import ProtectedRoute from "./componentes/ProtectedRoute";
import ResetPassword from "./componentes/ResetPassword";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
    showInNavbar: true,
  },
  {
    name: "Aprender",
    path: "/talleresydiplomados",
    element: <Aprender />,
    showInNavbar: true,
  },
  {
    name: "Evaluación 1",
    path: "/evaluar/ronda1/:idPostulacion",
    element: <RondaUnoEvaluacion />,
  },
  {
    name: "Instituciones",
    path: "/instituciones",
    element: <InstitucionesPage />,
  },
  {
    name: "Registro participante",
    path: "/registro/participante",
    element: <RegistroParticipante />,
  },
  {
    name: "Registro postal",
    path: "/convocatoria/registropostal",
    element: <RegistroPostal />,
  },
  {
    name: "Dashboard Trimestral",
    path: "/estadisticas/trimestrales",
    element: <DashboardTrimestral />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    name: "Taller individual",
    path: "/talleresydiplomados/:id",
    element: <TallerIndividual />,
  },
  {
    name: "convocatorias",
    path: "/convocatoriasyresidencias",
    element: <Convocatorias />,
    showInNavbar: true,
  },
  {
    name: "Convocatoria individual",
    path: "/convocatoriasyresidencias/:id",
    element: <ConvocatoriaIndividual/>,
  },
  {
    name: "postulacion",
    path: "/postular/:idActividad",
    element: <PostulacionForm />,
  },
  {
    name: "postulacionConvocatoria",
    path: "/participar/:idActividad",
    element: <PostulacionConvocatoriaForm />,
  },
  {
    path: "/programas",
    element: (
      <ProtectedRoute roles={["INVITADO"]}>
        <ProgramasUsuarioPage />
      </ProtectedRoute>
    ),
  },
  {
    name: "login",
    path: "/login",
    element: <Login />,
  },
  {
    path: "/requisitarTaller",
    element: (
      <ProtectedRoute roles={["DOCENTE","ADMINISTRADOR"]}>
        <Requisitar_Taller />
      </ProtectedRoute>
    ),
  },
  {
    path: "/homeDocente",
    element: (
      <ProtectedRoute roles={["DOCENTE"]}>
        <HomeDocente />
      </ProtectedRoute>
    ),
  },
  {
    path:"/homeAlumno",
    element: (
      <ProtectedRoute roles={["PARTICIPANTE"]}>
        <HomeAlumno />
      </ProtectedRoute>
    ),
  },
  {
    path:"/homeAuxiliar",
    element: ( 
      <ProtectedRoute roles={["AUXILIAR"]}>
        <HomeAuxiliar />
      </ProtectedRoute>
    )
  },
  {
    path: "/homeAdministrador",
    element: (
      <ProtectedRoute roles={["ADMINISTRADOR"]}>
        <HomeAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: "/homeJurado",
    element: (
      <ProtectedRoute roles={["JURADO"]}>
        <HomeJurado />
      </ProtectedRoute>
    ),
  },
  {
    name: "Docs",
    href: "https://www.material-tailwind.com/docs/react/installation",
    target: "_blank",
    element: "",
  },
];

export default routes;