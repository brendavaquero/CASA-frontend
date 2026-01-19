import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const FinalistaCard = ({ finalista, onSeleccionar }) => {
  // Nombre a renderizar según tipo de actividad
  const nombreMostrar = finalista.infantil
    ? finalista.postulante
    : `${finalista.nombre} ${finalista.apellidos}`;

  const rutaCompleta = `http://localhost:8080${finalista.ruta}`

  return (
    <Card className="shadow-md">
      <CardBody>
        {/* Nombre del participante / postulante */}
        <Typography variant="h6" color="blue-gray" className="mb-2 text-center">
          {nombreMostrar}
        </Typography>

        {/* Nombre de la obra con link */}
        <a
          href={rutaCompleta}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium block mb-2 text-center"
        >
          {finalista.nombreObra}
        </a>

        <Typography color="gray" className="text-sm text-center">
          Promedio: {finalista.promedio}
        </Typography>
      </CardBody>

      <CardFooter className="pt-0">
        <Button
          className="gradient"
          fullWidth
          onClick={() => onSeleccionar(finalista)}
        >
          Seleccionar ganador
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinalistaCard;
