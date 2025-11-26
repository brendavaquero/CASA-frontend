import React, { useState, useEffect } from "react";
import { Input, Textarea, Button, Radio } from "@material-tailwind/react";
import { createTaller, updateActividad, updateTallerDiplo} from "@/apis/tallerDiplomadoService";
import { useNavigate } from "react-router-dom";

const Requisitar_Taller = ({ modo = "normal", taller = null, onVolver, onAprobar }) => {
  const navigate = useNavigate();
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
    idPrograma: "PRG2025-00002",
    idDocente: "USU2025-00009",
  });

  useEffect(() => {
    if (modo === "administrador" && taller) {
      setFormData({ ...taller });
      console.log('taller:',taller);
    }
  }, [modo, taller]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (modo === "administrador" && onAprobar === undefined) {
      console.log("Actualizando taller:", taller.idActividad);

      await updateTallerDiplo(taller.idActividad, formData);

      alert("Cambios guardados correctamente ✔️");
      return;
    }

    if (modo === "administrador" && onAprobar) {
      await updateActividad(taller.idActividad, "AUTORIZADA");
      alert("Taller aprobado correctamente ✔️");
      onAprobar();
      return;
    }

  
    await createTaller(formData);
    alert("Taller registrado con éxito 🎉");

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
    alert("Ocurrió un error 😢");
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 requisitar-taller">
      <main className="flex-grow p-6">
        <div className="bg-white rounded-lg shadow-md p-20">
          <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onVolver}
            className="bg-white-400 text-black px-3 py-1 rounded hover:bg-gray-200"
          >
            ←
          </button>

          <h1 className="text-black text-2xl font-semibold">
            {modo === "administrador" ? "Revisión del Taller" : "Requisitar Taller"}
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
                  onChange={handleChange}
                />
                
                <Textarea 
                  variant="static"
                  label="Descripción *"
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
                  label="Objetivo General *"
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
            { modo === "administrador" && (
              <div className="flex justify-first pt-4">
              <Button
                type="button"
                className={
                   "bg-blue-400 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 text-sm "}
                   onClick={() => {
                    updateTallerDiplo(taller.idActividad, formData)
                      .then(() => alert("Cambios guardados ✔️"))
                      .catch(() => alert("Error al guardar cambios ❌"));
                  }}
              >
                Guardar cambios
              </Button>
            </div>
            )}
            

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className={`${
                  modo === "administrador"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-medium py-2 px-6 rounded-md transition duration-200 text-sm`}
              >
                {modo === "administrador"
                  ? "Aprobar Taller"
                  : "Enviar Solicitud de Taller"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Requisitar_Taller;
