import {
  Chip,
  Input,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { crearPostulacion } from "../apis/PostulacionService";
import { useParams, useNavigate } from "react-router-dom";
import { getTallerDiplomadoById } from "../apis/TallerDiplomadoService";

export function PostulacionForm() {
  const { idActividad } = useParams();
  const navigate = useNavigate();

  const [actividad, setActividad] = useState(null);
  const [postulante, setPostulante] = useState("");
  const [motivo, setMotivo] = useState("");
  

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const response = await getTallerDiplomadoById(idActividad);

        console.log("RESPONSE:", response);
        setActividad(response.data);
      } catch (error) {
        console.error("Error cargando actividad:", error);
      }
    };
    fetchActividad();
  }, [idActividad]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {

      // id de usuario de prueba existente en la bd
      idUsuario: "USU2025-00011",
      idActividad: actividad.idActividad,
      postulante,
      motivo,
    };

    try {
      await crearPostulacion(payload);
      navigate("/postulacion-exitosa");
    } catch (error) {
      console.error("Error al crear postulación:", error);
    }
  };

  if (!actividad) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-50 pb-0 pt-24">
      <div className="flex flex-col lg:flex-row gap-6 p-6 pb-32">
        <div className="w-[90%] lg:w-2/5 mx-auto flex flex-col gap-4">

          <Typography variant="h3" className="font-bold text-gray-800">
            {actividad?.titulo ?? ""}
          </Typography>

          <Chip
              value={actividad?.tipo ?? ""}
              color="blue"
              size="sm"
              variant="ghost"
              className="capitalize w-fit"
          />
          <Typography className="text-gray-600 leading-relaxed">
            {actividad?.descripcion ?? ""}
          </Typography>
        </div>

        <div className="w-[90%] lg:w-2/5 mx-auto flex flex-col gap-4">

          <Typography variant="h4" className="text-gray-800 font-semibold">
            Formulario de postulación
          </Typography>

          <Typography className="text-gray-600 mt-1">
            Completa tus datos para postular a esta actividad.
          </Typography>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">

           {/* Solo mostrar si es taller infantil */}
            {actividad?.infantil && (
              <div className="flex flex-col gap-1">
                <Typography variant="medium" className="font-medium text-gray-700">
                  Nombre del postulante
                </Typography>

                <Input
                  size="lg"
                  placeholder="Nombre completo del niño o niña participante"
                  value={postulante}
                  onChange={(e) => setPostulante(e.target.value)}
                  className="!border-gray-300 focus:!border-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  required
                />
              </div>
            )}


            {/* Motivo */}
            <div className="flex flex-col gap-1">
              <Typography variant="medium" className="font-medium text-gray-700">
                Motivo de postulación
              </Typography>

              <Textarea
                size="lg"
                placeholder="Describe brevemente por qué deseas participar."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="!border-gray-300 focus:!border-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>

            <Button variant="gradient" size="md">
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostulacionForm;
