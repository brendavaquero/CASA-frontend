import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";

export function AuthRequiredModal({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Inicia sesión</DialogHeader>

      <DialogBody>
        Para postularte a este taller necesitas una cuenta.
      </DialogBody>

      <DialogFooter className="flex gap-2">
        <Button
          variant="outlined"
          onClick={() => navigate("/registro/participante")}
        >
          Registrarme
        </Button>

        <Button
          onClick={() =>
            navigate("/login", {
              state: { from: location.pathname },
            })
          }
        >
          Iniciar sesión
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
