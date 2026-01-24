import { Grid, TextField, Typography } from "@mui/material";
import FormImageDocente from "./FormImageDocente";

const PerfilDocente = ({ docente, setDocente, setFoto }) => {
  return (
    <>
      <Typography variant="h6" mt={4} mb={2}>
        Información del docente
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Semblanza"
            multiline
            rows={4}
            fullWidth
            value={docente.semblanza || ""}
            onChange={(e) =>
              setDocente({ ...docente, semblanza: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <FormImageDocente onFileSelected={setFoto} />
        </Grid>
      </Grid>
    </>
  );
};

export default PerfilDocente;
