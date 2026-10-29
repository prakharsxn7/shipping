import React, { useRef } from 'react';
import { FileText, UploadCloud, X, RefreshCw, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export default function PdfUploadField({
  id,
  label,
  required = false,
  file,
  error,
  onFileChange,
  onError,
}) {
  const inputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile) return;

    // Validate PDF type
    const isPdf =
      selectedFile.type === 'application/pdf' ||
      selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      if (onError) {
        onError('Only PDF format documents are supported');
      }
      return;
    }

    // Validate size limit
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      if (onError) {
        onError('File exceeds maximum allowed size of 5 MB');
      }
      return;
    }

    // Store in local state only
    onFileChange(selectedFile);
    if (onError) {
      onError('');
    }
  };

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleFileSelection(selected);
    }
    // Reset input value so re-selecting same file triggers change
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(null);
    if (onError) {
      onError('');
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleReplace = (e) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-slate-800">
          {label}{' '}
          {required ? (
            <span className="text-red-500 font-normal" aria-label="Required">
              *
            </span>
          ) : (
            <span className="text-slate-400 font-normal text-xs">(Optional)</span>
          )}
        </label>
        <span className="text-xs text-slate-500 font-medium">PDF only (max 5 MB)</span>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleChange}
        className="hidden"
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {file ? (
        /* Selected file display */
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg border bg-slate-50/70 transition-colors ${
            error ? 'border-red-400 bg-red-50/10' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3 min-w-0 mr-3">
            <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-slate-500">{formatFileSize(file.size)} &bull; PDF</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleReplace}
              className="inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
              aria-label={`Replace ${label}`}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1 text-slate-500" aria-hidden="true" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Remove ${label}`}
            >
              <X className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Empty upload button / drop zone */
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`flex items-center justify-between p-3.5 rounded-lg border border-dashed transition-all cursor-pointer bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
            error
              ? 'border-red-400 bg-red-50/20'
              : 'border-slate-300 hover:border-slate-400'
          }`}
          aria-label={`Upload ${label} PDF`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
              <UploadCloud className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Click to browse or drop file
              </p>
              <p className="text-xs text-slate-400">PDF document only, up to 5 MB</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Browse PDF
          </span>
        </div>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center text-xs text-red-600 font-medium mt-1"
        >
          <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

