import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";

export default function EvaluacionConfirmModal({
  open,
  onClose,
  onConfirm,
  cargando = false,
}) {
  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Confirmar evaluación</DialogHeader>

      <DialogBody>
        <Typography>
          ¿Estás segura/o de enviar esta evaluación?
          Una vez enviada no podrá modificarse.
        </Typography>
      </DialogBody>

      <DialogFooter className="gap-2">
        <Button variant="text" onClick={onClose} disabled={cargando}>
          Cancelar
        </Button>
        <Button className="gradient" onClick={onConfirm} loading={cargando}>
          Confirmar y enviar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
