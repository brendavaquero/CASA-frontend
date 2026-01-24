import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { updateUsuario } from "@/apis/usuarios";

const roles = ["ADMINISTRADOR", "DOCENTE", "AUXILIAR", "JURADO", "INVITADO"];

const EditarUsuario = ({
  open,
  onClose,
  usuario,
  onUpdated, // callback
}) => {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    rol: "",
    activo: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setForm({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo,
      });
    }
  }, [usuario]);

  const validarCampo = (name, value) => {
    let error = "";

    if (!value && name !== "activo") error = "Campo obligatorio";

    if (name === "correo") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Correo inválido";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({ ...prev, [name]: newValue }));
    validarCampo(name, newValue);
  };

  const handleGuardar = async () => {
    if (Object.values(errors).some((e) => e)) return;

    try {
      setLoading(true);
      await updateUsuario(usuario.idUsuario, form);

      onUpdated?.();     // avisar al padre
      onClose();
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        "No se pudo actualizar el usuario";

      setErrors((prev) => ({
        ...prev,
        correo: mensaje,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar usuario</DialogTitle>

      <DialogContent className="space-y-4 mt-2">
        <TextField
          label="Nombre"
          name="nombre"
          fullWidth
          value={form.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
        />

        <TextField
          label="Apellidos"
          name="apellidos"
          fullWidth
          value={form.apellidos}
          onChange={handleChange}
          error={!!errors.apellidos}
          helperText={errors.apellidos}
        />

        <TextField
          label="Correo"
          name="correo"
          fullWidth
          value={form.correo}
          onChange={handleChange}
          error={!!errors.correo}
          helperText={errors.correo}
        />

        <TextField
          select
          label="Rol"
          name="rol"
          fullWidth
          value={form.rol}
          onChange={handleChange}
          error={!!errors.rol}
          helperText={errors.rol}
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={form.activo}
              name="activo"
              onChange={handleChange}
            />
          }
          label="Usuario activo"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: "black" }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "black" }}
          onClick={handleGuardar}
          disabled={loading}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarUsuario;
