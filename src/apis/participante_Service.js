
import axios from "axios";

const API_URL = "http://localhost:8080/api/participantes";

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