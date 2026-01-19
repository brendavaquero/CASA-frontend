import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export function ConvocatoriaCard({
  id,
  titulo,
  descripcion,
  imagen,
  tipo,
  estado,
  fechaInicio,
  fechaCierre
}) {
  // formateo de fechas opcional
  const formatoFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <Link to={`/convocatoriasyresidencias/${id}`}>
    <Card className="max-w-[24rem] overflow-hidden shadow-lg border border-gray-100">
      <CardHeader
        floated={false}
        shadow={false}
        color="bg-black/40"
        className="m-0 rounded-none"
      >
        <img
          src={
            imagen ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
          }
          alt={titulo}
          className="object-cover h-56 w-full"
        />
      </CardHeader>

      <CardBody>
        <div className="flex items-center justify-between mb-2">
          <Typography variant="h4" color="blue-gray">
            {titulo}
          </Typography>
          <Chip
            value={tipo}
            color="blue"
            size="sm"
            variant="ghost"
            className="capitalize"
          />
         
        </div>
        <Typography variant="paragraph" color="gray" className="font-normal">
          {descripcion}
        </Typography>

      </CardBody>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="mt-0">
          <div className="pt-0 flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
              <Typography variant="h6" color="blue-gray" className="font-medium">
                {estado}
              </Typography>
          </div>
            <Typography variant="small" color="gray" className="font-medium">
              Inicia el {formatoFecha(fechaInicio)}
            </Typography>
            <Typography variant="small" color="gray" className="font-medium">
              Postúlate antes del {formatoFecha(fechaCierre)}
            </Typography>
        </div>
      </CardFooter>

    </Card>
    </Link>
  );
}
