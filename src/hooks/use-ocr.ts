import { useState, useCallback } from 'react'

interface OcrResult {
  rawText: string
  parsedDistance: number | null
  parsedTime: string | null
  parsedRaceName: string | null
  confidence: number
}

function parseDistance(text: string): number | null {
  // Match common distance patterns
  const patterns = [
    /marathon/i,
    /half\s*marathon/i,
    /(\d+[.,]\d+)\s*km/i,
    /(\d+)\s*km/i,
    /(\d+[.,]\d+)\s*k\b/i,
    /(\d+)\s*k\b/i,
  ]

  const lowerText = text.toLowerCase()

  if (/\bmarathon\b/i.test(text) && !/half/i.test(text)) return 42.195
  if (/half\s*marathon/i.test(text)) return 21.1

  for (const pattern of patterns.slice(2)) {
    const match = text.match(pattern)
    if (match?.[1]) {
      const value = parseFloat(match[1].replace(',', '.'))
      if (value > 0 && value <= 200) return value
    }
  }

  // Try extracting from "5K", "10K" etc.
  const kMatch = lowerText.match(/\b(\d+)k\b/)
  if (kMatch) {
    const value = parseInt(kMatch[1])
    if (value > 0 && value <= 200) return value
  }

  return null
}

function parseTime(text: string): string | null {
  // Match HH:MM:SS or MM:SS patterns
  const patterns = [
    /(\d{1,2}):(\d{2}):(\d{2})/,   // HH:MM:SS
    /(\d{1,2}):(\d{2})\b/,          // MM:SS
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      if (match[3] !== undefined) {
        // HH:MM:SS
        return `${match[1].padStart(2, '0')}:${match[2]}:${match[3]}`
      }
      // MM:SS — could be minutes:seconds
      const mins = parseInt(match[1])
      if (mins < 60) {
        return `00:${match[1].padStart(2, '0')}:${match[2]}`
      }
    }
  }

  return null
}

function parseRaceName(text: string): string | null {
  const lines = text.split('\n').filter((l) => l.trim().length > 3)
  if (lines.length > 0) {
    // Take the first non-numeric, non-date line as race name
    for (const line of lines) {
      const trimmed = line.trim()
      if (!/^\d+[:/.-]/.test(trimmed) && trimmed.length <= 80) {
        return trimmed
      }
    }
    return lines[0].trim().slice(0, 80)
  }
  return null
}

export function useOcr() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<OcrResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processImage = useCallback(async (file: File) => {
    setStatus('processing')
    setError(null)
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('eng+deu')
      const { data } = await worker.recognize(file)
      await worker.terminate()

      const ocrResult: OcrResult = {
        rawText: data.text,
        parsedDistance: parseDistance(data.text),
        parsedTime: parseTime(data.text),
        parsedRaceName: parseRaceName(data.text),
        confidence: data.confidence,
      }

      setResult(ocrResult)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR processing failed')
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)
  }, [])

  return { status, result, error, processImage, reset }
}
