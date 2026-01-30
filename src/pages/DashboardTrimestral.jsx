// pages/DashboardTrimestral.jsx
import { useEffect, useState } from "react";
import { MetricCard } from "../componentes/MetricCard";
import { PieChartBlock } from "../componentes/PieChartBlock";
import { obtenerReporteTrimestralActual } from "../apis/reporte_Service";
import { Typography, Spinner } from "@material-tailwind/react";

export default function DashboardTrimestral() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const reporte = await obtenerReporteTrimestralActual(2026, 1); 
        setData(reporte);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el reporte.");
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
        <span className="ml-2">Cargando dashboard...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );

  if (!data) return null;

  const { talleres, convocatorias, anio, trimestre } = data;

  return (
    <div className="p-6 space-y-8">
      {/* Título */}
      <Typography variant="h4">
        Dashboard {anio} · Trimestre {trimestre}
      </Typography>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {talleres.totalActividades > 0 && (
          <MetricCard title="Talleres" value={talleres.totalActividades} />
        )}
        {talleres.totalPersonas > 0 && (
          <MetricCard
            title="Personas en talleres"
            value={talleres.totalPersonas}
          />
        )}
        {convocatorias.totalActividades > 0 && (
          <MetricCard
            title="Convocatorias"
            value={convocatorias.totalActividades}
          />
        )}
        {convocatorias.totalPersonas > 0 && (
          <MetricCard
            title="Personas en convocatorias"
            value={convocatorias.totalPersonas}
          />
        )}
      </div>

      {/* Gráficas de Convocatorias */}
      <Typography variant="h5">Convocatorias</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {convocatorias.porSexo?.length > 0 && (
          <PieChartBlock title="Por sexo" data={convocatorias.porSexo} />
        )}
        {convocatorias.porRangoEdad?.length > 0 && (
          <PieChartBlock
            title="Por rango de edad"
            data={convocatorias.porRangoEdad}
          />
        )}
        {convocatorias.porPais?.length > 0 && (
          <PieChartBlock title="Por país" data={convocatorias.porPais} />
        )}
        {convocatorias.porEstado?.length > 0 && (
          <PieChartBlock title="Por estado" data={convocatorias.porEstado} />
        )}
      </div>

      {/* Gráficas de Talleres (opcional, si hay datos) */}
      {talleres.totalPersonas > 0 && (
        <>
          <Typography variant="h5">Talleres</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {talleres.porSexo?.length > 0 && (
              <PieChartBlock title="Por sexo" data={talleres.porSexo} />
            )}
            {talleres.porRangoEdad?.length > 0 && (
              <PieChartBlock
                title="Por rango de edad"
                data={talleres.porRangoEdad}
              />
            )}
            {talleres.porPais?.length > 0 && (
              <PieChartBlock title="Por país" data={talleres.porPais} />
            )}
            {talleres.porEstado?.length > 0 && (
              <PieChartBlock title="Por estado" data={talleres.porEstado} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
