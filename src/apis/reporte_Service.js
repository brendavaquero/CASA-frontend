import api from "./axios";

export const obtenerReporteTrimestralActual = async (anio, trimestre) => {
  const response = await api.get("/reportes/trimestral", {
    params: {
      anio,
      trimestre,
    },
  });
  return response.data;
};
