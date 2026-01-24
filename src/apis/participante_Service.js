import api from "./axios";

export const registrarParticipantePostal = async (data) => {
  try {
    const response = await api.post(
      `participantes/registro-postal`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar participante postal:", error);
    throw error;
  }
};

export const crearParticipante = async (participanteDto) => {
  try {
    const response = await api.post("/participantes", participanteDto);
    return response.data;
  } catch (error) {
    console.error("Error al crear participante:", error);
    throw error;
  }
};

export const crearParticipantePublico = async (participanteDto) => {
  try {
    const response = await api.post("/participantes/publico", participanteDto);
    return response.data;
  } catch (error) {
    console.error("Error al crear participante público:", error);
    throw error;
  }
};