import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import PasoParticipante from "../componentes/PasoParticipante";
import PasoPostulacion from "../componentes/PasoPostulacion";
import { registrarParticipantePostal } from "../apis/participante_Service";
import { crearPostulacion } from "../apis/postulacionConvocatoria_Service";
import { uploadArchivoPostulacion } from "../apis/archivo_Service";
import { ChevronLeft } from "lucide-react";


const RegistroPostalAux = ({actividad,onVolver}) => {
    const ID_ACTIVIDAD = actividad.idActividad; 
console.log('id',ID_ACTIVIDAD);
  const [paso, setPaso] = useState(1);
  const [participante, setParticipante] = useState(null);
  const handleParticipanteSubmit = async (data) => {
    try {
      const response = await registrarParticipantePostal(data);
      console.log("Participante creado:", response);
      setParticipante(response);
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
    <>
        <button onClick={onVolver} className="text-black px-2 py-1">
              <ChevronLeft size={30} />
        </button>
    <div className="flex justify-center">
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
        </>
  );
};

export default RegistroPostalAux;
