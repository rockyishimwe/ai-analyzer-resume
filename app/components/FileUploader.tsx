import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const FileUploader = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // handle dropped files here
    console.log('Dropped files:', acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className='w-full gradient-border'>
      <input {...getInputProps()} />
      {isDragActive ? 'Drop files here...' : 'Drag and drop files, or click to select'}
    </div>
  )
}

export default FileUploader