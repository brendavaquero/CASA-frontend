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
    estado: "",
    municipio: "",
    gradoEstudio: "",
    ocupacion: "",
    lenguaInd: "",
    seudonimo: ""
  });

  const [gradosEstudio, setGradosEstudio] = useState([]);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [paises, setPaises] = useState([]);
  const [lenguas, setLenguas] = useState([]);

  /* =======================
     CARGA DE CATÁLOGOS
  ======================== */
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [grados, lenguasData, paisesData, estadosData] =
          await Promise.all([
            getGradosEstudio(),
            getLenguas(),
            getPaises(),
            getEstados()
          ]);

        setGradosEstudio(grados);
        setLenguas(lenguasData);
        setPaises(paisesData);
        setEstados(estadosData);
      } catch (error) {
        console.error("Error cargando catálogos", error);
      }
    };

    cargarCatalogos();
  }, []);

  /* =======================
     🔹 LÓGICA CÓDIGO POSTAL (COPOMEX)
     🔹 ÚNICO useEffect
  ======================== */
  useEffect(() => {
    const buscarCP = async () => {
      if (
        form.pais === "MEXICO" &&
        /^\d{5}$/.test(form.codigoPostal)
      ) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/codigo-postal/${form.codigoPostal}`
          );

          if (!res.ok) return;

          const data = await res.json();

          setForm((prev) => ({
            ...prev,
            estado: data.estado.toUpperCase(),
            municipio: data.municipio.toUpperCase()
          }));
        } catch (error) {
          console.error("Error consultando CP", error);
        }
      }
    };

    buscarCP();
  }, [form.codigoPostal, form.pais]);

  /* =======================
     MUNICIPIOS OAXACA
     (solo si NO hay CP)
  ======================== */
  useEffect(() => {
    const cargarMunicipios = async () => {
      if (
        form.estado === "OAXACA" &&
        form.codigoPostal.length !== 5
      ) {
        try {
          const data = await getMunicipiosOaxaca();
          setMunicipios(data);
        } catch (error) {
          console.error("Error cargando municipios", error);
        }
      }
    };

    cargarMunicipios();
  }, [form.estado, form.codigoPostal]);

  /* =======================
     HANDLERS
  ======================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const cpBloqueaCampos = form.codigoPostal.length === 5;
  const municipiosFinales = cpBloqueaCampos
  ? [{ value: form.municipio, label: form.municipio }]
  : municipios;


  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* =======================
         DATOS PERSONALES
      ======================== */}
      <div>
        <Typography variant="h6" className="mb-3">
          Datos del participante
        </Typography>

        <div className="grid gap-4">
          <Input label="Nombre(s)" name="nombre" value={form.nombre} onChange={handleChange} required />
          <Input label="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} required />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="date" label="Fecha de nacimiento" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />

            <select name="sexo" value={form.sexo} onChange={handleChange} className="w-full rounded-md border px-3 py-2 text-sm" required>
              <option value="">Sexo</option>
              <option value="M">Mujer</option>
              <option value="H">Hombre</option>
            </select>
          </div>

          <Input label="CURP" name="curp" value={form.curp} onChange={handleChange} required />
        </div>
      </div>

      {/* =======================
         DATOS DEMOGRÁFICOS
      ======================== */}
      <div>
        <Typography variant="h6" className="mb-3">
          Datos demográficos
        </Typography>

        <div className="grid gap-4">
          <SearchableSelect label="País" name="pais" value={form.pais} options={paises} onChange={handleChange} required />

          {form.pais === "MEXICO" && (
            <SearchableSelect
              label="Estado"
              name="estado"
              value={form.estado}
              options={estados}
              onChange={handleChange}
              disabled={cpBloqueaCampos}
              required
            />
          )}

          {form.estado === "OAXACA" && (
            <SearchableSelect
              label="Municipio"
              name="municipio"
              value={form.municipio}
              options={municipiosFinales}
              onChange={handleChange}
              disabled={cpBloqueaCampos}
              required
            />
          )}

          <Input
            label="Código postal"
            name="codigoPostal"
            type="text"
            value={form.codigoPostal}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* =======================
         CONTACTO
      ======================== */}
      <div>
        <Typography variant="h6" className="mb-3">
          Contacto
        </Typography>

        <div className="grid gap-4">
          <Input label="Correo electrónico" name="correo" value={form.correo} onChange={handleChange} required />
          <Input label="Teléfono" name="numeroTelefono" value={form.numeroTelefono} onChange={handleChange} />
        </div>
      </div>

      {/* =======================
         PERFIL
      ======================== */}
      <div>
        <Typography variant="h6" className="mb-3">
          Perfil
        </Typography>

        <div className="grid gap-4">
          <select name="gradoEstudio" value={form.gradoEstudio} onChange={handleChange} className="w-full rounded-md border px-3 py-2 text-sm" required>
            <option value="">Grado de estudios</option>
            {gradosEstudio.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>

          <Input label="Ocupación" name="ocupacion" value={form.ocupacion} onChange={handleChange} />
          <SearchableSelect label="Lengua" name="lenguaInd" value={form.lenguaInd} options={lenguas} onChange={handleChange} required />
          <Input label="Seudónimo" name="seudonimo" value={form.seudonimo} onChange={handleChange} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  );
};

export default PasoParticipante;
