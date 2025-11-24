import PostulacionesPendientesTable from "../componentes/PostulacionesPendientesTable";

export function PostulacionesPendientesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Postulaciones pendientes
      </h1>

      <PostulacionesPendientesTable />
    </div>
  );
}

export default PostulacionesPendientesPage;