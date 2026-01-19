import axios from "axios";

const API_URL = "http://localhost:8080/api/catalogos";

export const getPaises = async () => {
  const res = await axios.get(`${API_URL}/paises`);
  return res.data;
};

export const getLenguas = async () => {
  const res = await axios.get(`${API_URL}/lenguas`);
  return res.data;
};

export const getGradosEstudio = async () => {
  const res = await axios.get(`${API_URL}/grados-estudio`);
  return res.data;
};

export const getEstados = async () => {
  const res = await axios.get(`${API_URL}/estados`);
  return res.data;
};

export const getMunicipiosOaxaca = async () => {
  const res = await axios.get(`${API_URL}/municipios/oaxaca`);
  return res.data;
};
