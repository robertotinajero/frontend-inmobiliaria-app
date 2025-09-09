// src/components/contracts/tabs/FilesTab.jsx
export default function FilesTab({
  files = [],
  inputRef,
  accept,
  maxSizeMB,
  uploading,
  previews = [],
  handleAddFiles,
  handleDrop,
  handleRemove,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            onChange={(e) => handleAddFiles(e.target.files)}
            hidden
            disabled={uploading}
          />
          Seleccionar archivos
        </label>
        <span className="text-sm text-gray-600">Tipos: {accept}</span>
        <span className="text-sm text-gray-600">Máx: {maxSizeMB} MB</span>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded p-6 text-center text-gray-600"
      >
        Arrastra y suelta aquí, o usa “Seleccionar archivos”
      </div>

      <div className="max-h-64 overflow-auto divide-y border rounded">
        {files.length === 0 && (
          <div className="p-3 text-sm text-gray-500">No hay archivos añadidos.</div>
        )}
        {files.map((f, i) => (
          <div key={`${f.name}_${f.size}_${i}`} className="p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{f.name}</div>
              <div className="text-xs text-gray-500">
                {(f.size / (1024 * 1024)).toFixed(2)} MB • {f.type || "sin tipo"}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {previews[i] && (
                <a href={previews[i]} target="_blank" rel="noreferrer" className="px-2 py-1 text-sm rounded border hover:bg-gray-50">
                  Vista previa
                </a>
              )}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="px-2 py-1 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {uploading && <div className="text-sm text-gray-600">Subiendo…</div>}
    </div>
  );
}
