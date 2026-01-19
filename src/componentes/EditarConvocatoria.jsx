import React, { useState, useEffect } from "react";
import { Input, Textarea, Button } from "@material-tailwind/react";
import FormImageConvocatoria from "@/componentes/FormImageConvocatoria";
import FormBasesPdf from "@/componentes/FormBasesPdf";
import { updateConvocatoria } from "@/apis/convocatorias";
import { ChevronLeft } from "lucide-react";

const EditarConvocatoria = ({
  convocatoria,
  onVolver,
  onConvocatoriaActualizada
}) => {
  const [imagen, setImagen] = useState(null); 
  const [bases, setBases] = useState(null);  

  const [imagenActual, setImagenActual] = useState("");
  const [basesActual, setBasesActual] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    premio: "",
    convocantes: "",
    fechaInicioR1: "",
    fechaLimiteR1: "",
    requisitos: ""
  });


  useEffect(() => {
    if (!convocatoria) return;

    setFormData({
      titulo: convocatoria.titulo || "",
      descripcion: convocatoria.descripcion || "",
      premio: convocatoria.premio || "",
      convocantes: convocatoria.convocantes || "",
      fechaInicioR1: convocatoria.fechaInicioR1 || "",
      fechaLimiteR1: convocatoria.fechaLimiteR1 || "",
      fechaInicioR2: convocatoria.fechaInicioR2 || "",
      fechaLimiteR2: convocatoria.fechaLimiteR2 || "",
      requisitos: convocatoria.requisitos || ""
    });

    setImagenActual(convocatoria.imagen || "");
    setBasesActual(convocatoria.bases || "");

  }, [convocatoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append(
      "convocatoria",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    if (imagen) data.append("imagen", imagen);
    if (bases) data.append("bases", bases);

    await updateConvocatoria(convocatoria.idActividad, data);

    onConvocatoriaActualizada();
  };


  return (
    <div>
      <button onClick={onVolver} className="text-black px-4 py-2">
        <ChevronLeft size={30} />
      </button>

      <main className="flex-grow p-4">
        <div className="bg-white rounded-lg shadow-md p-10">
          <h1 className="text-2xl font-semibold mb-8">Editar convocatoria</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* COLUMNA 1 */}
              <div className="space-y-4">
                <Input
                  variant="static"
                  label="Nombre de la convocatoria"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                />

                <Textarea
                  variant="static"
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />

                <Textarea
                  variant="static"
                  label="Requisitos"
                  name="requisitos"
                  value={formData.requisitos}
                  onChange={handleChange}
                />
                <Textarea
                  variant="static"
                  label="Premio"
                  name="premio"
                  value={formData.premio}
                  onChange={handleChange}
                />
                <Textarea
                  variant="static"
                  label="Convocantes"
                  name="convocantes"
                  value={formData.convocantes}
                  onChange={handleChange}
                />
              </div>

              {/* COLUMNA 2 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="font-light mb-5">Fechas de Evaluación:</h2>
                  <div className="flex gap-4 items-center">
                        <Input
                          variant="static"
                          label="Fecha Inicio:"
                          type="date"
                          name="fechaInicioR1"
                          value={formData.fechaInicioR1}
                          onChange={handleChange}
                        />

                        <Input
                          variant="static"
                          label="Fecha Límite:"
                          type="date"
                          name="fechaLimiteR1"
                          value={formData.fechaLimiteR1}
                          onChange={handleChange}
                      />
                  </div>
              </div>
                {/* BASES */}
                <label className="text-sm text-gray-600">
                  Bases actuales: 
                </label>

                {basesActual && (
                  <a
                    href={`http://localhost:8080${basesActual}`}
                    target="_blank"
                    className="text-black text-sm underline"
                  >
                    Ver PDF actual
                  </a>
                )}

                <FormBasesPdf file={bases} setFile={setBases} />

                {/* IMAGEN */}
                <label className="text-sm text-gray-600">
                  Imagen actual:
                </label>

                {imagenActual && (
                  <img
                    src={`http://localhost:8080${imagenActual}`}
                    alt="Imagen convocatoria"
                    className="w-full h-40 object-cover rounded"
                  />
                )}

                <FormImageConvocatoria file={imagen} setFile={setImagen} />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="gradient">
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarConvocatoria;
