//import axios from "axios";
import api from "./axios";

//const API_URL = "http://localhost:8080/api/ronda-uno";

export const obtenerFinalistas = async (idConvocatoria) => {
  const response = await api.get(
    `/ronda-uno/finalistas/${idConvocatoria}`
  );
  return response.data;
};