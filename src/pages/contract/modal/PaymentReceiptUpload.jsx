// src/components/contracts/tabs/PaymentReceiptUpload.jsx
import { useRef, useState } from "react";
import { FaCloudUploadAlt, FaPaperclip, FaSpinner, FaEye } from "react-icons/fa";

export default function PaymentReceiptUpload({
  idPayment,
  onUpload,                    // async (idPayment, file)
  accept = "image/*,application/pdf",
  maxSizeKB = 10 * 1024,       // 10 MB
  existingUrl,
  existingName,
  uploading = false,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [tempName, setTempName] = useState("");

  const clickPicker = (e) => {
    e.preventDefault();
    if (disabled) return;
    inputRef.current?.click();
  };

  const isAllowedType = (file) => {
    if (!accept || accept === "*") return true;
    const parts = accept.split(",").map((t) => t.trim());
    if (file.type) {
      // valida por mime
      const ok = parts.some((t) =>
        t.endsWith("/*") ? file.type.startsWith(t.replace("/*", "/")) : file.type === t
      );
      if (ok) return true;
    }
    // fallback: valida por extensión si no trae type
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ext) return false;
    const mapExt = {
      pdf: "application/pdf",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      gif: "image/gif",
    };
    const extMime = mapExt[ext];
    if (!extMime) return false;
    return parts.some((t) => (t.endsWith("/*") ? extMime.startsWith(t.replace("/*", "/")) : t === extMime));
  };

  const onFilePicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset
    if (!file) return;

    const sizeKB = Math.floor(file.size / 1024);
    if (sizeKB > maxSizeKB) {
      alert(`Máximo permitido: ${(maxSizeKB / 1024).toFixed(0)} MB`);
      return;
    }
    if (!isAllowedType(file)) {
      alert(`Tipo no permitido (${file.type || file.name}). Permitidos: ${accept}`);
      return;
    }

    // Optimista: muestra nombre mientras sube
    setTempName(file.name);
    try {
      await onUpload?.(idPayment, file);
      // el padre actualizará receipt_url/receipt_name; mantenemos tempName hasta que llegue
    } catch (err) {
      // si falla, limpia tempName
      setTempName("");
      console.error(err);
    }
  };

  const displayName =
    existingName ||
    (existingUrl ? String(existingUrl).split("/").pop() : "") ||
    tempName ||
    "";

  return (
    <div className="flex items-center gap-3">
      {existingUrl ? (
        <a
          href={existingUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline inline-flex items-center gap-1"
          title={displayName}
        >
          <FaEye />
          <span className="truncate max-w-[180px]">{displayName || "Ver"}</span>
        </a>
      ) : displayName ? (
        <span className="text-gray-700 inline-flex items-center gap-2 truncate max-w-[220px]" title={displayName}>
          <FaPaperclip />
          <span className="truncate">{displayName}</span>
          {uploading && <FaSpinner className="animate-spin text-gray-400" />}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">Sin archivo</span>
      )}

      <button
        type="button"
        onClick={clickPicker}
        className="inline-flex items-center gap-2 text-blue-600 hover:underline disabled:opacity-50"
        disabled={disabled}
      >
        <FaCloudUploadAlt />
        Adjuntar
      </button>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        onChange={onFilePicked}
      />
    </div>
  );
}
