import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Chip
} from "@material-tailwind/react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function ConvocatoriaDetalle({ actividad }) {
  const navigate = useNavigate();

  const {
    titulo,
    descripcion,
    tipo,    
    fechaInicio,
    fechaCierre,
    fechaResultados,
    requisitos,
    imagen,
    bases,
    premio,
    convocantes
  } = actividad;

  const formatoFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const imagenUrl = `http://localhost:8080${imagen}`;
  const basesUrl = `http://localhost:8080${bases}`;

  // debug
  console.log("[ActDetalle] actividad:", actividad);
  console.log("[TallerDetalle] idActividad:", actividad.idActividad);

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-50 pb-0">
      <div className="flex flex-col lg:flex-row gap-6 p-6 pb-32">

        {/* Imagen */}
        <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md h-96">
          <img
            src={imagenUrl}
            alt={titulo}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Información */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <Typography variant="h3" className="font-bold text-gray-800">
            {titulo}
          </Typography>

          <Chip
              value={tipo}
              color="blue"
              size="sm"
              variant="ghost"
              className="capitalize w-fit"
          />     

          <Typography className="text-gray-600 leading-relaxed">
            {descripcion}

          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            

            <div className="p-4 bg-white shadow-sm rounded-xl">
              <Typography variant="small" className="text-gray-500">Fecha de inicio</Typography>
              <Typography className="font-medium">{formatoFecha(fechaInicio)}</Typography>
            </div>

            <div className="p-4 bg-white shadow-sm rounded-xl">
              <Typography variant="small" className="text-gray-500">Fecha de cierre</Typography>
              <Typography className="font-medium">{formatoFecha(fechaCierre)}</Typography>
            </div>
          </div>

          {/* Secciones de contenido */}
          <div className="flex flex-col gap-4 mt-4">

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Premio</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{premio}</Typography>
            </section>
            
            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Requisitos</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{requisitos}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Bases</Typography>
              {basesUrl ? (
                <a
                  href={basesUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-1 inline-block"
                >
                  Descargar las bases completas
                </a>
              ) : (
                <Typography className="text-gray-500 mt-1">
                  No hay archivo disponible
                </Typography>
                )}
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Convocantes</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{convocantes}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Publicación de ganadores</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{formatoFecha(fechaResultados)}</Typography>
            </section>

          </div>
        </div>
      </div>

      {/* Barra inferior fija */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700">
          
        </div>

        <Button variant="gradient" size="lg" onClick={() => navigate(`/participar/${actividad.idActividad}`)}>
          Participar
        </Button>
      </div>
    </div>
  );
}
