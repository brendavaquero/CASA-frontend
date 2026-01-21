//import axios from "axios";
import api from "./axios";

//const API_URL = "http://localhost:8080/api/catalogos";

export const getPaises = async () => {
  const res = await api.get(`/catalogos/paises`);
  return res.data;
};

export const getLenguas = async () => {
  const res = await api.get(`/catalogos/lenguas`);
  return res.data;
};

export const getGradosEstudio = async () => {
  const res = await api.get(`/catalogos/grados-estudio`);
  return res.data;
};

export const getEstados = async () => {
  const res = await api.get(`/catalogos/estados`);
  return res.data;
};

export const getMunicipiosOaxaca = async () => {
  const res = await api.get(`/catalogos/municipios/oaxaca`);
  return res.data;
};
