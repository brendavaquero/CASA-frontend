import React, { useState, useEffect } from "react";
import SearchableSelect from "./SearchableSelect";
import { Input, Button, Typography } from "@material-tailwind/react";
import { Eye, EyeOff } from "lucide-react";
import { IconButton } from "@material-tailwind/react";
import {
    getLenguas,
    getPaises,
    getGradosEstudio,
    getEstados,
    getMunicipiosOaxaca
} from "../apis/catalogo_Service";
import { validarCurp } from "../apis/participante_Service";



const PasoParticipante = ({ onSubmit, pedirContrasenia = false }) => {
  // separación visual de apellidos
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]*$/;
  const curpRegex =
  /^[A-Z][AEIOU][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/;
  const curpCharsRegex = /^[A-Za-z0-9]*$/;


  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    contrasenia: "",
    sexo: "",
    fechaNacimiento: "",
    curp: "",
    numeroTelefono: "",
    codigoPostal: "",
    pais: "",
    estado: null,
    municipio: null,
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
  const [errors, setErrors] = useState({});


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
            setForm((prev) => ({ ...prev, estado: null, municipio: null }));
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
        setForm((prev) => ({ ...prev, municipio: null }));
      }
    };

    cargarMunicipios();
  }, [form.estado]);

  useEffect(() => {
    const apellidosConcatenados = `${apellidoPaterno} ${apellidoMaterno}`.trim();

    setForm((prev) => ({
      ...prev,
      apellidos: apellidosConcatenados
    }));
  }, [apellidoPaterno, apellidoMaterno]);

  const obtenerPrimerVocalInterna = (texto) => {
    const match = texto.slice(1).match(/[AEIOUÁÉÍÓÚ]/i);
    return match ? match[0] : "X";
  };

  /* useEffect(() => {
    if (
      form.nombre &&
      apellidoPaterno &&
      apellidoMaterno &&
      form.fechaNacimiento
    ) {
      const nombre = form.nombre.toUpperCase().trim();
      const paterno = apellidoPaterno.toUpperCase().trim();
      const materno = apellidoMaterno.toUpperCase().trim();

      const curpBase =
        paterno[0] +
        obtenerPrimerVocalInterna(paterno) +
        materno[0] +
        nombre[0];

      setForm((prev) => ({
        ...prev,
        curp: curpBase + prev.curp.slice(4) // conserva lo demás si ya escribió
      }));
    }
  }, [form.nombre, apellidoPaterno, apellidoMaterno, form.fechaNacimiento]); */

  const obtenerFechaCurp = (fechaISO) => {
    if (!fechaISO) return "";

    const [year, month, day] = fechaISO.split("-");
    return year.slice(2) + month + day;
  };

  useEffect(() => {
    if (!form.nombre || !apellidoPaterno || !apellidoMaterno) return;

    const nombre = form.nombre.toUpperCase().trim();
    const paterno = apellidoPaterno.toUpperCase().trim();
    const materno = apellidoMaterno.toUpperCase().trim();

    const letrasIniciales =
      paterno[0] +
      obtenerPrimerVocalInterna(paterno) +
      materno[0] +
      nombre[0];

    const fechaCurp = obtenerFechaCurp(form.fechaNacimiento); // AAMMDD
    const sexoCurp = form.sexo ? form.sexo.toUpperCase() : "";

    const curpAutogenerada = letrasIniciales + fechaCurp + sexoCurp;

    setForm((prev) => ({
      ...prev,
      curp:
        curpAutogenerada +
        prev.curp.slice(curpAutogenerada.length)
    }));
  }, [
    form.nombre,
    apellidoPaterno,
    apellidoMaterno,
    form.fechaNacimiento,
    form.sexo
  ]);

  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Solo letras para nombre y apellidos
    if ((name === "nombre" || name === "apellidos") && !soloLetrasRegex.test(value)) {
      return; // no actualiza el estado
    }

    // 🔹 CURP: solo letras y números
  if (name === "curp") {
    if (!curpCharsRegex.test(value)) return;

    const curpUpper = value.toUpperCase();

    if (curpUpper.length === 18 && !curpRegex.test(curpUpper)) {
      error = "CURP inválida";
    }

    setForm((prev) => ({
      ...prev,
      curp: curpUpper
    }));

    setErrors((prev) => ({
      ...prev,
      curp: error
    }));

    return; }

    if (name === "contrasenia") {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

      if (!passwordRegex.test(value)) {
        error =
          "Mín. 8 caracteres, una letra, un número y un símbolo";
      }
    }

    if (name === "fechaNacimiento") {
    const hoy = new Date();
    const fechaNac = new Date(value);

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < fechaNac.getDate())
    ) {
      edad--;
    }

    if (edad < 15) {
      error = "Debes tener al menos 15 años de edad";
    }
  }


    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };


  /* const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }; */


  /* const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };*/

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1️⃣ Validación CURP solo si tiene 18 caracteres
    if (form.curp.length === 18) {
      const existe = await validarCurp(form.curp); // llama a tu service con Axios
      if (existe) {
        setModalMessage("El CURP ya está registrado");
        setModalOpen(true);
        return; // ❌ Detiene el envío si ya existe
      }
    }

    // 2️⃣ Si todo bien, envía el formulario al padre
    onSubmit(form);

  } catch (error) {
    console.error("Error en la validación de CURP", error);
    setModalMessage("Ocurrió un error validando el CURP");
    setModalOpen(true);
  }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Apellido paterno"
              value={apellidoPaterno}
              onChange={(e) => {
                if (!soloLetrasRegex.test(e.target.value)) return;
                setApellidoPaterno(e.target.value);
              }}
              required
            />

            <Input
              label="Apellido materno"
              value={apellidoMaterno}
              onChange={(e) => {
                if (!soloLetrasRegex.test(e.target.value)) return;
                setApellidoMaterno(e.target.value);
              }}
              //required
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
                type="date"
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                error={!!errors.fechaNacimiento}
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
          {errors.curp && (
                  <Typography variant="small" color="red">
                    {errors.curp}
                  </Typography>
                )}  

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
          Credenciales de acceso y contacto
        </Typography>

        <div className="grid gap-4">

          <Input
            label="Correo electrónico"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
          />

          {pedirContrasenia && (
            <div>
              <div className="grid gap-4">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  name="contrasenia"
                  value={form.contrasenia}
                  onChange={handleChange}
                  error={!!errors.contrasenia}
                  required
                  icon={
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="!absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  }
                />

                {errors.contrasenia && (
                  <Typography variant="small" color="red">
                    {errors.contrasenia}
                  </Typography>
                )}

              </div>
            </div>
          )}



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
