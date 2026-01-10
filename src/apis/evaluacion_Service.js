import axios from "axios";

const API_URL = "http://localhost:8080/api/evaluacion";
const ID_JURADO_ESTATICO = "JUR2025-00001";

export const getEvaluacionRonda1 = async (idPostulacion) => {
  const response = await axios.get(
    `${API_URL}/ronda/1/${idPostulacion}`
  );
  return response.data;
}

export const EvaluacionService = {
  evaluarRondaUno: async ({
    idPostulacion,
    idJurado,
    calificacion,
    justificacion
  }) => {
    const response = await axios.post(
      `${API_URL}/ronda-uno`,
      {
        idPostulacion,
        idJurado,
        calificacion,
        justificacion
      }
    );

    return response.data;
  }
};
