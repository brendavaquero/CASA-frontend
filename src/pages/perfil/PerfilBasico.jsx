import { Grid, TextField, Typography } from "@mui/material";

const PerfilBasico = ({ usuario, setUsuario }) => {
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Typography variant="h6" mb={2}>
        Información básica
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            value={usuario.nombre || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Apellidos"
            name="apellidos"
            fullWidth
            value={usuario.apellidos || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Correo"
            name="correo"
            fullWidth
            value={usuario.correo || ""}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PerfilBasico;
