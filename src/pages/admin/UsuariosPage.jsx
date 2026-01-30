import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { UserPlus, Trash2, Eye, EyeOff,Pencil } from "lucide-react";
import { createUsuario, getUsuarios, deleteUsuario,updateActivo } from "@/apis/usuarios";
import ModalMensaje from "@/componentes/ModalMensaje";
import EditarUsuario from "@/componentes/EditarUsuario";
import { enviarCorreoRecuperacion } from "@/apis/passwordReset";

const roles = ["ADMINISTRADOR", "DOCENTE", "AUXILIAR", "JURADO","INVITADO"];

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const [modalMsg, setModalMsg] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    contrasenia: "",
    rol: "",
    activo: true,
  });

  // 🔹 Cargar usuarios
  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 🔹 Validaciones
  const validarCampo = (name, value) => {
    let error = "";

    if (!value && name !== "activo") error = "Campo obligatorio";

    if (name === "correo") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Correo inválido";
    }

    if (name === "contrasenia") {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

      if (!passwordRegex.test(value)) {
        error =
          "Mín. 8 caracteres, una letra, un número y un símbolo";
      }

      if (confirmarContrasenia && value !== confirmarContrasenia) {
        setErrors((prev) => ({
          ...prev,
          confirmarContrasenia: "Las contraseñas no coinciden",
        }));
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setForm({ ...form, [name]: newValue });
    validarCampo(name, newValue);
  };
  const handleConfirmarPassword = (value) => {
    setConfirmarContrasenia(value);

    setErrors((prev) => ({
      ...prev,
      confirmarContrasenia:
        value !== form.contrasenia ? "Las contraseñas no coinciden" : "",
    }));
  };

const handleAgregarUsuario = async () => {
  if (Object.values(errors).some((e) => e)) return;

  try {
    await createUsuario(form);
    await cargarUsuarios();

    setOpenModal(false);
    setForm({
      nombre: "",
      apellidos: "",
      correo: "",
      rol: "",
      activo: true,
    });
    setErrors({});

    setModalMsg({
      open: true,
      type: "info",
      title: "Usuario creado",
      message:
        "El usuario fue creado y se le envió un correo para que configure su contraseña",
    });

  } catch (error) {
    const mensaje =
      error.response?.data?.message || "No se pudo crear el usuario";

    setModalMsg({
      open: true,
      type: "error",
      title: "Error",
      message: mensaje,
    });
  }
};



  // 🔹 Eliminar usuario
  /*
  const handleEliminar = (id) => {
    setModalMsg({
      open: true,
      type: "confirm",
      title: "Eliminar usuario",
      message: "¿Deseas eliminar este usuario?",
      onConfirm: async () => {
        await deleteUsuario(id);
        await cargarUsuarios();
        setModalMsg({ open: false });
      },
    });
  };*/
  const handleEliminar = (id) => {
  setModalMsg({
    open: true,
    type: "confirm",
    title: "Desactivar usuario",
    message: "¿Deseas desactivar este usuario?",
    onConfirm: async () => {
      try {
        await updateActivo(id, false);
        await cargarUsuarios();

        setModalMsg({
          open: true,
          type: "info",
          title: "Usuario desactivado",
          message: "El usuario fue desactivado correctamente",
        });
      } catch (error) {
        setModalMsg({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo desactivar el usuario",
        });
      }
    },
  });
};


  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <h2 className="text-xl font-semibold">👥 Usuarios</h2>
        <Button
          variant="contained"
          startIcon={<UserPlus size={18} />}
          sx={{ bgcolor: "black" }}
          onClick={() => setOpenModal(true)}
        >
          Agregar usuario
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.idUsuario}>
                <TableCell>{u.nombre} {u.apellidos}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell>{u.activo ? "Sí" : "No"}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      setUsuarioEditar(u);
                      setOpenEdit(true);
                    }}>
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleEliminar(u.idUsuario)}>
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>Agregar nuevo usuario</DialogTitle>
        <DialogContent className="space-y-4 mt-2">

          <TextField label="Nombre" name="nombre" fullWidth value={form.nombre}
            onChange={handleChange} error={!!errors.nombre} helperText={errors.nombre} />

          <TextField label="Apellidos" name="apellidos" fullWidth value={form.apellidos}
            onChange={handleChange} error={!!errors.apellidos} helperText={errors.apellidos} />

          <TextField label="Correo" name="correo" fullWidth value={form.correo}
            onChange={handleChange} error={!!errors.correo} helperText={errors.correo} />

          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={form.contrasenia}
            onChange={handleChange}
            name="contrasenia"
            error={!!errors.contrasenia}
            helperText={errors.contrasenia}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar contraseña"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmarContrasenia}
            onChange={(e) => handleConfirmarPassword(e.target.value)}
            error={!!errors.confirmarContrasenia}
            helperText={errors.confirmarContrasenia}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField select label="Rol" name="rol" fullWidth value={form.rol}
            onChange={handleChange} error={!!errors.rol} helperText={errors.rol}>
            {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>

          <FormControlLabel
            control={<Switch checked={form.activo} name="activo" onChange={handleChange} />}
            label="Usuario activo"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)} sx={{color:"black"}} >Cancelar</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "black" }}
            disabled={Object.values(errors).some((e) => e)}
            onClick={handleAgregarUsuario}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <ModalMensaje {...modalMsg} onClose={() => setModalMsg({ open: false })} />
        <EditarUsuario
          open={openEdit}
          usuario={usuarioEditar}
          onClose={() => setOpenEdit(false)}
          onUpdated={cargarUsuarios}
        />
    </Box>
  );
};

export default UsuariosPage;
