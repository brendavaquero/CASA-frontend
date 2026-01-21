import React, { useState } from "react";
import { obtenerReporteTrimestralActual } from "../apis/reporte_Service";
import { generarReportePDF } from "../utils/generarReportePDF";

const DescargarReporteTrimestral = () => {
  const [cargando, setCargando] = useState(false);

  const obtenerAnioYTrimestreActual = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = hoy.getMonth() + 1;

    let trimestre;
    if (mes <= 3) trimestre = 1;
    else if (mes <= 6) trimestre = 2;
    else if (mes <= 9) trimestre = 3;
    else trimestre = 4;

    return { anio, trimestre };
  };

  const descargarReporte = async () => {
  try {
    setCargando(true);

    const { anio, trimestre } = obtenerAnioYTrimestreActual();
    const response = await obtenerReporteTrimestralActual(anio, trimestre);

    console.log("Response completa:", response);
    console.log("Response.data:", response.data);

    generarReportePDF(response);

  } catch (error) {
    console.error(error);
    alert("No se pudo generar el reporte");
  } finally {
    setCargando(false);
  }
};

  return (
    <button onClick={descargarReporte} disabled={cargando}>
      {cargando ? "Generando reporte..." : "Descargar reporte trimestral"}
    </button>
  );
};

export default DescargarReporteTrimestral;