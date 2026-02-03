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
import ModalMensaje from "./ModalMensaje";



const PasoParticipante = ({ onSubmit, pedirContrasenia = false,loading }) => {
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
    numeroTelefono: "+",
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
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("Mensaje");
    const [modalMessage, setModalMessage] = useState("");

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

  
  

  /* =======================
     HANDLERS
  ======================== */
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

  /*
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
};*/
const handleSubmit = async (e) => {
  e.preventDefault();
    if (loading) return;
  try {
    if (form.curp.length === 18) {
      const existe = await validarCurp(form.curp);
      if (existe) {
        //alert("El CURP ya está registrado");
        setModalTitle("Exito");
        setModalMessage("El CURP ya está registrado");
        setModalOpen(true);
        return;
      }
    }

    await onSubmit(form); 

  } catch (error) {
    console.error("Error en la validación de CURP", error);
    //alert("Ocurrió un error validando el CURP");
    setModalTitle("Error");
    setModalMessage("Ocurrió un error validando el CURP");
    setModalOpen(true);
  }
};


  const cpBloqueaCampos = form.codigoPostal.length === 5;
  const municipiosFinales = cpBloqueaCampos
  ? [{ value: form.municipio, label: form.municipio }]
  : municipios;


  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* =======================
         DATOS PERSONALES
      ======================== */}
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

            <select name="sexo" value={form.sexo} onChange={handleChange} className="w-full rounded-md border px-3 py-2 text-sm" required>
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
            maxLength={18}
          /> 
          {errors.curp && (
                  <Typography variant="small" color="red">
                    {errors.curp}
                  </Typography>
                )}  

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
            inputMode="numeric"
            /*placeholder="+52XXXXXXXXXX"*/
            maxLength={16}
          />
          <Typography variant="small" className="text-gray-500 mt-1">
            Ingresa número con lada
          </Typography>
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
        {/*<Button type="submit">Continuar</Button>*/}
        <Button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Continuar"}
        </Button>
      </div>
    </form>
    <ModalMensaje
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                message={modalMessage}
                autoClose
                autoCloseTime={10000}
            />
     </>
  );
};

export default PasoParticipante;