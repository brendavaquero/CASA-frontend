import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Button,
} from "@mui/material";
import { UserCheck, ChevronLeft } from "lucide-react";
import { getUsuarios } from "@/apis/usuarios";
import { createJurado } from "@/apis/jurado";

const AsignarJurados = ({ convocatoria,onVolver }) => {
  const [jurados, setJurados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getUsuarios();
        const soloJurados = data.filter(u => u.rol === "JURADO");
        setJurados(soloJurados);
      } catch (error) {
        console.error("Error al cargar jurados:", error);
      }
    };
    cargarDatos();
  }, []);

  const handleToggle = (idUsuario) => {
    setSeleccionados(prev =>
      prev.includes(idUsuario)
        ? prev.filter(id => id !== idUsuario)
        : [...prev, idUsuario]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSeleccionados(jurados.map(j => j.idUsuario));
    } else {
      setSeleccionados([]);
    }
  };

  const handleAsignar = async () => {
    if (seleccionados.length === 0) return;

    try {
      setLoading(true);

      for (const idUsuario of seleccionados) {
        await createJurado({
          idUsuario,
          idConvocatoria: convocatoria.idActividad,
        });
      }

      setSeleccionados([]);

    } catch (error) {
      console.error("Error al asignar jurados:", error);
    } finally {
      setLoading(false);
    }
  };

  const todosSeleccionados =
    jurados.length > 0 && seleccionados.length === jurados.length;

  return (
    <div className="space-y-4">
        <button onClick={onVolver}>
            <ChevronLeft size={28} />
        </button>
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
              <TableCell><b>Nombre</b></TableCell>
              <TableCell><b>Correo</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jurados.length > 0 ? (
              jurados.map(jurado => (
                <TableRow key={jurado.idUsuario} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={seleccionados.includes(jurado.idUsuario)}
                      onChange={() => handleToggle(jurado.idUsuario)}
                    />
                  </TableCell>
                  <TableCell>
                    {jurado.nombre} {jurado.apellidos}
                  </TableCell>
                  <TableCell>{jurado.correo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay jurados disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-end">
        <Button
          variant="contained"
          sx={{bgcolor:"black"}}
          startIcon={<UserCheck size={18} />}
          onClick={handleAsignar}
          disabled={seleccionados.length === 0 || loading}
        >
          {loading ? "Asignando..." : "Asignar Jurados"}
        </Button>
      </div>
    </div>
  );
};

export default AsignarJurados;
