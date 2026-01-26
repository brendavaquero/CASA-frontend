import {
  Chip,
  Input,
  Button,
  Typography
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { crearPostulacion } from "../apis/postulacionConvocatoria_Service";
import { useParams } from "react-router-dom";
import { getConvocatoriaById } from "../apis/convocatoria_Service";
import FormFileUploadPostulacion from "../componentes/FormFileUploadPostulacion";
import { uploadArchivoPostulacion } from "../apis/archivo_Service"; 
import DialogDefault from "../componentes/DialogDefault";
import { useAuth } from "../context/AuthContext";
import { AuthRequiredModal } from "../componentes/AuthRequiredModal";

export function PostulacionConvocatoriaForm() {
  const { idActividad } = useParams();
  const [actividad, setActividad] = useState(null);  
  const [archivo, setArchivo] = useState(null);
  const [nombreObra, setNombreObra] = useState("");
  const [postulante, setPostulante] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const usuario = user;

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const response = await getConvocatoriaById(idActividad);
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
    console.log("handleSubmit ejecutado");

    try {
      if (!actividad) {
        alert("La convocatoria aún no ha cargado");
        return;
      }

      if (!archivo) {
        alert("Debes subir un archivo para participar.");
        return;
      }

      setLoading(true);

      console.log("Actividad:", actividad);
      console.log("Archivo:", archivo);

      // 1. Crear postulación
      const nueva = await crearPostulacion({
        idUsuario: usuario.idUsuario,
        idActividad: actividad.idActividad,
        postulante,
        nombreObra
      });

      console.log("Postulación creada:", nueva);

      const idPostulacion = nueva.idPostulacion;
      console.log("idPostulacion:", idPostulacion);

      // 2. Subir archivo
      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("idPostulacion", idPostulacion);

      console.log("Subiendo archivo");
      const uploadResponse = await uploadArchivoPostulacion(formData);
      console.log("Archivo subido:", uploadResponse);

      // 3. Mostrar modal de éxito
    setModalOpen(true);

    // 4. limpiar formulario
    setPostulante("");
    setNombreObra("");
    setArchivo(null);

    } catch (error) {
      console.error("Error al enviar participación:", error);

      if (error.response) {
        // ⚠️ Caso: ya existe la postulación
        if (error.response.status === 409) {
          alert(error.response.data.message || 
                "Ya estás registrado en esta actividad.");
          return;
        }

        // Otros errores del backend
        alert("Error del servidor. Intenta más tarde.");
      } else {
        // Error de red o conexión
        alert("No se pudo conectar con el servidor.");
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-50 pb-0 pt-24">
      <div className="flex flex-col lg:flex-row gap-6 p-6 pb-32">

        {/* INFO CONVOCATORIA */}
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

        {/* FORMULARIO */}
        <div className="w-[90%] lg:w-2/5 mx-auto flex flex-col gap-4">
          <Typography variant="h4" className="text-gray-800 font-semibold">
            Formulario de participación
          </Typography>

          <Typography className="text-gray-600 mt-1">
            Sube tu participación en formato PDF (no mayor a 20 MB) y según lo indicado en las bases.
          </Typography>

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

            <div className="flex flex-col gap-1">
                          <Typography variant="medium" className="font-medium text-gray-700">
                            Nombre de la obra
                          </Typography>
            
                          <Input
                            size="lg"
                            placeholder="Escribe el nombre de la obra participante."
                            value={nombreObra}
                            onChange={(e) => setNombreObra(e.target.value)}
                            className="!border-gray-300 focus:!border-gray-900 bg-white"
                            labelProps={{
                              className: "before:content-none after:content-none",
                            }}
                            required
                          />
                        </div>

          <form className="mt-6 flex flex-col gap-6">
            <FormFileUploadPostulacion onFileSelect={setArchivo} />

            {/* BOTÓN CONTROLADO */}
            <Button
              type="button"
              variant="gradient"
              size="md"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>

          <DialogDefault
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Participación enviada"
            message="Tu participación se ha registrado correctamente."
          />
        </div>
      </div>
    </div>
  );
}

export default PostulacionConvocatoriaForm;
