import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

const maxFileSize = 20 * 1024 * 1024; // 20MB

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0] || null;
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    },
    [onFileSelect]
  );

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening file dialog
    setFile(null);
    onFileSelect?.(null);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  return (
    <div
      {...getRootProps()}
      role="button"
      tabIndex={0}
      className={`w-full gradient-border p-6 rounded-xl text-center cursor-pointer transition ${
        isDragActive ? "bg-blue-50 border-blue-400" : ""
      }`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div
          className="flex items-center justify-between gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* File Info */}
          <div className="flex items-center gap-3">
            <img src="/images/pdf.png" alt="pdf" className="w-10 h-10" />

            <div className="text-left">
              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatSize(file.size)}
              </p>
            </div>
          </div>

          {/* Remove Button */}
          <button
            className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
            onClick={removeFile}
          >
            <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <img src="/icons/info.svg" alt="Upload" className="w-12 h-12" />

          <p className="text-gray-600">
            <span className="font-semibold">Click to upload</span> or drag and drag
          </p>

          <p className="text-sm text-gray-400">
            PDF (max {formatSize(maxFileSize)})
          </p>
        </div>
      )}

      {/* Error handling */}
      {fileRejections.length > 0 && (
        <p className="text-red-500 text-sm mt-3">
          Invalid file. Only PDF files under {formatSize(maxFileSize)} are allowed.
        </p>
      )}
    </div>
  );
};

export default FileUploader;