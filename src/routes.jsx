import { Home, Aprender, Convocatorias, PaginaPruebaTaller, TallerIndividual, PostulacionForm } from "@/pages";

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
  {
    name: "prueba-taller",
    path: "/taller-prueba",
    element: <PaginaPruebaTaller />,
  },
  {
    name: "postulacion",
    path: "/postular/:idActividad",
    element: <PostulacionForm />,
  }

];

export default routes;