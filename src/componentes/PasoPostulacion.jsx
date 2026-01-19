import React, { useState } from "react";
import {
  Input,
  Button,
  Typography
} from "@material-tailwind/react";
import FormFileUploadPostulacion from "./FormFileUploadPostulacion";

const PasoPostulacion = ({ idActividad, onBack, onSubmitPostulacion }) => {

    console.log("PasoPostulacion props:", { idActividad, onBack, onSubmitPostulacion });
  const [archivo, setArchivo] = useState(null);
  const [form, setForm] = useState({
    nombreObra: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!archivo) {
      alert("Debes adjuntar el archivo de la obra");
      return;
    }

    onSubmitPostulacion({
      ...form,
      archivo,
      idActividad
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* BLOQUE: Datos de la obra */}
      <div>
        <Typography variant="h6" className="mb-3">
          Datos de la obra
        </Typography>

        <div className="grid gap-4">
          <Input
            label="Nombre de la obra"
            name="nombreObra"
            value={form.nombreObra}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* BLOQUE: Archivo */}
      <div>
        <Typography variant="h6" className="mb-3">
          Archivo digital
        </Typography>

        <Typography variant="small" className="mb-2 text-gray-600">
          Adjunta el archivo correspondiente a la obra escaneada.
        </Typography>

        <FormFileUploadPostulacion onFileSelect={setArchivo} />
      </div>

      <div className="flex justify-between">
        <Button variant="text" onClick={onBack}>
          Volver
        </Button>

        <Button type="submit">
          Registrar postulación
        </Button>
      </div>
    </form>
  );
};

export default PasoPostulacion;
