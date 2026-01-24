
import axios from "axios";
import api from "./axios"

const API_URL = "http://localhost:8080/api/participantes";

export const getParticipanteById = async (idusuario) =>{
    const res = await api.get(`/participantes/${idusuario}`)
    return res.data;
};

export const registrarParticipantePostal = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/registro-postal`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar participante postal:", error);
    throw error;
  }
};
export const updateParticipante = async (idusuario,data) =>{
    const res = await api.put(`/participantes/${idusuario}`,data)
    return res.data;
};