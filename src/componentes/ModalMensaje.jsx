import { useEffect } from "react";
import {  Dialog,  DialogTitle,  DialogContent,  DialogActions,  Button,  Typography,  Box} from "@mui/material";
import modalIcon from "@/assets/images/logoCaSa.png";

const ModalMensaje = ({open, onClose, title = "Mensaje", message = "", type = "info", autoClose = false, autoCloseTime = 10000, onConfirm, onCancel, confirmText = "Sí", cancelText = "No"}) => {

  useEffect(() => {
    if (!open) return;

    // cerrar mensaje de informacion
    if (type === "info" && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [open, type, autoClose, autoCloseTime, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            component="img"
            src={modalIcon}
            alt="icon"
            sx={{ width: 50, height: 50 }}
          />
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent >
        <Typography>{message}</Typography>
      </DialogContent>

      {type === "confirm" && (
        <DialogActions>
          <Button onClick={onCancel ?? onClose} color="black" className="hover:bg-gray-300">
            {cancelText}
          </Button>
          <Button variant="contained" sx={{bgcolor:"black"}} className="hover:bg-gray-700" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalMensaje;
