//import axios from "axios";
import api from "./axios";

//const API_URL = "http://localhost:8080/api/alumnos";

export const getAlumnoTalleres = async (idusuario) =>{
    const res = await api.get(`/alumnos/${idusuario}/talleres`)
    return res.data;
};

export const crearAlumnosDesdePostulaciones = async (postulaciones) => {
  const response = await api.post(
    `/alumnos/crear-desde-postulaciones`,
    postulaciones
  );
  return response.data;
};