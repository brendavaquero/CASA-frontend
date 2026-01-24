import { Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { getParticipanteById } from "@/apis/participante_Service";

const PerfilParticipante = ({
  idParticipante,
  participante,
  setParticipante,
}) => {
  console.log(idParticipante);
  useEffect(() => {
    if (!idParticipante) return;
    console.log("entroaqui")

    const fetchData = async () => {
      const res = await getParticipanteById(idParticipante);
      setParticipante(res);
    };

    fetchData();
  }, [idParticipante]);

  if (!participante) {
    return (
      <Typography mt={2} color="text.secondary">
        Cargando información del participante...
      </Typography>
    );
  }

  console.log(participante);

  const handleChange = (e) => {
    setParticipante({
      ...participante,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Typography variant="h6" mt={4} mb={2}>
        Información del participante
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Teléfono"
            name="numeroTelefono"
            fullWidth
            value={participante.numeroTelefono || ""}
            onChange={(e) =>
              setParticipante({
                ...participante,
                numeroTelefono: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Grado de estudios"
            name="gradoEstudio"
            fullWidth
            value={participante.gradoEstudio || ""}
            onChange={(e) =>
              setParticipante({
                ...participante,
                gradoEstudio: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Ocupación"
            name="ocupacion"
            fullWidth
            value={participante.ocupacion || ""}
            onChange={(e) =>
              setParticipante({
                ...participante,
                ocupacion: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PerfilParticipante;
