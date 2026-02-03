import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";

const InstitucionForm = ({ onSubmit, initialData, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [activo, setActivo] = useState(true);
  const logoRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setActivo(initialData.activo ?? true);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const institucionDto = {
      nombre,
      activo,
    };

    const logoFile = logoRef.current?.files[0] || null;
    onSubmit(institucionDto, logoFile);
  };

  return (
    <Card className="max-w-lg mx-auto shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardBody className="flex flex-col gap-6">
          <Typography variant="h5" color="black">
            {initialData ? "Editar institución" : "Nueva institución"}
          </Typography>

          <Input
            label="Nombre de la institución"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <Checkbox
            label="Institución activa"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />

          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Logotipo
            </Typography>
            <input
              type="file"
              ref={logoRef}
              accept="image/*"
              className="block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </CardBody>

        <CardFooter className="flex justify-end gap-3 pt-0">
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              color="blue-gray"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" color="black">
            Guardar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InstitucionForm;
