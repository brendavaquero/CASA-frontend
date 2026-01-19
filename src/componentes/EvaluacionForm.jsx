import {
  Typography,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";

export default function EvaluacionForm({ obra, onEnviar }) {
  const [calificacion, setCalificacion] = useState("");
  const [justificacion, setJustificacion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onEnviar({
      calificacion: Number(calificacion),
      justificacion,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="flex flex-col items-center text-center gap-1">
        <Typography variant="h5" className="font-medium text-gray-800">
          {obra.titulo}
        </Typography>
        <Typography variant="small" color="gray">
          por {obra.autor}
        </Typography>
      </div>

      <div className="flex flex-col mt-8 gap-1">
        <Typography variant="medium" className="font-medium text-gray-700">
          Calificación (0-100)
        </Typography>

        <Input
          type="number"
          size="lg"
          placeholder="Ingrese su calificación."
          value={calificacion}
          onChange={(e) => setCalificacion(e.target.value)}
          className="!border-gray-300 focus:!border-gray-900 bg-white"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          required
        />

        <Typography variant="medium" className="font-medium text-gray-700">
          Justificación
        </Typography>

        <Textarea
          size="lg"
          placeholder="Describa brevemente los criterios que fundamentan su calificación."
          value={justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
          className="!border-gray-300 focus:!border-gray-900 bg-white"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
          required
        />

        <Typography variant="small" className="mt-4 text-gray-600">
          Las obras presentadas son propiedad de sus autores. Su acceso es exclusivo
          para fines de evaluación. Queda prohibida su reproducción, descarga o difusión.
        </Typography>

        <Button type="submit" variant="gradient" size="md" className="mt-4">
          Enviar
        </Button>
      </div>
    </form>
  );
}
