//import axios from "axios";
import api from "./axios";
//const API_URL = "http://localhost:8080/api/ganador";


export const getGanadorById = async (idusuario) =>{
    const res = await api.get(`/ganador/${idusuario}`)
    return res.data;
};

export const actualizarGanador = async (idGanador, ganadorActualizado) => {
  console.log("PUT ganador:", idGanador, ganadorActualizado);

  const response = await api.put(
    `/ganador/${idGanador}`,
    ganadorActualizado
  );

  return response.data;
};

//Subir imagen
export const uploadImagenGanador = async (formData) => {
  const response = await api.post(`/ganador/uploadImagen`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // la URL
};


/**
 * Confirma al ganador de la convocatoria
 * @param {Object} finalista
 * @param {string} finalista.idResultado
 * @param {string} finalista.idPostulacion
 */
export const confirmarGanador = async (finalista) => {
  try {
    const response = await api.post(
      `/ganador/confirmar`,
      {
        idResultado: finalista.idResultado,
        idPostulacion: finalista.idPostulacion,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al confirmar ganador", error);
    throw error;
  }
};

export const getGanadoresByConvocatoria = async (idConvocatoria) =>{
    const res = await api.get(`/ganador/convocatoria/${idConvocatoria}`)
    return res.data;
};

export const existeGanador = async (idConvocatoria) => {
  try {
    const response = await api.get(`/ganador/existe/${idConvocatoria}`);
    return response.data; // boolean
  } catch (error) {
    console.error("Error al verificar existencia de ganador:", error);
    throw error;
  }
};
