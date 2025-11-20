import React, { useState } from "react";
import { Input, Textarea, Button } from "@material-tailwind/react";
import { createTaller } from "@/apis/tallerDiplomadoService";

const Requisitar_Taller = () => {
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

    //Actividad
    tipo:"TALLER_PRESENCIAL",
    estado:"PENDIENTE",
    fechaInicio: "",
    fechaCierre: "",
    fechaResultados: "",
    idPrograma: "PRG2025-00002",
    idDocente: "USU2025-00009"

  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      });
    } catch (error) {
      console.error(error);
      alert("Error al registrar el taller 😢");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 requisitar-taller">
      <main className="flex-grow p-6">
        <div className="bg-white rounded-lg shadow-md p-20">
          <h1 className="text-black text-2xl font-semibold mb-6">Requisitar Taller</h1>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Columna 1 */}
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
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 text-sm"
              >
                Enviar Solicitud de Taller
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Requisitar_Taller;