import { useCallback, useState } from "react"
import { FileText, UploadCloud, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const maxFileSize = 20 * 1024 * 1024

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0] || null
      setFile(selectedFile)
      onFileSelect?.(selectedFile)
    },
    [onFileSelect]
  )

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    onFileSelect?.(null)
  }

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    })

  return (
    <div
      {...getRootProps()}
      role="button"
      tabIndex={0}
      aria-label="PDF file upload area. Press Enter or Space to select a file, or drag and drop a PDF file here."
      aria-describedby="upload-helper"
      className={cn(
        "w-full rounded-[30px] border border-dashed p-6 text-left transition duration-300",
        file
          ? "border-slate-200 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
          : isDragActive
            ? "border-slate-950 bg-[#f8fbff] shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
            : "border-slate-300 bg-white/80 hover:border-slate-500 hover:bg-white/90"
      )}
    >
      <input {...getInputProps()} aria-label="PDF file input" />

      {file ? (
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <FileText className="size-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">{file.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                PDF selected · {formatSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Click to replace</span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={removeFile}
              className="rounded-full border-slate-200 bg-white"
              aria-label={`Remove ${file.name}`}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-3xl bg-slate-950 text-white">
            <UploadCloud className="size-7" />
          </div>

          <div className="space-y-2">
            <p className="text-base font-semibold text-slate-950">
              Upload a resume PDF
            </p>
            <p className="text-sm leading-7 text-slate-500">
              Drag and drop the file here or click to browse from your device.
            </p>
          </div>

          <p
            id="upload-helper"
            className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
          >
            PDF only · max {formatSize(maxFileSize)}
          </p>
        </div>
      )}

      {fileRejections.length > 0 && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          Invalid file. Only PDF files under {formatSize(maxFileSize)} are allowed.
        </p>
      )}
    </div>
  )
}

export default FileUploader
