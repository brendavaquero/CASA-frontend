import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/images/CASA_OAX.jpg";
import { loginService } from "@/apis/authService";
import ModalMensaje from "@/componentes/ModalMensaje";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    correo: "",
    contrasenia: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Mensaje");

  const validate = () => {
    const newErrors = {};

    if (!correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "Correo no válido";
    }

    if (!contrasenia) {
      newErrors.contrasenia = "La contraseña es obligatoria";
    }

    else if (contrasenia.length < 6) {
      newErrors.contrasenia = "Debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const data = await loginService(correo, contrasenia);
      login(data);

      switch (data.rol) {
        case "ADMINISTRADOR":
          navigate("/homeAdministrador");
          break;
        case "DOCENTE":
          navigate("/homeDocente");
          break;
        case "AUXILIAR":
          navigate("/homeAuxiliar");
          break;
        case "JURADO":
          navigate("/homeJurado");
          break;
        case "PARTICIPANTE":
          navigate("/homeAlumno");
          break;
        default:
          navigate("/home");
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Correo o contraseña incorrectos");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: { xs: 2, md: 15 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 420 },
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(8px)",
            borderRadius: 4,
            padding: 6,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
            BIENVENIDO
          </Typography>

          <TextField
            fullWidth
            label="EMAIL"
            placeholder="correo@ejemplo.com"
            type="email"
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            error={!!errors.correo}
            helperText={errors.correo}
          />

          <TextField
            fullWidth
            label="PASSWORD"
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            error={!!errors.contrasenia}
            helperText={errors.contrasenia}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >

            <Typography
              variant="body2"
              sx={{ cursor: "pointer", color: "text.secondary" }}
            >
              Forgot Password?
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.3,
              borderRadius: 2,
              backgroundColor: "#2e2e2e",
              "&:hover": { backgroundColor: "#1f1f1f" },
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Login"}
          </Button>

          <Typography variant="body2" textAlign="center" mt={3}>
            You don't have an account?{" "}
            <span style={{ color: "#1976d2", cursor: "pointer" }}>
              Register
            </span>
          </Typography>
        </Box>
      </Box>

      <ModalMensaje
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type="error"
        title={modalTitle}
        message={modalMessage}
        confirmText="Aceptar"
        onConfirm={() => setModalOpen(false)}
      />
    </>
  );
};

export default Login;
