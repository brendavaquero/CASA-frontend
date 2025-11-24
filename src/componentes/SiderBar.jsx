import { NavLink } from "react-router-dom";
import { Home, User, FileText, LogOut } from "lucide-react";

const Sidebar = () => {
  const linkClass =
    "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200";
  const activeClass = "bg-blue-100 text-blue-700 font-medium border-r-4 border-blue-500";

  return (
    <div className="flex flex-col justify-between h-screen w-56 bg-gray-50 border-r">
      <div>
        <nav className="flex flex-col">
          <NavLink
            to="/homeDocente"
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            <Home className="w-5 h-5 mr-3" /> Mis actividades
          </NavLink>

          <NavLink
            to="/perfil"
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            <User className="w-5 h-5 mr-3" /> Perfil
          </NavLink>

          <NavLink
            to="/requisitar-taller"
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            <FileText className="w-5 h-5 mr-3" /> Requisitar Taller
          </NavLink>
{/*
          <NavLink
            to="/postulaciones"
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            <FileText className="w-5 h-5 mr-3" /> Postulaciones
          </NavLink>*/}
        </nav>
      </div>

      <div className="p-4">
        <button className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <LogOut className="w-5 h-5 mr-2" /> Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
