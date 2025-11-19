import { Home, Aprender, Convocatorias, PaginaPruebaTaller } from "@/pages";

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
    name: "convocatorias",
    path: "/convocatorias",
    element: <Convocatorias />,
  },
  {
    name: "prueba-taller",
    path: "/taller-prueba",
    element: <PaginaPruebaTaller />,
  },

];

export default routes;