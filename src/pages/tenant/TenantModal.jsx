import { useState, useEffect, Suspense } from "react";
import { Button, TextField, Tabs, Tab, } from "@mui/material";
import {
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaDownload
} from "react-icons/fa";

// === DROPZONE COMPONENT ===
function Dropzone({ label, name, onFileSelect, existingFile, onDownload, tenant }) {
  const [highlight, setHighlight] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setHighlight(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(name, file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(name, file);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>

      <div className="grid sm:grid-cols-2 gap-3">
        <label
          htmlFor={`dropzone-${name}`}
          onDragOver={(e) => {
            e.preventDefault();
            setHighlight(true);
          }}
          onDragLeave={() => setHighlight(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-20 border-2 ${highlight ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors`}
        >
          <div className="flex flex-col items-center justify-center text-center p-2 mt-6 mb-6">
            <svg
              className="w-6 h-6 mb-1 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Haz clic para subir</span> o arrastra el archivo aquí
            </p>
            <p className="text-xs text-gray-500">JPG, PNG o PDF (máx. 5 MB)</p>
            {(fileName || existingFile) && (
              <p className="mt-1 text-xs text-blue-600 font-small truncate w-58">
                {fileName || existingFile}
              </p>
            )}
          </div>
          <input
            id={`dropzone-${name}`}
            type="file"
            name={name}
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {existingFile && (
          <FilePreview
            existingFile={existingFile}
            onDownload={onDownload}
            tenant={tenant}
          />
        )}
      </div>
    </div>
  );
}

// === FILE PREVIEW COMPONENT ===
const FilePreview = ({ existingFile, onDownload, tenant }) => {
  const [fileInfo, setFileInfo] = useState(null);

  const fileName = existingFile.split("_").pop();
  const extension = fileName.split(".").pop().toUpperCase();

  const getFileIcon = () => {
    const ext = extension.toLowerCase();
    if (ext === "pdf") return <FaFilePdf className="text-red-500 w-6 h-6" />;
    if (["jpg", "jpeg", "png"].includes(ext))
      return <FaFileImage className="text-blue-500 w-6 h-6" />;
    return <FaFileAlt className="text-gray-500 w-6 h-6" />;
  };

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/tenants/${tenant.id_tenant}/fileinfo/${existingFile}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setFileInfo(data);
      } catch (error) {
        console.error("Error al obtener la información del archivo:", error);
      }
    };
    if (tenant?.id_tenant && fileName) fetchFileInfo();
  }, [tenant, existingFile]);

  return (
    <div className="flex items-start bg-gray-50 dark:bg-gray-600 rounded-xl p-3 gap-3">
      {getFileIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {fileName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {fileInfo
            ? `${fileInfo.sizeMB} MB • ${fileInfo.extension.toUpperCase()}`
            : "Cargando..."}
        </p>
      </div>
      <Button
        onClick={onDownload}
        className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg"
      >
        <FaDownload className="text-gray-700 dark:text-white w-4 h-4" />
      </Button>
    </div>
  );
};

// === MAIN MODAL COMPONENT ===
export default function TenantModal({ onClose, onSave, tenant }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    curp: "",
    rfc: "",
    email: "",
    phone: "",
    referenceName1: "",
    referencePhone1: "",
    referenceName2: "",
    referencePhone2: "",
    ine: null,
    comprobante: null,
    estado_cuenta: null,
  });
  // Tabs
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (tenant) {
      setForm({
        firstname: tenant.firstname || "",
        lastname: tenant.lastname || "",
        curp: tenant.curp || "",
        rfc: tenant.rfc || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        referenceName1: tenant.reference1_name || "",
        referencePhone1: tenant.reference1_phone || "",
        referenceName2: tenant.reference2_name || "",
        referencePhone2: tenant.reference2_phone || "",
        ine: tenant.ine || null,
        comprobante: tenant.comprobante || null,
        estado_cuenta: tenant.estado_cuenta || null,
      });
    }
  }, [tenant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (name, file) => {
    setForm((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });
    onSave(formData);
  };

  const downloadFile = (filename) => {
    if (!tenant?.id_tenant || !filename) return;
    const token = localStorage.getItem("token");
    fetch(`/api/tenants/${tenant.id_tenant}/download/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(console.error);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <h1 className="text-lg font-semibold mb-1">
          {tenant ? "Editar inquilino" : "Nuevo inquilino"}
        </h1>
        {/* Tabs */}
        <div className="mb-3 shrink-0">
          <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="tabs contract" variant="fullWidth">
            <Tab label="Información" />
            <Tab label="Archivos" />
          </Tabs>
        </div>
        <div className="overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <form onSubmit={handleSubmit}>
            {/* Panel DATOS */}

            <Suspense fallback={<div className="text-gray-500">Cargando…</div>}>
              {tab === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                    <TextField label="Nombre(s)" name="firstname" fullWidth size="small" value={form.firstname} onChange={handleChange} required />
                    <TextField label="Apellidos" name="lastname" fullWidth size="small" value={form.lastname} onChange={handleChange} required />
                    <TextField label="Teléfono" name="phone" fullWidth size="small" value={form.phone} onChange={handleChange} required />
                    <TextField label="CURP" name="curp" fullWidth size="small" value={form.curp} onChange={handleChange} />
                    <TextField label="RFC" name="rfc" fullWidth size="small" value={form.rfc} onChange={handleChange} />
                    <TextField label="Correo electrónico" name="email" type="email" fullWidth size="small" value={form.email} onChange={handleChange} />
                  </div>
                  {/* REFERENCIAS */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Referencias</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField label="Nombre referencia 1" name="referenceName1" fullWidth size="small" value={form.referenceName1} onChange={handleChange} />
                    <TextField label="Teléfono referencia 1" name="referencePhone1" fullWidth size="small" value={form.referencePhone1} onChange={handleChange} />
                    <TextField label="Nombre referencia 2" name="referenceName2" fullWidth size="small" value={form.referenceName2} onChange={handleChange} />
                    <TextField label="Teléfono referencia 2" name="referencePhone2" fullWidth size="small" value={form.referencePhone2} onChange={handleChange} />
                  </div>

                </div>
              )}

              {/* DOCUMENTOS */}
              {tab === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                    <Dropzone label="INE" name="ine" tenant={tenant} onFileSelect={handleFileSelect} existingFile={tenant?.ine} onDownload={() => downloadFile(tenant?.ine)} />
                    <Dropzone label="Comprobante de domicilio" name="comprobante" tenant={tenant} onFileSelect={handleFileSelect} existingFile={tenant?.comprobante} onDownload={() => downloadFile(tenant?.comprobante)} />
                    <Dropzone label="Estado de cuenta" name="estado_cuenta" tenant={tenant} onFileSelect={handleFileSelect} existingFile={tenant?.estado_cuenta} onDownload={() => downloadFile(tenant?.estado_cuenta)} />
                  </div>
                </div>
              )}
            </Suspense>
            <div className="flex justify-end gap-2 mt-6 pb-2">
              {/* Botones */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
