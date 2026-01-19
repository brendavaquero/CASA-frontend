import React, { useState, useEffect } from "react";
import SearchableSelect from "./SearchableSelect";
import { Input, Button, Typography } from "@material-tailwind/react";
import {
    getLenguas,
    getPaises,
    getGradosEstudio,
    getEstados,
    getMunicipiosOaxaca
} from "../apis/catalogo_Service";

const PasoParticipante = ({ onSubmit }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    sexo: "",
    fechaNacimiento: "",
    curp: "",
    numeroTelefono: "",
    codigoPostal: "",
    pais: "",
    estado:"",
    municipio: "",
    gradoEstudio: "",
    ocupacion: "",
    lenguaInd: ""
  });

  
  const [gradosEstudio, setGradosEstudio] = useState([]);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [paises, setPaises] = useState([]);
  const [lenguas, setLenguas] = useState([]);

    useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [grados, lenguas, paises, estados] = await Promise.all([
        getGradosEstudio(),
        getLenguas(),
        getPaises(),
        getEstados()
        ]);

        setGradosEstudio(grados);
        setLenguas(lenguas);
        setPaises(paises);
        setEstados(estados);

      } catch (error) {
        console.error("Error cargando catálogos", error);
      }
    };

    cargarCatalogos();
  }, []);

    useEffect(() => {
        const cargarEstados = async () => {
            if (form.pais === "MEXICO") {
            try {
                const data = await getEstados();
                setEstados(data);
            } catch (error) {
                console.error("Error cargando estados", error);
            }
            } else {
            setEstados([]);
            setForm((prev) => ({ ...prev, estado: "", municipio: "" }));
            }
        };

        cargarEstados();
        }, [form.pais]);



    useEffect(() => {
    const cargarMunicipios = async () => {
      if (form.estado === "OAXACA") {
        try {
          const data = await getMunicipiosOaxaca();
          setMunicipios(data);
        } catch (error) {
          console.error("Error cargando municipios", error);
        }
      } else {
        setMunicipios([]);
        setForm((prev) => ({ ...prev, municipio: "" }));
      }
    };

    cargarMunicipios();
  }, [form.estado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  /* const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };*/

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* BLOQUE: Datos de acceso */}
      <div>
        <Typography variant="h6" className="mb-3">
          Datos del participante
        </Typography>

        <div className="grid gap-4">
          <Input
            label="Nombre(s)"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <Input
            label="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                type="date"
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                required
            />

            <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-800 focus:outline-none"
                required
            >
                <option value="">Sexo</option>
                <option value="M">Mujer</option>
                <option value="H">Hombre</option>
            </select>
            </div>

          <Input
            label="CURP"
            name="curp"
            value={form.curp}
            onChange={handleChange}
            required
          />          
        </div>
      </div>

      <div>
        
    <Typography variant="h6" className="mb-3">
        Datos demográficos
    </Typography>

    <div className="grid gap-4">
        
        {/* Pais */}
        <SearchableSelect
                label="País"
                name="pais"
                value={form.pais}
                options={paises} // [{ value, label }]
                onChange={handleChange}
                required
                />

        {/* Estados de mx */}
        {form.pais === "MEXICO" && (
        <SearchableSelect
                label="Estado"
                name="estado"
                value={form.estado}
                options={estados} // [{ value, label }]
                onChange={handleChange}
                required
                />
        )}

        {/* Municipio (solo si es Oaxaca) */}
        {form.estado === "OAXACA" && (
        <SearchableSelect
                label="Municipio"
                name="municipio"
                value={form.municipio}
                options={municipios} // [{ value, label }]
                onChange={handleChange}
                required
                />
        )}

        {/* Código postal */}
        <Input
        label="Código postal"
        name="codigoPostal"
        type="number"
        value={form.codigoPostal}
        onChange={handleChange}
        required
        />
    </div>
    </div>


      {/* BLOQUE: Datos de contacto */}
      <div>
        <Typography variant="h6" className="mb-3">
          Contacto
        </Typography>

        <div className="grid gap-4">

          <Input
            label="Correo electrónico"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
          <Input
            label="Teléfono"
            name="numeroTelefono"
            value={form.numeroTelefono}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* BLOQUE: perfil cultural */}
      <div>
        <Typography variant="h6" className="mb-3">
          Perfil
        </Typography>

        <div className="grid gap-4">

          {/* Grado de estudios */}
            <select
            name="gradoEstudio"
            value={form.gradoEstudio}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-800 focus:outline-none"
            required
            >
            <option value="">Grado de estudios</option>
            {gradosEstudio.map((grado) => (
                <option key={grado.value} value={grado.value}>
                {grado.label}
                </option>
            ))}
            </select>            

            <Input
                label="Ocupación"
                name="ocupacion"
                value={form.ocupacion}
                onChange={handleChange}
            />
            <SearchableSelect
                label="Lengua"
                name="lenguaInd"
                value={form.lenguaInd}
                options={lenguas} // [{ value, label }]
                onChange={handleChange}
                required
                />


            <Input
                label="Seudónimo"
                name="seudonimo"
                value={form.seudonimo}
                onChange={handleChange}
            />
        </div>
      </div>


      <div className="flex justify-end">
        <Button type="submit">
          Continuar
        </Button>
      </div>
    </form>
  );
};

export default PasoParticipante;
