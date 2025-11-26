import { Home, Aprender, Convocatorias, PaginaPruebaTaller, TallerIndividual, PostulacionForm, ProgramasUsuarioPage, PostulacionesPendientesPage } from "@/pages";
import { Requisitar_Taller} from "@/pages";
import HomeDocente from "./pages/docente/HomeDocente";
import { element } from "prop-types";
import HomeAlumno from "./pages/alumno/HomeAlumno";
import HomeAuxiliar from "./pages/auxiliar/HomeAuxiliar";
import HomeAdmin from "./pages/admin/HomeAdmin";
import CrearTaller from "./pages/admin/CrearTaller";

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
    name: "Taller individual",
    path: "/talleresydiplomados/:id",
    element: <TallerIndividual />,
  },
  {
    name: "convocatorias",
    path: "/convocatorias",
    element: <Convocatorias />,
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
    name: "programas",
    path: "/programas/usuario/:idUsuario",
    element: <ProgramasUsuarioPage />,
  },
  {
    name: "PostulacionesPendientesPage",
    path: "/postulaciones/pendientes",
    element: <PostulacionesPendientesPage />
  },

  {
    name:"Requisitar Taller",
    path:"/requisitar-taller",
    element: <Requisitar_Taller modo="normal" />
  },
  {
    name:"Docente",
    path:"/homeDocente",
    element: <HomeDocente />
  },
  {
    name:"Alumno",
    path:"/homeAlumno",
    element: <HomeAlumno />
  },
  {
    name:"Auxiliar",
    path:"/homeAuxiliar",
    element: <HomeAuxiliar />
  },
  {
    name:"Administrador",
    path:"/homeAdministrador",
    element: <HomeAdmin />
  },
  {
    name: "Aprobación Taller",
    path: "/vista-aprobacion",
    element: <CrearTaller />,
  },
  {
    name: "Docs",
    href: "https://www.material-tailwind.com/docs/react/installation",
    target: "_blank",
    element: "",
  },
];

export default routes;