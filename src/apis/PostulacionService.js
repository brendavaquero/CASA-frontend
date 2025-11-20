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
