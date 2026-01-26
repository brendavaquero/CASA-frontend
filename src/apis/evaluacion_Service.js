//import axios from "axios";
import api from "./axios";

//const API_URL = "http://localhost:8080/api/evaluacion";
//const ID_JURADO_ESTATICO = "JUR2025-00001";

export const getEvaluacionRonda1 = async (idPostulacion) => {
  const response = await api.get(
    `/evaluacion/ronda/1/${idPostulacion}`
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
    const response = await api.post(
      `/evaluacion/ronda-uno`,
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
