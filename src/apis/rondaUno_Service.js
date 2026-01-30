import api from "./axios";

export const cerrarRondaUno = async (idConvocatoria) => {
  try {
    await api.post(`/ronda/uno/cerrar/${idConvocatoria}`);
  } catch (error) {
    console.error("Error al cerrar la ronda uno:", error);
    throw error;
  }
};

export const obtenerFinalistas = async (idConvocatoria) => {
  const response = await api.get(
    `/ronda/uno/finalistas/${idConvocatoria}`
  );
  return response.data;
};

export const entrarRondaFinal = async (idConvocatoria) => {
  try {
    const response = await api.get(`/ronda/final/${idConvocatoria}`);
    return response.data; // List<FinalistaDto>
  } catch (error) {
    console.error("Error al entrar a la ronda final:", error);
    throw error;
  }
};