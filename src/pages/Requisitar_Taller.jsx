import React, { useState, useEffect } from "react";
import { Input, Textarea, Button, Radio } from "@material-tailwind/react";
import { createTaller, updateActividad, updateTallerDiplo} from "@/apis/tallerDiplomado_Service";
import { useNavigate } from "react-router-dom";
import ModalMensaje from "@/componentes/ModalMensaje";
import { enviarCorreo } from "@/apis/emailService";
import { getDocenteById } from "@/apis/docente_Service";

const Requisitar_Taller = ({ modo = "normal", taller = null, onVolver, onAprobar,docente }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");
  const [docenteInfo, setDocenteInfo] = useState(null);
  console.log('docente',docente);

  useEffect(() => {
    const cargarDocente = async () => {
      try {
        if (
          modo === "ADMINISTRADOR" &&
          taller?.idDocente
        ) {
          const data = await getDocenteById(taller.idDocente);
          setDocenteInfo(data);
          console.log("d",data);
        }
      } catch (error) {
        console.error("Error al cargar docente:", error);
      }
    };

    cargarDocente();
  }, [modo, taller]);
  const [formData, setFormData] = useState({
    titulo: "",
    cupo: "",
    descripcion: "",
    objetivoGeneral: "",
    objetivosEspecificos: "",
    temas: "",
    requisitos: "",
    materialSol: "",
    criteriosSeleccion: "",
    notas: "",
    imagen: "",
    requiereMuestraTrabajo: false,
    tipo: "TALLER",
    estado: "PENDIENTE",
    fechaInicio: "",
    fechaCierre: "",
    fechaResultados: "",
    infantil: false,
    idDocente: docente.idUsuario,
  });

  useEffect(() => {
    if (modo === "ADMINISTRADOR" && taller) {
      setFormData({ ...taller });
      console.log('taller:',taller);
    }
  }, [modo, taller]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "cupo") {
      const error = validarCupo(value);
      setErrors(prev => ({
        ...prev,
        cupo: error
      }));
    }
  };
  const notificarDocente = async ({ estado }) => {
    const info = modo === "ADMINISTRADOR" ? docenteInfo : docente;
    if (!info?.correo) return;

    const asunto =
      estado === "AUTORIZADA"
        ? "Tu taller ha sido aprobado – CaSa"
        : "Tu taller ha sido rechazado – CaSa";

    const mensaje =
      estado === "AUTORIZADA"
        ? `
  Hola ${info.nombre} ${info.apellidos},

  Nos complace informarte que tu taller "${taller.titulo}" ha sido APROBADO.

  Ya puedes iniciar sesión para revisar los detalles y dar seguimiento.

  ¡Gracias por formar parte del Centro de las Artes de San Agustín!
        `
        : `
  Hola ${info.nombre} ${info.apellidos},

  Te informamos que tu taller "${taller.titulo}" ha sido RECHAZADO.

  Te solicitamos nos contactes directamente para más información.

  Saludos cordiales,
  Centro de las Artes de San Agustín
        `;

    await enviarCorreo({
      correo: info.correo,
      asunto,
      mensaje,
    });
  };


  const onRechazar = async () => {
    await updateActividad(taller.idActividad, "RECHAZADA");
    await notificarDocente({ estado: "RECHAZADA" });
    setModalTitle("Advertencia");
    setModalMessage("Taller rechazado");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cupoError = validarCupo(formData.cupo);
    if (cupoError) {
      setErrors({ cupo: cupoError });
      return;
    }

    try {
      if (modo === "ADMINISTRADOR" && onAprobar === undefined) {
        console.log("Actualizando taller:", taller.idActividad);

        await updateTallerDiplo(taller.idActividad, formData);
        setModalTitle("Exito");
        setModalMessage("Cambios guardados correctamente ✔️");
        setModalOpen(true);
        return;
      }

      if (modo === "ADMINISTRADOR" && onAprobar) {
        await updateActividad(taller.idActividad, "AUTORIZADA");
        await notificarDocente({ estado: "AUTORIZADA" });
        setModalTitle("Exito");
        setModalMessage("Taller aprobado correctamente ✔️");
        setModalOpen(true);
        onAprobar();
        return;
      }

      console.log('form',formData);
      await createTaller(formData);

      setModalTitle("Exito");
      setModalMessage("Taller registrado con éxito");
      setModalOpen(true);

      setFormData({
        titulo: "",
        cupo: "",
        descripcion: "",
        objetivoGeneral: "",
        objetivosEspecificos: "",
        temas: "",
        requisitos: "",
        materialSol: "",
        criteriosSeleccion: "",
        notas: "",
        imagen: "",
        requiereMuestraTrabajo: false,
        infantil: false,
      });

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Error inesperado";
      setModalTitle("Error");
      setModalMessage(msg);
      setModalOpen(true);
    }
  };
  const mostrarModal = (titulo, mensaje) => {
    setModalTitle(titulo);
    setModalMessage(mensaje);
    setModalOpen(true);
  };
  const validarCupo = (value) => {
    const cupoNum = Number(value);

    if (!value) {
      return "El cupo es obligatorio";
    }

    if (isNaN(cupoNum)) {
      return "El cupo debe ser un número";
    }

    if (cupoNum <= 0) {
      return "El cupo debe ser mayor a 0";
    }

    if (cupoNum > 30) {
      return "El cupo no puede ser mayor a 30";
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 requisitar-taller">
      
        <div className="bg-white rounded-lg shadow-md p-20">
          <div className="flex items-center gap-4 mb-6">
            {( modo === "ADMINISTRADOR" &&
              <button
                onClick={onVolver}
                className="bg-white-400 text-black px-3 py-1 rounded hover:bg-gray-200"
              >
                ←
              </button>
            )}
            
          <h1 className="text-black text-2xl font-semibold">
            {modo === "ADMINISTRADOR" ? "Revisión del Taller" : "Requisitar Taller"}
          </h1>
        </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              
              <div className="space-y-4">
                <Input 
                  variant="static" 
                  label="Nombre del Taller" 
                  placeholder="Ingresa el nombre del taller"
                  className="text-black text-sm"
                  size="md"
                  required="true"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                />
                
                <Input 
                  variant="static" 
                  label="Cupo" 
                  type="number"
                  placeholder="Ej: 30"
                  className="text-black text-sm"
                  size="md"
                  required="true"
                  name="cupo"
                  value={formData.cupo}
                  min={1}
                  max={30}
                  onChange={handleChange}
                />
                {errors.cupo && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.cupo}
                  </p>
                )}
                
                <Textarea 
                  variant="static"
                  label="Descripción"
                  placeholder="Describe brevemente el taller..."
                  rows={3}
                  className="text-black text-sm"
                  size="md"
                  required="true"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
                
                <Textarea 
                  variant="static"
                  label="Objetivo General"
                  placeholder="Objetivo principal del taller..."
                  rows={3}
                  className="text-black text-sm"
                  size="md"
                  required="true"
                  name="objetivoGeneral"
                  value={formData.objetivoGeneral}
                  onChange={handleChange}
                />
                <Textarea 
                  variant="static"
                  label="Objetivos Específicos *"
                  placeholder="Lista los objetivos específicos..."
                  rows={3}
                  className="text-black text-sm"
                  size="md"
                  required="true"
                  name="objetivosEspecificos"
                  value={formData.objetivosEspecificos}
                  onChange={handleChange}
                />
                <Textarea 
                  variant="static"
                  label="Temas *"
                  placeholder="Temas que se cubrirán..."
                  rows={3}
                  className="text-black text-sm"
                  size="md"
                  name="temas"
                  required="true"
                  value={formData.temas}
                  onChange={handleChange}
                />
              </div>

              {/* Columna 2 */}
              <div className="space-y-4">
                
                <Textarea 
                  variant="static"
                  label="Requisitos de Inscripción"
                  placeholder="Requisitos para participar..."
                  rows={2}
                  className="text-black text-sm"
                  size="md"
                  name="requisitos"
                  value={formData.requisitos}
                  onChange={handleChange}
                />
                
                <Textarea 
                  variant="static"
                  label="Material Solicitado"
                  placeholder="Material necesario..."
                  rows={2}
                  className="text-black text-sm"
                  size="md"
                  name="materialSol"
                  value={formData.materialSol}
                  onChange={handleChange}
                />
                
                <Textarea 
                  variant="static"
                  label="Criterios de Selección"
                  placeholder="Criterios para seleccionar..."
                  rows={2}
                  className="text-black text-sm"
                  size="md"
                  name="criteriosSeleccion"
                  value={formData.criteriosSeleccion}
                  onChange={handleChange}
                />
                
                <Textarea 
                  variant="static"
                  label="Notas"
                  placeholder="Notas adicionales..."
                  rows={2}
                  className="text-black text-sm"
                  size="md"
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                />
                <div className="flex flex-col space-y-2">
                  <span className="font-small text-sm text-black">¿Requiere muestra de trabajo?</span>

                  <div className="flex gap-6 items-center">
                    <Radio
                      name="requiereMuestraTrabajo"
                      label="Sí"
                      value="true"
                      checked={formData.requiereMuestraTrabajo === true}
                      onChange={() =>
                        setFormData({ ...formData, requiereMuestraTrabajo: true })
                      }
                    />

                    <Radio
                      name="requiereMuestraTrabajo"
                      label="No"
                      value="false"
                      checked={formData.requiereMuestraTrabajo === false}
                      onChange={() =>
                        setFormData({ ...formData, requiereMuestraTrabajo: false })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <span className="font-small text-sm text-black">¿Taller para menores de edad?</span>

                  <div className="flex gap-6 items-center">
                    <Radio
                      name="infantil"
                      label="Sí"
                      value="true"
                      checked={formData.infantil === true}
                      onChange={() =>
                        setFormData({ ...formData, infantil: true })
                      }
                    />


                    <Radio
                      name="infantil"
                      label="No"
                      value="false"
                      checked={formData.infantil === false}
                      onChange={() =>
                        setFormData({ ...formData, infantil: false })
                      }
                    />
                  </div>
                </div>

              </div>
            </div>
            { modo === "ADMINISTRADOR" && (
              <div className="flex justify-first pt-4">
              <Button
                type="button"
                variant="gradient" size="md"
                onClick={async () => {
                  try {
                    await updateTallerDiplo(taller.idActividad, formData);
                    mostrarModal(
                      "Éxito",
                      "Los cambios del taller se guardaron correctamente"
                    );
                  } catch (error) {
                    mostrarModal(
                      "Error",
                      "Ocurrió un error al guardar los cambios"
                    );
                  }
                }}
              >
                Guardar cambios
              </Button>
            </div>
            )}
            

            <div className="flex justify-end pt-2 gap-3">
              {modo === "ADMINISTRADOR" && (
                <Button
                  onClick={onRechazar}
                  className="bg-red-400 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition duration-200 text-sm"
                >
                  Rechazar
                </Button>
              )}

              <Button
                type="submit"
                className={`${
                  modo === "ADMINISTRADOR"
                    ? "bg-green-400 hover:bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-medium py-2 px-6 rounded-md transition duration-200 text-sm`}
              >
                {modo === "ADMINISTRADOR"
                  ? "Aprobar Taller"
                  : "Enviar Solicitud de Taller"}
              </Button>

            </div>

          </form>
        </div>
        <ModalMensaje
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          message={modalMessage}
          autoClose
          autoCloseTime={10000}
        />
    </div>
  );
};

export default Requisitar_Taller;
