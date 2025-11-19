import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Chip,
  Tooltip,
  Avatar,
} from "@material-tailwind/react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function TallerDetalle({ actividad }) {
  const {
    titulo,
    descripcion,
    tipo,
    docente,
    docenteFoto,
    fechaInicio,
    fechaCierre,
    fechaResultados,
    requisitos,
    estado,
    imagen,
    cupo,
    objetivoGeneral,
    objetivosEspecificos,
    temas,
    materialSol,
    criteriosSeleccion,
    notas,
    numSesiones
  } = actividad;

  const formatoFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex flex-col h-screen relative bg-gray-50 pb-24">
      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto pb-32">
        {/* Imagen */}
        <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md">
          <img
            src={imagen}
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

          <div className="flex items-center space-x-3 pt-0">
            <Tooltip content= {docente}>
            <Avatar
              size="sm"
              variant="circular"
              alt={docente}
              src={docenteFoto}
              className="border-2 border-none hover:z-10"
            />
          </Tooltip>
          <Typography variant="small" color="blue-gray" className="font-medium">
            por {docente}
          </Typography>
          </div>
            

          <Typography className="text-gray-600 leading-relaxed">
            {descripcion}
          </Typography>

          {/* Datos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            

            <div className="p-4 bg-white shadow-sm rounded-xl">
              <Typography variant="small" className="text-gray-500">Fecha de inicio</Typography>
              <Typography className="font-medium">{formatoFecha(fechaInicio)}</Typography>
            </div>

            <div className="p-4 bg-white shadow-sm rounded-xl">
              <Typography variant="small" className="text-gray-500">Publicación de resultados</Typography>
              <Typography className="font-medium">{formatoFecha(fechaResultados)}</Typography>
            </div>
          </div>

          {/* Secciones de contenido */}
          <div className="flex flex-col gap-4 mt-4">
            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Objetivo general</Typography>
              <Typography className="text-gray-700 mt-1">{objetivoGeneral}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Objetivos específicos</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{objetivosEspecificos}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Temas</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{temas}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Material solicitado</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{materialSol}</Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-semibold text-gray-800">Criterios de selección</Typography>
              <Typography className="text-gray-700 mt-1 whitespace-pre-line">{criteriosSeleccion}</Typography>
            </section>

            {notas && (
              <section>
                <Typography variant="h6" className="font-semibold text-gray-800">Notas</Typography>
                <Typography className="text-gray-700 mt-1 whitespace-pre-line">{notas}</Typography>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Barra inferior fija */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700">
          <CalendarDaysIcon className="h-5 w-5" />
          <Typography variant="small">
            Postúlate antes del: <span className="font-semibold">{formatoFecha(fechaCierre)}</span>
          </Typography>
        </div>

        <Button variant="gradient" size="lg">
          Postular
        </Button>
      </div>
    </div>
  );
}
