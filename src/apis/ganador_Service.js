import axios from "axios";

const API_URL = "http://localhost:8080/api/ganador";


export const getGanadorById = async (idusuario) =>{
    const res = await axios.get(`${API_URL}/${idusuario}`)
    return res.data;
};

export const actualizarGanador = async (idGanador, ganadorActualizado) => {
  console.log("PUT ganador:", idGanador, ganadorActualizado);

  const response = await axios.put(
    `${API_URL}/${idGanador}`,
    ganadorActualizado
  );

  return response.data;
};

//Subir imagen
export const uploadImagenGanador = async (formData) => {
  const response = await axios.post(`${API_URL}/uploadImagen`, formData, {
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
    const response = await axios.post(
      `${API_URL}/confirmar`,
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
