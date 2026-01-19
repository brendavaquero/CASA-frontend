//import axios from "axios";
import api from "./axios";
const API_URL = "http://localhost:8080/api/evaluacion";

export const getEvaluacionByConvocatoria = async (idConvocatoria) => {
  const res = await api.get(`/evaluacion/convocatoria/${idConvocatoria}`)
  return res.data;
};