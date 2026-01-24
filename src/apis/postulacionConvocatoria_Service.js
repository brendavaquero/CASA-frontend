import axios from "axios";
import api from "./axios";

const API_URL = "http://localhost:8080/api/postulaciones/convocatoria";

export const crearPostulacion = async (postulacionData) => {
  try {
    const response = await api.post("/postulaciones/convocatoria", postulacionData);
    return response.data;
  } catch (error) {
    console.error("Error creando participación:", error);
    throw error;
  }
};

export const getPostulacionById = async (id) => {
  try {
    const response = await api.get(`/postulaciones/convocatoria/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo postulación:", error);
    throw error;
  }
};

export const updateEstadoPostulacion = async (idPostulacion, estado) => {
  const response = await axios.put(`/postulaciones/convocatoria/estado/${idPostulacion}`, {
    estadoPos: estado,
  });
  return response.data;
};


export const registrarPostulacionPostal = async (data) => {
  try {
    const response = await axios.post(
      `/postulaciones/convocatoria/registro-postal`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar postulación postal:", error);
    throw error;
  }
};


