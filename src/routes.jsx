import { Home, Aprender, RondaUnoEvaluacion, PostulacionesEvaluar, Convocatorias, ConvocatoriaIndividual, TallerIndividual, PostulacionForm, PostulacionConvocatoriaForm, ProgramasUsuarioPage, PostulacionesPendientesPage } from "@/pages";
import { Requisitar_Taller, RondaFinal, PerfilGanador, RegistroPostal} from "@/pages";
import HomeDocente from "./pages/docente/HomeDocente";
import { element } from "prop-types";
import HomeAlumno from "./pages/alumno/HomeAlumno";
import HomeAuxiliar from "./pages/auxiliar/HomeAuxiliar";
import HomeAdmin from "./pages/admin/HomeAdmin";
import CrearTaller from "./pages/admin/CrearTaller";
import CrearConvocatoria from "./pages/admin/CrearConvocatoria";
import ListaJurados from "./pages/admin/ListaJurados";
import HomeJurado from "./pages/jurado/HomeJurado";
import Login from "./pages/login/Login";
import ProtectedRoute from "./componentes/ProtectedRoute";
import ResetPassword from "./componentes/ResetPassword";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "Aprender",
    path: "/talleresydiplomados",
    element: <Aprender />,
  },
  {
    name: "Evaluación 1",
    path: "/evaluar/ronda1/:idPostulacion",
    element: <RondaUnoEvaluacion />,
  },
  {
    name: "Registro postal",
    path: "/convocatoria/registropostal",
    element: <RegistroPostal />,
  },
  /*
  {
    name: "Por evaluar",
    path: "/evaluar",
    element: <PostulacionesEvaluar />,
  },
  {
    name: "Ronda final",
    path: "/evaluar/ronda-final",
    element: <RondaFinal />,
  },*/
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  /*
  {
    name: "Ganador",
    path: "/ganador/:id",
    element: <PerfilGanador />,
  },*/
  {
    name: "Taller individual",
    path: "/talleresydiplomados/:id",
    element: <TallerIndividual />,
  },
  {
    name: "convocatorias",
    path: "/convocatorias",
    element: <Convocatorias />,
  },
  {
    name: "Convocatoria individual",
    path: "/convocatoriasyresidencias/:id",
    element: <ConvocatoriaIndividual/>,
  },

  /* {
    name: "prueba-taller",
    path: "/taller-prueba",
    element: <PaginaPruebaTaller />,
  }, */
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
  /*
  {
    name: "PostulacionesPendientesPage",
    path: "/postulaciones/pendientes",
    element: <PostulacionesPendientesPage />
  },*/
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
    ),
  },
  /*{
    name: "Aprobación Taller",
    path: "/vista-aprobacion",
    element: <CrearTaller />,
  },
  {
    name: "Crear convocatoria",
    path: "/crearConvocatoria",
    element: <CrearConvocatoria />,
  },*/
  /*
  {
    name: "Jurados",
    path: "/jurados",
    element: <ListaJurados />,
  },*/
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