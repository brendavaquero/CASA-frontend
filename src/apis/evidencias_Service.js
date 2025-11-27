import { downloadZipEvidenciasPrograma } from "../services/ProgramaService";

const handleDownload = async () => {
  const zip = await downloadZipEvidenciasPrograma("PRG2025-00006");

  const url = window.URL.createObjectURL(new Blob([zip]));
  const a = document.createElement("a");
  a.href = url;
  a.download = "evidencias_programa.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
