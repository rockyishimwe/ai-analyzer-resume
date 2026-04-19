 export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

// @ts-expect-error
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then(async (lib) => {
    // Set the worker source
    lib.GlobalWorkerOptions.workerSrc = workerUrl;
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    if (!file.type.includes('pdf')) {
      throw new Error(`Invalid file type: ${file.type}. Expected PDF.`);
    }

    console.log('Loading PDF.js...');
    const lib = await loadPdfJs();
    console.log('PDF.js loaded, processing file:', file.name, file.size);

    const arrayBuffer = await file.arrayBuffer();
    console.log('Array buffer created, size:', arrayBuffer.byteLength);

    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    console.log('PDF loaded, pages:', pdf.numPages);

    if (pdf.numPages === 0) {
      throw new Error('PDF has no pages');
    }

    const page = await pdf.getPage(1);
    console.log('Page 1 loaded');

    const viewport = page.getViewport({ scale: 4 });
    console.log('Viewport:', viewport.width, viewport.height);

    // Check for unreasonably large canvas
    const maxDimension = 4096; // Max canvas size
    if (viewport.width > maxDimension || viewport.height > maxDimension) {
      throw new Error(`PDF page too large: ${viewport.width}x${viewport.height}. Max allowed: ${maxDimension}x${maxDimension}`);
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas 2D context not available");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    console.log('Rendering page...');
    await page.render({ canvasContext: context, viewport }).promise;
    console.log('Page rendered successfully');

    return new Promise((resolve) => {
      console.log('Converting canvas to blob...');
      canvas.toBlob(
        (blob) => {
          console.log('Blob created:', blob ? blob.size : 'null');
          if (blob) {
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      ); // Set quality to maximum (1.0)
    });
  } catch (err) {
    console.error('PDF conversion error:', err);
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}