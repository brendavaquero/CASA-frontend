import { Typography } from "@material-tailwind/react";

export default function FileViewer({ obra }) {
  return (
    <div className="border rounded-lg p-4 h-[400px] md:h-[500px] flex flex-col">

      <Typography variant="h6" className="mb-2">
        Vista previa de la obra
      </Typography>

      {obra.tipoArchivo === "DOCUMENTO" && (
        <iframe
          key={obra.archivoUrl}
          src={`${obra.archivoUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          title="Visor PDF"
          className="w-full h-full border rounded"
        />
      )}

      {obra.tipoArchivo === "AUDIO" && (
        <div className="flex flex-col justify-center h-full">
          <audio
            key={obra.archivoUrl}
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            className="w-full"
          >
            <source src={obra.archivoUrl} type="audio/mpeg" />
            Tu navegador no soporta audio.
          </audio>


        </div>
      )}
    </div>
  );
}
