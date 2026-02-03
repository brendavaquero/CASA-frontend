import { useEffect, useState } from "react";
import {
  crearInstitucion,
  getAllInstituciones,
  updateInstitucion,
  deleteInstitucion,
} from "@/apis/institucion_Service";
import InstitucionForm from "../componentes/InstitucionForm";

import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const InstitucionesPage = () => {
  const [instituciones, setInstituciones] = useState([]);
  const [editingInstitucion, setEditingInstitucion] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const cargarInstituciones = async () => {
    const data = await getAllInstituciones();
    setInstituciones(data);
  };

  useEffect(() => {
    cargarInstituciones();
  }, []);

  const handleCreate = async (dto, logoFile) => {
    await crearInstitucion(dto, logoFile);
    setShowForm(false);
    cargarInstituciones();
  };

  const handleUpdate = async (dto, logoFile) => {
    await updateInstitucion(editingInstitucion.id, dto, logoFile);
    setEditingInstitucion(null);
    setShowForm(false);
    cargarInstituciones();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta institución?")) return;
    await deleteInstitucion(id);
    cargarInstituciones();
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h4" color="blue-gray">
          Instituciones
        </Typography>

        {!showForm && (
          <Button
            color="black"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Nueva institución
          </Button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <InstitucionForm
          initialData={editingInstitucion}
          onSubmit={editingInstitucion ? handleUpdate : handleCreate}
          onCancel={() => {
            setEditingInstitucion(null);
            setShowForm(false);
          }}
        />
      )}

      {/* Tabla */}
      <Card className="shadow-md">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <Typography variant="h6" color="blue-gray">
            Lista de instituciones
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {["Nombre", "Logo", "Activo", "Acciones"].map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {instituciones.map((inst, index) => {
                const isLast = index === instituciones.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={inst.id}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {inst.nombre}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <img
                        src={
                          inst.logoUrl
                            ? `http://localhost:8080${inst.logoUrl}`
                            : "/placeholder-user.png"
                        }
                        alt="Logo institución"
                        style={{ width: "50px", height: "50px", objectFit: "contain" }}
                      />
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        color={inst.activo ? "green" : "red"}
                        className="font-medium"
                      >
                        {inst.activo ? "Sí" : "No"}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <div className="flex gap-2">
                        <IconButton
                          size="sm"
                          color="black"
                          onClick={() => {
                            setEditingInstitucion(inst);
                            setShowForm(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>

                        <IconButton
                          size="sm"
                          color="red"
                          onClick={() => handleDelete(inst.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default InstitucionesPage;
