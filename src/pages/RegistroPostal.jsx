import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import PasoParticipante from "../componentes/PasoParticipante";
import PasoPostulacion from "../componentes/PasoPostulacion";
import { registrarParticipantePostal } from "../apis/participante_Service";
import { crearPostulacion } from "../apis/postulacionConvocatoria_Service";
import { uploadArchivoPostulacion } from "../apis/archivo_Service";

const ID_ACTIVIDAD = "ACT2026-00028"; // estático por ahora

const RegistroPostal = () => {
  const [paso, setPaso] = useState(1);
  const [participante, setParticipante] = useState(null);

  /* =========================
     PASO 1: PARTICIPANTE
  ========================= */
  const handleParticipanteSubmit = async (data) => {
    try {
      const response = await registrarParticipantePostal(data);
      console.log("Participante creado:", response);
      setParticipante(response); // 👈 guardamos el participante
      setPaso(2);
    } catch (error) {
      console.error(error);
      alert("Error al registrar participante");
    }
  };

  /* =========================
     PASO 2: POSTULACIÓN
  ========================= */
  const handlePostulacionSubmit = async ({ nombreObra, archivo, idActividad }) => {
    try {
      // 1. Crear postulación
      const postulacion = await crearPostulacion({
        idUsuario: participante.idUsuario,
        idActividad,
        nombreObra
      });

      console.log("Postulación creada:", postulacion);

      // 2. Subir archivo
      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("idPostulacion", postulacion.idPostulacion);

      await uploadArchivoPostulacion(formData);

      alert("Registro postal completado correctamente");
      setPaso(1);
      setParticipante(null);

    } catch (error) {
      console.error(error);
      alert("Error al registrar la postulación");
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-3xl p-6">
        <Typography variant="h4" className="mb-2">
          Registro de participación postal
        </Typography>

        <Typography variant="small" className="mb-6 text-gray-600">
          Paso {paso} de 2
        </Typography>

        {paso === 1 && (
          <PasoParticipante onSubmit={handleParticipanteSubmit} />
        )}

        {paso === 2 && (
          <PasoPostulacion
            idActividad={ID_ACTIVIDAD}
            onBack={() => setPaso(1)}
            onSubmitPostulacion={handlePostulacionSubmit}
          />
        )}
      </Card>
    </div>
  );
};

export default RegistroPostal;
