import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, Button,} from "@mui/material";
import { UserCheck, ChevronLeft } from "lucide-react";
import { getUsuarios } from "@/apis/usuarios";
import { createJurado } from "@/apis/jurado";
import { enviarCorreo } from "@/apis/emailService";
import ModalMensaje from "@/componentes/ModalMensaje";

const AsignarJurados = ({ convocatoria,onVolver }) => {
  const [jurados, setJurados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");


/*   const handleEnviarCorreos = async (juradosSeleccionados) => {
    try {
      for (const jurado of juradosSeleccionados) {
        if (!jurado.correo) continue;

        const mensaje = `
  Hola ${jurado.nombre} ${jurado.apellidos},

  Te notificamos que has sido asignado como jurado en la convocatoria:
  "${convocatoria?.titulo}"

  Tu participación es muy valiosa para nosotros.
  Por favor inicia sesión en el sistema para revisar los detalles.

  Saludos cordiales,
  Centro de las Artes de San Agustín
        `;

        await enviarCorreo({
          correo: jurado.correo,
          asunto: "Asignación como Jurado – CaSa",
          mensaje,
        });
      }

      setModalTitle("Éxito");
      setModalMessage("Jurados asignados y correos enviados correctamente");
      setModalOpen(true);

    } catch (error) {
      console.error(error);
      setModalTitle("Error");
      setModalMessage("Ocurrió un error al enviar los correos");
      setModalOpen(true);
    }
  }; */


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

      const juradosSeleccionados = jurados.filter(j =>
        seleccionados.includes(j.idUsuario)
      );

      await handleEnviarCorreos(juradosSeleccionados);

      setSeleccionados([]);

    } catch (error) {
      console.error("Error al asignar jurados:", error);
        setModalTitle("Error");
        setModalMessage("Error al asignar jurados");
        setModalOpen(true);
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
      <ModalMensaje
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        confirmText="Aceptar"
        onConfirm={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AsignarJurados;
