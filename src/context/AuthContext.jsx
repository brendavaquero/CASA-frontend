//VERSION INICIAL
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() =>
      JSON.parse(localStorage.getItem("user"))
  );

  //const isAuthenticated = !!user && !!localStorage.getItem("token");
  const isAuthenticated = !!user;


  const login = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


/*import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // 🔹 Cargar sesión al iniciar la app
  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  /**
   * 🔐 LOGIN
   * @param {Object} data - datos del usuario (token, rol, nombre, etc)
   * @param {boolean} remember - si se debe persistir la sesión

  const login = (data, remember = false) => {
    setUser(data);

    const storage = remember ? localStorage : sessionStorage;

    storage.setItem("auth", JSON.stringify(data));
    storage.setItem("token", data.token);

    // Limpia el otro storage por seguridad
    (remember ? sessionStorage : localStorage).clear();
  };

  /**
   * 🚪 LOGOUT

  const logout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

   * 🔄 Sincroniza cambios entre pestañas

  useEffect(() => {
    const syncLogout = () => {
      if (
        !localStorage.getItem("auth") &&
        !sessionStorage.getItem("auth")
      ) {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);*/

