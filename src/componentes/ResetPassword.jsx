import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import ModalMensaje from "@/componentes/ModalMensaje";
import { resetearContrasenia } from "@/apis/passwordReset";
import bgImage from "@/assets/images/CASA_OAX.jpg";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // 🔐 Validación en tiempo real
  useEffect(() => {
    const newErrors = {};

    if (password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)) {
      newErrors.password =
        "Debe tener mínimo 8 caracteres, letras, números y un símbolo";
    }

    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
  }, [password, confirmPassword]);

  const handleSubmit = async () => {
    if (!token) {
      setModalTitle("Error");
      setModalMessage("Token inválido o inexistente");
      setModalOpen(true);
      return;
    }

    if (Object.keys(errors).length > 0 || !password) return;

    try {
      setLoading(true);
      await resetearContrasenia(token, password);

      setModalTitle("Contraseña actualizada");
      setModalMessage("Ahora puedes iniciar sesión con tu nueva contraseña");
      setModalOpen(true);

      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("El enlace ha expirado o es inválido");
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 420,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: 4,
            p: 5,
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Restablecer contraseña
          </Typography>

          <TextField
            fullWidth
            label="Nueva contraseña"
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirmar contraseña"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? "Guardando..." : "Guardar contraseña"}
          </Button>
        </Box>
      </Box>

      <ModalMensaje
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        confirmText="Aceptar"
        onConfirm={() => setModalOpen(false)}
      />
    </>
  );
};

export default ResetPassword;
