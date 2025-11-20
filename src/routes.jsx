import { Home, Profile, SignIn, SignUp, Requisitar_Taller} from "@/pages";
import HomeDocente from "./pages/docente/HomeDocente";
import { element } from "prop-types";
import HomeAlumno from "./pages/alumno/HomeAlumno";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "profile",
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "Sign In",
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    name: "Sign Up",
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    name:"Requisitar Taller",
    path:"/requisitar-taller",
    element: <Requisitar_Taller />
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
    name: "Docs",
    href: "https://www.material-tailwind.com/docs/react/installation",
    target: "_blank",
    element: "",
  },
];

export default routes;
