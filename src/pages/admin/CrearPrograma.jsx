import { useEffect, useState } from "react";
import {
  TextField,
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
import { FolderPlus } from "lucide-react";
import { getUsuarios } from "@/apis/usuarios";
import { createPrograma } from "@/apis/programa_Service";

const CrearPrograma = ({ onSuccess }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  /* 1️⃣ Cargar usuarios INVITADO */
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await getUsuarios();
        const invitados = data.filter(u => u.rol === "INVITADO");
        setUsuarios(invitados);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    cargarUsuarios();
  }, []);

  /* 2️⃣ Selección */
  const handleToggle = (idUsuario) => {
    setSeleccionados(prev =>
      prev.includes(idUsuario)
        ? prev.filter(id => id !== idUsuario)
        : [...prev, idUsuario]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSeleccionados(usuarios.map(u => u.idUsuario));
    } else {
      setSeleccionados([]);
    }
  };

  /* 3️⃣ Crear programa */
  const handleCrearPrograma = async () => {
    if (!nombre.trim()) return;

    try {
      setLoading(true);

      const payload = {
        nombre,
        descripcion,
        responsables: seleccionados.map(id => ({ idUsuario: id })),
      };

      await createPrograma(payload);

      setNombre("");
      setDescripcion("");
      setSeleccionados([]);

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Error al crear programa:", error);
    } finally {
      setLoading(false);
    }
  };

  const todosSeleccionados =
    usuarios.length > 0 && seleccionados.length === usuarios.length;

  return (
    <div className="space-y-6">
        <h1>Nuevo programa</h1>
      {/* FORMULARIO */}
      <div className="grid  gap-4">
        <TextField
          label="Nombre del programa"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
        />

        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
      </div>

      {/* TABLA */}
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
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <TableRow key={usuario.idUsuario} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={seleccionados.includes(usuario.idUsuario)}
                      onChange={() => handleToggle(usuario.idUsuario)}
                    />
                  </TableCell>
                  <TableCell>
                    {usuario.nombre} {usuario.apellidos}
                  </TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay usuarios INVITADO disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* BOTÓN */}
      <div className="flex justify-end">
        <Button
          variant="contained"
          startIcon={<FolderPlus size={18} />}
          onClick={handleCrearPrograma}
          disabled={loading || !nombre}
        >
          {loading ? "Creando..." : "Crear Programa"}
        </Button>
      </div>
    </div>
  );
};

export default CrearPrograma;
