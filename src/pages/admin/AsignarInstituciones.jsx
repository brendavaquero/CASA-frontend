import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, Paper, Button, Typography
} from "@mui/material";
import { Building2, ChevronLeft } from "lucide-react";
import { getAllInstituciones } from "@/apis/institucion_Service";
import {
  getInstitucionesByActividad,
  asignarInstitucionesConvocatorias
} from "@/apis/convocatorias";
import {
  getInstitucionesByActividadTaller,
  asignarInstitucionesTaller
} from "@/apis/tallerDiplomado_Service";
import ModalMensaje from "@/componentes/ModalMensaje";

const AsignarInstituciones = ({ actividad, tipoActividad, onVolver }) => {
  const [instituciones, setInstituciones] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");

  /* ===============================
     CARGAR DATOS
  =============================== */
  const cargarDatos = async () => {
    const todas = await getAllInstituciones();

    const asignadas =
      tipoActividad === "TALLER"
        ? await getInstitucionesByActividadTaller(actividad.idActividad)
        : await getInstitucionesByActividad(actividad.idActividad);

    // OJO: el backend regresa idInstitucion
    const idsAsignadas = asignadas.map(i => i.idInstitucion);

    setInstituciones(todas);
    setSeleccionados(idsAsignadas);
  };

  useEffect(() => {
    if (actividad?.idActividad) {
      cargarDatos();
    }
  }, [actividad, tipoActividad]);

  /* ===============================
     CHECK INDIVIDUAL
  =============================== */
  const handleToggle = (idInstitucion) => {
    setSeleccionados(prev =>
      prev.includes(idInstitucion)
        ? prev.filter(id => id !== idInstitucion)
        : [...prev, idInstitucion]
    );
  };

  /* ===============================
     CHECK TODOS
  =============================== */
  const handleSelectAll = (e) => {
    setSeleccionados(
      e.target.checked
        ? instituciones.map(i => i.id)
        : []
    );
  };

  /* ===============================
     ASIGNAR
  =============================== */
  const handleAsignar = async () => {
    setLoading(true);
    try {
      // DTO que espera el backend
      const payload = seleccionados.map(id => ({
        idInstitucion: id
      }));

      if (tipoActividad === "TALLER") {
        await asignarInstitucionesTaller(actividad.idActividad, payload);
      } else {
        await asignarInstitucionesConvocatorias(actividad.idActividad, payload);
      }

      setModalTitle("Éxito");
      setModalMessage("Instituciones asignadas correctamente");
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      setModalTitle("Error");
      setModalMessage("Hubo un error al asignar instituciones");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const todosSeleccionados =
    instituciones.length > 0 &&
    seleccionados.length === instituciones.length;

  return (
    <div className="space-y-4">
      <button onClick={onVolver}>
        <ChevronLeft size={28} />
      </button>

      <Typography variant="h5">
        Asignar Instituciones ({tipoActividad})
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell padding="checkbox">
                <Checkbox
                  checked={todosSeleccionados}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell><b>Institución</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {instituciones.map(inst => (
              <TableRow key={inst.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={seleccionados.includes(inst.id)}
                    onChange={() => handleToggle(inst.id)}
                  />
                </TableCell>
                <TableCell>{inst.nombre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-end">
        <Button
          variant="contained"
          sx={{ bgcolor: "black" }}
          startIcon={<Building2 size={18} />}
          onClick={handleAsignar}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Asignar Instituciones"}
        </Button>
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

export default AsignarInstituciones;
