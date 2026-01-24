import { Box, Paper, Typography, Button } from "@mui/material";
import { useState } from "react";
import PerfilBasico from "./PerfilBasico";
import PerfilDocente from "./PerfilDocente";
import PerfilParticipante from "./PerfilParticipante";
import { updateParticipante } from "@/apis/participante_Service";
import { updateUsuarioGen } from "@/apis/usuarios";
import { updateDocente } from "@/apis/docente_Service";

const Perfil = ({ usuario }) => {
  const rol = usuario.rol;

  const [usuarioEdit, setUsuarioEdit] = useState(usuario);
  const [docenteEdit, setDocenteEdit] = useState(usuario.docente || {});
  const [participanteEdit, setParticipanteEdit] = useState(null);
  const [foto, setFoto] = useState(null);

  const handleGuardar = async () => {
    try {
      // 1️⃣ actualizar datos básicos (todos)
      await updateUsuarioGen(usuario.idUsuario, {
        nombre: usuarioEdit.nombre,
        apellidos: usuarioEdit.apellidos,
        correo: usuarioEdit.correo,
      });

      // 2️⃣ DOCENTE
      if (rol === "DOCENTE") {
        const formData = new FormData();
        formData.append(
          "docente",
          new Blob([JSON.stringify(docenteEdit)], {
            type: "application/json",
          })
        );

        if (foto) {
          formData.append("foto", foto);
        }

        await updateDocente(usuario.idUsuario, formData);
      }

      // 3️⃣ PARTICIPANTE
      if (rol === "PARTICIPANTE") {
        await updateParticipante(usuario.idUsuario, participanteEdit);
      }

      alert("Perfil actualizado correctamente ✅");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil ❌");
    }
  };

  return (
    <Box p={4} maxWidth="900px" mx="auto">
      <Typography variant="h5" fontWeight="bold" mb={3}>
        👤 Mi perfil
      </Typography>

      <Paper sx={{ p: 4 }}>
        <PerfilBasico
          usuario={usuarioEdit}
          setUsuario={setUsuarioEdit}
        />

        {rol === "DOCENTE" && (
          <PerfilDocente
            docente={docenteEdit}
            setDocente={setDocenteEdit}
            setFoto={setFoto}
          />
        )}

        {rol === "PARTICIPANTE" && (
          <PerfilParticipante
            participante={participanteEdit}
            setParticipante={setParticipanteEdit}
            idParticipante={usuario.idUsuario}
          />
        )}

        <Box textAlign="right" mt={4}>
          <Button
            variant="contained"
            sx={{ bgcolor: "black" }}
            onClick={handleGuardar}
          >
            Guardar cambios
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Perfil;
