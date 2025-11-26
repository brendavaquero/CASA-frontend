import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

const DialogDefault = ({ open, onClose, title, message, onConfirm }) => {
  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>{title}</DialogHeader>

      <DialogBody>{message}</DialogBody>

      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose} className="mr-1">
          Cerrar
        </Button>

        {onConfirm && (
          <Button variant="gradient" color="black" onClick={onConfirm}>
            Aceptar
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default DialogDefault;