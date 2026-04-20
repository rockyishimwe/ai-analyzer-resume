export interface PdfConversionResult {
  imageUrl: string
  file: File | null
  error?: string
}

let pdfjsLib: any = null
let loadPromise: Promise<any> | null = null

import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url"

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib
  if (loadPromise) return loadPromise

  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not typed as a module here
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = workerUrl
    pdfjsLib = lib
    return lib
  })

  return loadPromise
}

export async function extractTextFromPdf(
  file: File,
  options?: {
    maxPages?: number
    maxChars?: number
  }
): Promise<string> {
  try {
    if (!file.type.includes("pdf")) {
      throw new Error(`Invalid file type: ${file.type}. Expected PDF.`)
    }

    const lib = await loadPdfJs()
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise
    const maxPages = Math.min(pdf.numPages, options?.maxPages ?? 2)
    const maxChars = options?.maxChars ?? 9000

    const pageTexts: string[] = []
    let totalChars = 0

    for (let pageIndex = 1; pageIndex <= maxPages; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: { str?: string }) => item.str ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()

      if (pageText) {
        pageTexts.push(pageText)
        totalChars += pageText.length
      }

      if (totalChars >= maxChars) {
        break
      }
    }

    return pageTexts.join("\n").slice(0, maxChars)
  } catch (err) {
    console.error("PDF text extraction error:", err)
    return ""
  }
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    if (!file.type.includes("pdf")) {
      throw new Error(`Invalid file type: ${file.type}. Expected PDF.`)
    }

    const lib = await loadPdfJs()
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise

    if (pdf.numPages === 0) {
      throw new Error("PDF has no pages")
    }

    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 2.2 })

    const maxDimension = 3200
    if (viewport.width > maxDimension || viewport.height > maxDimension) {
      throw new Error(
        `PDF page too large: ${viewport.width}x${viewport.height}. Max allowed: ${maxDimension}x${maxDimension}`
      )
    }

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("Canvas 2D context not available")
    }

    canvas.width = viewport.width
    canvas.height = viewport.height
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = "high"

    await page.render({ canvasContext: context, viewport }).promise

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "")
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            })

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            })
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            })
          }
        },
        "image/png",
        0.92
      )
    })
  } catch (err) {
    console.error("PDF conversion error:", err)
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    }
  }
}
