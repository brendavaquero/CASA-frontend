import axios from "axios";

const API_URL = "http://localhost:8080/api/postulaciones";

export const crearPostulacion = async (postulacionData) => {
  try {
    const response = await axios.post(API_URL, postulacionData);
    return response.data;
  } catch (error) {
    console.error("Error creando postulación:", error);
    throw error;
  }
};

export const getPostulacionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo postulación:", error);
    throw error;
  }
};

export const updateEstadoPostulacion = async (idPostulacion, estado) => {
  const response = await axios.put(`${API_URL}/estado/${idPostulacion}`, {
    estadoPos: estado,
  });
  return response.data;
};

/* export const getPostulacionesPendientes = async (idActividad) => {
  const response = await axios.get(`${API_URL}/pendientes/${idActividad}`);
  return response.data; // lista de PostulacionDto
}; */
export const getPostulacionesPendientesConParticipante = async (idActividad) => {
  const response = await axios.get(`${API_URL}/pendientes/actividad/${idActividad}`);
  return response.data; // trae postulacion + participante
};


export const seleccionarPostulantes = async (idActividad, idsAprobados) => {
  return axios.post(`${API_URL}/seleccionar/${idActividad}`, idsAprobados);
};


