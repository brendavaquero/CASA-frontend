import api from "./axios";

export const loginService = async (correo, contrasenia) => {
  const response = await api.post("/auth/login", {
    correo,
    contrasenia,
  });
  return response.data;
};

export const registerParticipante = async (participanteDto) => {
  try {
    const response = await api.post(
      "/auth/register/participante",
      participanteDto
    );
    return response.data;
  } catch (error) {
    console.error("Error al registrar participante:", error);
    throw error;
  }
};