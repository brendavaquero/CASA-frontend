import {
  Chip,
  Input,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { crearPostulacion } from "../apis/postulacion_Service";
import { useParams, useNavigate } from "react-router-dom";
import { getTallerDiplomadoById } from "../apis/tallerDiplomado_Service";
import FormFileUploadPostulacion from "../componentes/FormFileUploadPostulacion";
import { uploadArchivoPostulacion } from "../apis/archivo_Service"; 
import DialogDefault from "../componentes/DialogDefault";



export function PostulacionForm() {
  const { idActividad } = useParams();
  const navigate = useNavigate();

  const [actividad, setActividad] = useState(null);
  const [postulante, setPostulante] = useState("");
  const [motivo, setMotivo] = useState("");
  
  const [archivo, setArchivo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [aceptoAsistencia, setAceptoAsistencia] = useState(false);
  const [aceptoFotos, setAceptoFotos] = useState(false);


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
  if (!aceptoAsistencia || !aceptoFotos) {
    alert("Debes aceptar los compromisos antes de enviar la postulación.");
    return;
  }

  try {
    // 1. Crear la postulación
    const nueva = await crearPostulacion({
      idUsuario: "USU2025-00011",
      idActividad: actividad.idActividad,
      postulante,
      motivo,
    });

    const idPostulacion = nueva.idPostulacion; // <-- CORRECTO

    // 2. Si requiere archivo
    if (actividad.requiereMuestraTrabajo) {
      if (!archivo) {
        alert("Debes subir un archivo antes de enviar.");
        return;
      }

      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("idPostulacion", idPostulacion);

      await uploadArchivoPostulacion(formData);
    }

    // 3. Mostrar modal de éxito
    setModalOpen(true);

    // 4. (Opcional) Limpiar formulario
    setPostulante("");
    setMotivo("");
    setArchivo(null);

  } catch (error) {
    console.error("Error al enviar postulación:", error);
    alert("Hubo un error, intenta nuevamente.");2
  }
};


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

           {/* Nombre del postualnte: solo mostrar si es taller infantil */}
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
                  className="!border-gray-300 focus:!border-gray-900 bg-white"
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
                className="!border-gray-300 focus:!border-gray-900 bg-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>

            {actividad?.requiereMuestraTrabajo && (
              <div className="flex flex-col gap-1">
                <Typography variant="medium" className="font-medium text-gray-700">
                  Muestra de trabajo
                </Typography>
                <Typography className="text-gray-600 mt-1">
                  Sube una muestra de tu trabajo en formato PDF (no mayor a 20 MB).
                </Typography>

                {/* pasamos setArchivo para que el hijo devuelva el archivo seleccionado */}
                <FormFileUploadPostulacion onFileSelect={setArchivo} />
              </div>
            )}

            {/* Checkbox 1 */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceptoAsistencia}
                onChange={(e) => setAceptoAsistencia(e.target.checked)}
                className="mt-1 h-4 w-4"
                required
              />
              <label className="text-gray-700 text-sm">
                Me comprometo a estar todas las sesiones, en los días y horarios establecidos, 
                y cumplir con todas las actividades.
              </label>
            </div>

            {/* Checkbox 2 */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceptoFotos}
                onChange={(e) => setAceptoFotos(e.target.checked)}
                className="mt-1 h-4 w-4"
                required
              />
              <label className="text-gray-700 text-sm">
                Estoy de acuerdo en que se compartan fotos de las actividades artísticas en las que 
                se utilice mi imagen con fines de promoción y difusión.
              </label>
            </div>


            <Button type="submit" variant="gradient" size="md">
              Enviar
            </Button>
          </form>
          <DialogDefault
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Postulación enviada"
            message="Tu postulación se ha registrado correctamente."
          />
        </div>
      </div>
    </div>
  );
}

export default PostulacionForm;
