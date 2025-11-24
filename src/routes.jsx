import { Home, Aprender, Convocatorias, PaginaPruebaTaller, TallerIndividual, PostulacionForm, ProgramasUsuarioPage, PostulacionesPendientesPage } from "@/pages";

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
  }


];

export default routes;