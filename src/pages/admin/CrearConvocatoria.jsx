import React, { useState } from "react";
import { Input, Textarea, Button, Radio } from "@material-tailwind/react";
import FormImageConvocatoria from "@/componentes/FormImageConvocatoria";
import FormBasesPdf from "@/componentes/FormBasesPdf";
import { crearConvocatoria } from "@/apis/convocatorias.js";
const CrearConvocatoria = ({ onConvocatoriaCreada }) => {
    const [imagen, setImagen] = useState(null);
    const [bases, setBases] = useState(null);
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        tipo: "CONVOCATORIA",
        fechaInicio: "",
        fechaCierre: "",
        fechaResultados: "",
        requisitos: "",
        premio: "",
        convocantes:""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        formDataToSend.append(
            "convocatoria",
            new Blob([JSON.stringify(formData)], {
            type: "application/json",
            })
        );

        if (imagen) {
            formDataToSend.append("imagen", imagen);
        }

        if (bases) {
            formDataToSend.append("bases", bases);
        }

        for (let pair of formDataToSend.entries()) {
            console.log(pair[0], pair[1]);
        }

        await crearConvocatoria(formDataToSend);
        onConvocatoriaCreada();
        };


    return (
        <div>
            <main className="flex-grow p-4">
                <div className="bg-white rounded-lg shadow-md p-20">
                    <h1 className="text-2xl font-semibold mb-8">Nueva convocatoria</h1>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                            <Input 
                            variant="static" 
                            label="Nombre de la convocatoria " 
                            placeholder="Ingresa el nombre de la convocatoria"
                            className="text-black text-sm"
                            size="md"
                            required="true"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            />
                            
                            <Textarea 
                            variant="static"
                            label="Descripción *"
                            placeholder="Describe brevemente la descripción..."
                            rows={3}
                            className="text-black text-sm"
                            size="md"
                            required="true"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            />
                            
                            <Input 
                            variant="static"
                            type="date"
                            label="Fecha Inicio"
                            rows={3}
                            className="text-black text-sm"
                            size="md"
                            required="true"
                            name="fechaInicio"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            />
                            <Input 
                            variant="static"
                            type="date"
                            label="Fecha Cierre"
                            rows={3}
                            className="text-black text-sm"
                            size="md"
                            required="true"
                            name="fechaCierre"
                            value={formData.fechaCierre}
                            onChange={handleChange}
                            />
                            <Input
                            type="date" 
                            variant="static"
                            label="Fecha resultados"
                            rows={3}
                            className="text-black text-sm"
                            size="md"
                            name="fechaResultados"
                            required="true"
                            value={formData.fechaResultados}
                            onChange={handleChange}
                            />
                            <Textarea 
                                variant="static"
                                label="Requisitos de Inscripción"
                                placeholder="Requisitos para participar..."
                                rows={2}
                                className="text-black text-sm"
                                size="md"
                                name="requisitos"
                                required="true"
                                value={formData.requisitos}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Columna 2 */}
                        <div className="space-y-4">
                            

                            
                            
                            <Textarea 
                            variant="static"
                            label="Premio"
                            placeholder="premio"
                            rows={2}
                            className="text-black text-sm"
                            size="md"
                            name="premio"
                            value={formData.premio}
                            onChange={handleChange}
                            />
                            <Textarea 
                                variant="static"
                                label="Convocantes"
                                placeholder="convocantes"
                                rows={2}
                                className="text-black text-sm"
                                size="md"
                                name="convocantes"
                                value={formData.convocantes}
                                onChange={handleChange}
                            />
                            <label style={{fontSize:'14px', color:'gray'}}>Carga las Bases:</label>
                            <FormBasesPdf file={bases} setFile={setBases} />
                            <label style={{fontSize:'14px', color:'gray'}}>Carga la imagen de portada:</label>
                            <FormImageConvocatoria file={imagen} setFile={setImagen} />


                        </div>
                        </div>

                        <div className="flex justify-end pt-2 gap-3">
                        <Button
                            type="submit"
                        > Crear convocatoria
                        </Button>

                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CrearConvocatoria;