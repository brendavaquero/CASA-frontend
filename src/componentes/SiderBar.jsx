import { NavLink,useNavigate } from "react-router-dom";
import { Home, User, Users2Icon, FileText, LogOut, Menu, X,BookPlus, NotebookTabs,BookImage,ClipboardList,NotebookPen,Camera } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ role,open, onSelect, activeSection,onToggle,onLogoutClick  }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const linkClass =
    "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition";
  const activeClass =
    "bg-gray-200 text-blue-700 font-medium border-r-4 border-black";

  const menuItems = [
    //Para admin
    {
      label: "Talleres y Diplomados",
      key:"TALLERES_DIPLO",
      icon: NotebookTabs,
      roles: ["ADMINISTRADOR"],
    },
    {
      label: "Mis talleres",
      key: "MIS_TALLERES",
      icon: Home,
      roles: ["DOCENTE" ,"PARTICIPANTE"],
    },
    {
      label: "Evidencias Talleres",
      key: "EVIDENCIAS",
      icon: Camera,
      roles: ["AUXILIAR","INVITADO"],
    },
    {
      label: "Convocatorias y Residencias",
      key: "CONVOCATORIAS_RESI",
      icon: BookImage,
      roles: ["ADMINISTRADOR","JURADO","AUXILIAR"],
    },
    {
      label: "Crear Convocatoria",
      key: "CREAR_CONVOCATORIA",
      icon: BookPlus,
      roles: ["ADMINISTRADOR"],
    },
    {
      label: "Requisitar Taller",
      key: "REQUISITAR_TALLER",
      icon: NotebookPen,
      roles: ["DOCENTE"],
    },
    {
      label: "Usuarios",
      key: "USUARIOS",
      icon: Users2Icon,
      roles: ["ADMINISTRADOR"],
    },
    {
      label: "Perfil",
      to: "/perfil",
      icon: User,
      roles: ["DOCENTE", "AUXILIAR", "ADMINISTRADOR"],
    },
  ];

  return (
    <>
       {!open && (
        <button
          className="absolute bg-black left-4 z-50 p-2 text-white hover:bg-gray-600 rounded"
          onClick={onToggle}
        >
          <Menu />
        </button>
      )}

      <div
        className={`relative h-full bg-gray-50 border-r flex flex-col
        transition-all duration-300
        ${open ? "w-56" : "w-0 overflow-hidden"}`}
      >
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <span className="font-semibold text-lg">Menú</span>
          <button onClick={onToggle}>
            <X />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {menuItems
            .filter(item => item.roles.includes(role))
            .map(({ label, key, icon: Icon }) => (
              <NavLink
                key={key}
                onClick={() => onSelect(key)}
                className={`${linkClass} ${
                  activeSection === key ? activeClass : ""
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </NavLink>
            ))}
        </nav>

        <div className="shrink-0 p-4">
          <button onClick={onLogoutClick} className="flex items-center justify-center w-full py-2 bg-black text-white rounded hover:bg-gray-700">
            <LogOut className="w-5 h-5 mr-2" />
            Log out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
