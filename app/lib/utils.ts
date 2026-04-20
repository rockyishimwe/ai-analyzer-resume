import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID()
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16)
    const value = char === "x" ? random : (random & 0x3) | 0x8

    return value.toString(16)
  })
}

export function parseAIJsonResponse<T>(content: string): T {
  const normalized = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  try {
    return JSON.parse(normalized) as T
  } catch {
    const start = normalized.indexOf("{")
    const end = normalized.lastIndexOf("}")

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(normalized.slice(start, end + 1)) as T
    }

    throw new Error("AI returned invalid JSON")
  }
}

const normalizeSignatureInput = (value: string) =>
  value.replace(/\s+/g, " ").trim().toLowerCase()

const fallbackHash = (value: string) => {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return `h${(hash >>> 0).toString(16)}`
}

export async function createContentSignature(parts: string[]): Promise<string> {
  const normalized = parts.map(normalizeSignatureInput).join("||")

  if (typeof globalThis.crypto?.subtle === "undefined") {
    return fallbackHash(normalized)
  }

  const encoded = new TextEncoder().encode(normalized)
  const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded)

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")
}
