/*import axios from "axios";

const API_URL = "http://localhost:8080/api/postulaciones/taller";*/
//import axios from "axios";
import api from "./axios";
const API_URL = "http://localhost:8080/api/postulaciones";

export const crearPostulacion = async (postulacionData) => {
  try {
    const response = await api.post("/postulaciones", postulacionData);
    return response.data;
  } catch (error) {
    console.error("Error creando postulación:", error);
    throw error;
  }
};

export const getPostulacionById = async (id) => {
  try {
    const response = await api.get(`/postulaciones/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo postulación:", error);
    throw error;
  }
};

export const updateEstadoPostulacion = async (idPostulacion, estado) => {
  const response = await api.put(`/postulaciones/estado/${idPostulacion}`, {
    estadoPos: estado,
  });
  return response.data;
};

/* export const getPostulacionesPendientes = async (idActividad) => {
  const response = await axios.get(`${API_URL}/pendientes/${idActividad}`);
  return response.data; // lista de PostulacionDto
}; */
export const getPostulacionesPendientesConParticipante = async (idActividad) => {
  const response = await api.get(`/postulaciones/pendientes/actividad/${idActividad}`);
  return response.data; // trae postulacion + participante
};


export const seleccionarPostulantes = async (idActividad, idsAprobados) => {
  return api.post(`/postulaciones/seleccionar/${idActividad}`, idsAprobados);
};

export const participantesByIdActivdad =  async(idActividad) =>{
  try {
    const response = await api.get(`/postulaciones/participantes/${idActividad}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo las postulaciones/participantes:", error);
    throw error;
  }
};

/*
export async function getPendientesParaJurado(idJurado, ronda) {
  const params = new URLSearchParams({ idJurado, ronda });

  const response = await fetch(
    `http://localhost:8080/api/postulaciones/pendientes/jurado?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener postulaciones pendientes");
  }

  return response.json();
}*/
export async function getPendientesParaJurado(idJurado, ronda) {
  try {
    const response = await api.get(
      "/postulaciones/pendientes/jurado",
      {
        params: {
          idJurado,
          ronda,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener postulaciones pendientes", error);
    throw error;
  }
}



